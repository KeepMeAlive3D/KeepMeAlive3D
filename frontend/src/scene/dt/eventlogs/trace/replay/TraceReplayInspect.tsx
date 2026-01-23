import { TraceReplayTimeline } from "@/scene/dt/eventlogs/trace/replay/TraceReplayTimeline.tsx";
import { useEffect, useState } from "react";
import { type EventLogTrace, getEventLog } from "@/scene/dt/eventlogs/data.ts";
import { useParams } from "react-router";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useWebSocket } from "@/service/webSocketProvider.tsx";
import { type EventSubscribe, MessageType, type StateTransitionInfo } from "@/service/wsTypes.ts";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";

export function TraceReplayInspect() {
  const { logId, dtId, traceName } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EventLogTrace | null>();
  const { socket } = useWebSocket()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getEventLog(Number(dtId), Number(logId));
        setData(response.data.eventLog.traces.find(it => it.name === traceName));
      } finally {
        setLoading(false);

        const topicSub = {
          manifest: {
            version: 1,
            messageType: MessageType.SUBSCRIBE_TOPIC,
            timestamp: new Date().valueOf(),
            bearerToken: localStorage.getItem("token") ?? "null",
            uuid: localStorage.getItem("uuid"),
          },
          message: {
            topic: `replay-${logId}-${traceName}`,
          },
        } as EventSubscribe;

        socket?.send(JSON.stringify(topicSub))
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, logId, socket, traceName]);

  useFilteredWebsocket<StateTransitionInfo>(
    [`replay-${logId}-${traceName}`],
    MessageType.STATE_TRANSITION,
    onStateChangeMessage
  );

  function onStateChangeMessage(msg: StateTransitionInfo) {
    console.debug(`rcv from server: `, msg)
    setData({
      name: data?.name ?? "unknown",
      events: msg.message.allEvents
    })
  }

  if(loading) {
    return <Spinner/>
  } else {
    if(data === null) {
      return <div>Error: Trace {traceName} not found in Event Log!</div>
    } else {
      return (
        <>
          <TraceReplayTimeline trace={data!}/>
        </>
      )
    }
  }
}