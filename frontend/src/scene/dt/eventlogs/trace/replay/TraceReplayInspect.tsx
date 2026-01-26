import { TraceReplayTimeline } from "@/scene/dt/eventlogs/trace/replay/TraceReplayTimeline.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type EventLogTrace, EventReplayState, getEventLog } from "@/scene/dt/eventlogs/data.ts";
import { useParams } from "react-router";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useWebSocket } from "@/service/webSocketProvider.tsx";
import { MessageType, type StateTransitionInfo } from "@/service/wsTypes.ts";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import { ReplayDetailCards } from "@/scene/dt/eventlogs/trace/replay/ReplayDetailCards.tsx";

export function TraceReplayInspect() {
  const { logId, dtId, traceName } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EventLogTrace | null>();
  const { socket } = useWebSocket();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getEventLog(Number(dtId), Number(logId));
        setData(response.data.eventLog.traces.find(it => it.name === traceName));
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, logId, socket, traceName]);

  const topics = useMemo(
    () => [`replay-${logId}-${traceName}`],
    [logId, traceName],
  );

  const onStateChangeMessage = useCallback((msg: StateTransitionInfo) => {
    setData((prevData) => {
      if (prevData) {
        return {
          ...prevData,
          events: msg.message.allEvents,
        };
      }
    });
  }, []);

  const onReplayEnd = useCallback(() => {
    setData((prevData) => {
      if (prevData) {
        return {
          ...prevData,
          events: prevData.events.map(it => {
            return {
              name: it.name,
              source: it.source,
              datetime: it.datetime,
              value: it.value,
              replayState: EventReplayState.NOT_EXECUTED,
            };
          }),
        };
      }
    });
  }, []);

  useFilteredWebsocket<StateTransitionInfo>(
    topics,
    MessageType.STATE_TRANSITION,
    onStateChangeMessage,
    onReplayEnd
  );

  if (loading) {
    return <Spinner />;
  } else {
    if (data === null) {
      return <div>Error: Trace {traceName} not found in Event Log!</div>;
    } else {
      return (
        <main className="flex flex-row w-full">
          <TraceReplayTimeline trace={data!} setTrace={setData} />
          <ReplayDetailCards />
        </main>
      );
    }
  }
}