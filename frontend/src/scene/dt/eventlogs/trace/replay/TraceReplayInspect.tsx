import { TraceReplayTimeline } from "@/scene/dt/eventlogs/trace/replay/TraceReplayTimeline.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type EventLogTrace, getEventLog } from "@/scene/dt/eventlogs/data.ts";
import { useParams } from "react-router";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useWebSocket } from "@/service/webSocketProvider.tsx";
import { MessageType, type StateTransitionInfo } from "@/service/wsTypes.ts";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";

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
    console.debug(`rcv from server: `, msg);

    // Using the (prev) => ... syntax ensures this function
    // reference never changes, even when data updates.
    setData((prevData) => {
      if (prevData) {
        return {
          ...prevData,
          events: msg.message.allEvents,
        };
      }
    });
  }, []);


  useFilteredWebsocket<StateTransitionInfo>(
    topics,
    MessageType.STATE_TRANSITION,
    onStateChangeMessage,
  );

  if (loading) {
    return <Spinner />;
  } else {
    if (data === null) {
      return <div>Error: Trace {traceName} not found in Event Log!</div>;
    } else {
      return (
        <>
          <TraceReplayTimeline trace={data!} setTrace={setData} />
        </>
      );
    }
  }
}