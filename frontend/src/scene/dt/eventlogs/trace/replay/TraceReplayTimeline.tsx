import { Timeline, TimelineItem } from "@/components/custom/Timeline.tsx";
import { type EventLogTrace, EventReplayState } from "@/scene/dt/eventlogs/data.ts";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Flame, Pause, Play, Rewind, SkipForward } from "lucide-react";
import {
  MessageType,
  type ReplayEnd,
  type ReplayForwardEvent,
  type ReplayPauseEvent,
  type ReplayStart,
} from "@/service/wsTypes.ts";
import { useWebSocket } from "@/service/webSocketProvider.tsx";
import { useParams } from "react-router";
import { useState } from "react";

export function TraceReplayTimeline({ trace }: { trace: EventLogTrace }) {
  const { socket } = useWebSocket();
  const { logId, dtId, traceName } = useParams();

  enum InnerReplayState {
    RUNNING,
    PAUSED,
    END
  }

  const [replayState, setReplayState] = useState(InnerReplayState.END);

  function startReplay() {
    const startReplayData: ReplayStart = {
      manifest: {
        version: 1,
        messageType: MessageType.REPLAY_START,
        timestamp: new Date().valueOf(),
        bearerToken: localStorage.getItem("token") ?? "null",
        uuid: localStorage.getItem("uuid") ?? undefined,
      },
      dtId: Number(dtId),
      logId: Number(logId),
      trace: traceName ?? "undefined",
    };
    socket?.send(JSON.stringify(startReplayData));
    setReplayState(InnerReplayState.RUNNING)
  }

  function endReplay() {
    const endReplayData: ReplayEnd = {
      manifest: {
        version: 1,
        messageType: MessageType.REPLAY_END,
        timestamp: new Date().valueOf(),
        bearerToken: localStorage.getItem("token") ?? "null",
        uuid: localStorage.getItem("uuid") ?? undefined,
      },
      dtId: Number(dtId),
      logId: Number(logId),
      trace: traceName ?? "undefined",
    };
    socket?.send(JSON.stringify(endReplayData));
    setReplayState(InnerReplayState.END)
  }

  function pauseReplay() {
    const pauseReplayData: ReplayPauseEvent = {
      manifest: {
        version: 1,
        messageType: MessageType.REPLAY_PAUSE,
        timestamp: new Date().valueOf(),
        bearerToken: localStorage.getItem("token") ?? "null",
        uuid: localStorage.getItem("uuid") ?? undefined,
      },
      dtId: Number(dtId),
      logId: Number(logId),
      trace: traceName ?? "undefined",
    };
    socket?.send(JSON.stringify(pauseReplayData));
    setReplayState(InnerReplayState.PAUSED)
  }

  function fastForward() {
    const fastForwardReplayData: ReplayForwardEvent = {
      manifest: {
        version: 1,
        messageType: MessageType.REPLAY_PAUSE,
        timestamp: new Date().valueOf(),
        bearerToken: localStorage.getItem("token") ?? "null",
        uuid: localStorage.getItem("uuid") ?? undefined,
      },
      dtId: Number(dtId),
      logId: Number(logId),
      trace: traceName ?? "undefined",
    };
    socket?.send(JSON.stringify(fastForwardReplayData));
  }

  return (<main className="rounded-2xl border max-w-90 m-2 p-2">
    <header className="flex flex-row mt-2 justify-center items-center">
      <h2 className="text-xl font-semibold text-center grow">Timeline</h2>
      <ButtonGroup className="grow">
        {(replayState !== InnerReplayState.END) ?
          <Button variant="outline" onClick={endReplay}><Rewind /></Button> : null}
        {(replayState === InnerReplayState.RUNNING) ?
          <Button variant="outline" onClick={pauseReplay}><Pause /></Button> : null}
        {(replayState !== InnerReplayState.RUNNING) ?
          <Button variant="outline" onClick={startReplay}><Play /></Button> : null}
        {(replayState !== InnerReplayState.END) ?
          <Button variant="outline" onClick={fastForward}><SkipForward /></Button> : null}
      </ButtonGroup>
    </header>

    <Timeline items={[]} size="sm">
      {trace.events.map(it => {
        const date = new Date(it.datetime ?? 0);
        return <TimelineItem
          date={date.toLocaleString()}
          title={it.name}
          description={((it.source ? it.source + " = " : undefined) ?? "") + (it.value ?? "")}
          status="pending"
          iconColor={it.replayState === EventReplayState.NOT_EXECUTED ? "muted" : "primary"}
          icon={<Flame />}
        />;
      })}
    </Timeline>
  </main>);
}