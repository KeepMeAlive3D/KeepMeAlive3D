import { Timeline, type TimelineColor, TimelineItem } from "@/components/custom/Timeline.tsx";
import { type EventLogTrace, EventReplayState, ReplayState } from "@/scene/dt/eventlogs/data.ts";
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
import { type SetStateAction } from "react";
import * as React from "react";

export function TraceReplayTimeline({ trace, setTrace }: { trace: EventLogTrace, setTrace:  React.Dispatch<SetStateAction<EventLogTrace | null | undefined>>}) {
  const { socket } = useWebSocket();
  const { logId, dtId, traceName } = useParams();

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
    setTrace({
      name: trace.name,
      events: trace.events,
      replayState: ReplayState.RUNNING
    })
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
    setTrace(
      {
        name: trace.name,
        events: trace.events,
        replayState: ReplayState.END
      }
    )
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
    setTrace({
      name: trace.name,
      events: trace.events,
      replayState: ReplayState.PAUSED
    })
  }

  function fastForward() {
    const fastForwardReplayData: ReplayForwardEvent = {
      manifest: {
        version: 1,
        messageType: MessageType.REPLAY_FORWARD,
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
        {(trace.replayState !== ReplayState.END) ?
          <Button variant="outline" onClick={endReplay}><Rewind /></Button> : null}
        {(trace.replayState === ReplayState.RUNNING) ?
          <Button variant="outline" onClick={pauseReplay}><Pause /></Button> : null}
        {(trace.replayState !== ReplayState.RUNNING) ?
          <Button variant="outline" onClick={startReplay}><Play /></Button> : null}
        {(trace.replayState !== ReplayState.END) ?
          <Button variant="outline" onClick={fastForward}><SkipForward /></Button> : null}
      </ButtonGroup>
    </header>

    <Timeline items={[]} size="sm">
      {trace.events.map(it => {
        const date = new Date(it.datetime ?? 0);
        return <TimelineItem
          key={it.name + it.datetime}
          date={date.toLocaleString()}
          title={it.name}
          description={((it.source ? it.source + " = " : undefined) ?? "") + (it.value ?? "")}
          status="pending"
          iconColor={getColor(it.replayState)}
          icon={<Flame />}
        />;
      })}
    </Timeline>
  </main>);
}

function getColor(e: EventReplayState): TimelineColor {
  switch (e) {
    case EventReplayState.ACTIVE: return "destructive"
    case EventReplayState.EXECUTED: return "primary"
    default: return "muted"
  }
}