import { Timeline, type TimelineColor, TimelineItem } from "@/components/custom/Timeline.tsx";
import { EventLogType, EventReplayState, ReplayState } from "@/scene/dt/eventlogs/data.ts";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Flame, Pause, Play, Rewind } from "lucide-react";
import {
  MessageType,
  type ReplayEnd,
  type ReplayPauseEvent,
  type ReplayStart,
} from "@/service/wsTypes.ts";
import { useWebSocket } from "@/service/webSocketProvider.tsx";
import { useParams } from "react-router";
import * as React from "react";
import { type SetStateAction } from "react";
import type { ReplayInfo } from "@/scene/dt/eventlogs/trace/replay/data.ts";

export function TraceReplayTimeline({ trace, setTrace }: {
  trace: ReplayInfo | undefined,
  setTrace: React.Dispatch<SetStateAction<ReplayInfo[]>>
}) {
  const { socket } = useWebSocket();
  const { refId, dtId, traceName } = useParams();

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
      logId: Number(refId),
      trace: traceName ?? "undefined",
    };
    socket?.send(JSON.stringify(startReplayData));
    setTrace(traces => {
      return traces.map(trace => {
        if(trace.type == EventLogType.PROCESS) {
          return {
            ...trace,
            state: {
              ...trace.state,
              replayState: ReplayState.RUNNING
            }
          }
        } else {
          return trace
        }
      })
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
      logId: Number(refId),
      trace: traceName ?? "undefined",
    };
    socket?.send(JSON.stringify(endReplayData));

    setTrace(traces => {
      return traces.map(trace => {
        if(trace.type == EventLogType.PROCESS) {
          return {
            ...trace,
            state: {
              ...trace.state,
              replayState: ReplayState.END
            }
          }
        } else {
          return trace
        }
      })
    })
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
      logId: Number(refId),
      trace: traceName ?? "undefined",
    };
    socket?.send(JSON.stringify(pauseReplayData));
    setTrace(traces => {
      return traces.map(trace => {
        if(trace.type == EventLogType.PROCESS) {
          return {
            ...trace,
            state: {
              ...trace.state,
              replayState: ReplayState.PAUSED
            }
          }
        } else {
          return trace
        }
      })
    })
  }

  return (<main className="rounded-2xl border max-w-90 m-2 p-2">
    <header className="flex flex-row mt-2 justify-center items-center sticky top-2 bg-muted rounded-2xl p-2 z-20">
      <h2 className="text-xl font-semibold text-center ml-4">Timeline</h2>
      <div className="grow"></div>
      <ButtonGroup className="mr-4">
        <Button variant="outline" className="cursor-pointer" disabled={trace?.state?.replayState === ReplayState.END}
                onClick={endReplay}><Rewind /></Button>
        {(trace?.state?.replayState === ReplayState.RUNNING) ?
          <Button variant="outline" className="cursor-pointer" onClick={pauseReplay}><Pause /></Button> : null}
        {(trace?.state?.replayState !== ReplayState.RUNNING) ?
          <Button variant="outline" className="cursor-pointer" onClick={startReplay}><Play /></Button> : null}
      </ButtonGroup>
    </header>

    <Timeline items={[]} size="sm">
      {trace?.state?.events?.map(it => {
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
    case EventReplayState.ACTIVE:
      return "destructive";
    case EventReplayState.EXECUTED:
      return "primary";
    default:
      return "muted";
  }
}