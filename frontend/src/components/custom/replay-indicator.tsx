import { Button } from "@/components/ui/button.tsx";
import { SkipForward } from "lucide-react";
import {
  selectReplay,
  updateReplay,
} from "@/slices/ReplaySlice.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useWebSocket } from "@/service/webSocketProvider.tsx";
import { Manifest, MessageType, ReplayEnd } from "@/service/wsTypes.ts";

export default function ReplayIndicator() {
  const replay = useAppSelector(selectReplay);
  const dispatch = useAppDispatch();
  const websocket = useWebSocket();

  const [tick, setTick] = useState<number>(0);

  // Used to force re-render every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!replay.start || !replay.startedOn || !replay.end) {
      return;
    }

    const currentReplayTime = replay.start + Date.now() - replay.startedOn;

    if (currentReplayTime > replay.end) {
      // Replay done

      dispatch(
        updateReplay({
          running: false,
          start: undefined,
          end: undefined,
          startedOn: undefined,
        })
      );
    }
  }, [dispatch, replay, tick]);

  function stopReplay() {
    if (!replay || !replay.start || !replay.startedOn) {
      return;
    }

    const stopMessage = {
      manifest: {
        version: 1,
        messageType: MessageType.REPLAY_END,
        timestamp: new Date().valueOf(),
        bearerToken: localStorage.getItem("token") ?? "null",
        uuid: localStorage.getItem("uuid"),
      } as Manifest,
    } as ReplayEnd;

    websocket.socket?.send(JSON.stringify(stopMessage));

    dispatch(
      updateReplay({
        running: false,
        start: undefined,
        end: undefined,
        startedOn: undefined,
      }),
    );

  }

  if (replay.start && replay.end && replay.startedOn) {
    return (
      <header className="absolute flex right-0">
        <div
          className="aspect-video rounded-xl bg-red-600/15 z-20 m-2 p-2 flex flex-col justify-between items-center border border-red-600">
          <header>
            Replay: <i>{replay.running ? "Running" : "Stopped"}</i>
          </header>
          <main>
            Time:{" "}
            <i>
              {format(
                new Date(replay.start + Date.now() - replay.startedOn),
                "dd/MM/yyyy HH:mm",
              )}
            </i>
          </main>
          <footer>
            <Button variant="secondary" onClick={stopReplay}>
              <SkipForward />
            </Button>
          </footer>
        </div>
      </header>
    );
  } else {
    return null;
  }
}
