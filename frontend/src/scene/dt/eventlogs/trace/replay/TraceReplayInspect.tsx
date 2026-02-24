import { TraceReplayTimeline } from "@/scene/dt/eventlogs/trace/replay/TraceReplayTimeline.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EventLogType, EventReplayState } from "@/scene/dt/eventlogs/data.ts";
import { useParams } from "react-router";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useWebSocket } from "@/service/webSocketProvider.tsx";
import { MessageType, type StateTransitionInfo } from "@/service/wsTypes.ts";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import { ReplayDetailCards } from "@/scene/dt/eventlogs/trace/replay/ReplayDetailCards.tsx";
import { getReplayState, type ReplayInfo } from "@/scene/dt/eventlogs/trace/replay/data.ts";

export function TraceReplayInspect() {
  const { dtId, traceName, refId } = useParams();
  const [loading, setLoading] = useState(true);
  const [processTraces, setProcessTraces] = useState<ReplayInfo[]>([]);
  const [refresh, setRefresh] = useState(false)
  const { socket } = useWebSocket();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const state = await getReplayState(Number(dtId), Number(refId), traceName ?? "");
        setProcessTraces(state.data);
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, refId, socket, traceName, refresh]);

  const topics = useMemo(
    () => [`replay-${refId}-${traceName}`],
    [refId, traceName],
  );

  const onStateChangeMessage = useCallback((msg: StateTransitionInfo) => {
    setProcessTraces((prevData) =>
      prevData.map((trace) =>
        trace.type === msg.message.type && trace.typeId === msg.message.typeId
          ? {
            ...trace,
            state: { ...trace.state, events: msg.message.allEvents },
            activeStates: msg.message.activeStates ?? []
          }
          : trace,
      ),
    );
    if(msg.message.type === EventLogType.PROCESS)
      console.debug(`rcv events: `, msg.message.allEvents.map(it => `${it.name} - ${it.replayState}`));
  }, []);

  const onReplayEnd = useCallback(() => {
    setProcessTraces((prevData) =>
      prevData.map((trace): ReplayInfo => {
          return {
            ...trace,
            state: {
              ...trace.state,
              events: trace.state.events.map(ev => {
                return {
                  ...ev,
                  replayState: EventReplayState.NOT_EXECUTED,
                };
              }),
            },
            activeStates: []
          };
        },
      ),
    );
    console.debug("End replay")
    setRefresh(!refresh)
  }, [refresh]);


  useFilteredWebsocket<StateTransitionInfo>(
    topics,
    MessageType.STATE_TRANSITION,
    onStateChangeMessage,
    onReplayEnd,
  );

  if (loading) {
    return <Spinner />;
  } else {
    if (processTraces === undefined) {
      return <div>Error: Trace {traceName} not found in Event Log!</div>;
    } else {
      return (
        <main className="flex flex-row w-full">
          <TraceReplayTimeline trace={processTraces.find(it => it.type == EventLogType.PROCESS)}
                               setTrace={setProcessTraces} />
          <ReplayDetailCards traces={processTraces} />
        </main>
      );
    }
  }
}