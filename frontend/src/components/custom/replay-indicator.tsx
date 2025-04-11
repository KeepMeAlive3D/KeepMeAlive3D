import { Button } from "@/components/ui/button.tsx";
import { Pause, Play } from "lucide-react";
import {
  selectReplay,
  setReplayRunning,
  updateReplay,
} from "@/slices/ReplaySlice.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function ReplayIndicator() {
  const replay = useAppSelector(selectReplay);
  const dispatch = useAppDispatch();

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

  function onRunToggle() {
    dispatch(setReplayRunning(!replay.running));
  }

  if (replay.start && replay.end && replay.startedOn) {
    return (
      <header className="absolute flex right-0">
        <div className="aspect-video rounded-xl bg-red-600/15 z-20 m-2 p-2 flex flex-col justify-between items-center border border-red-600">
          <header>
            Replay: <i>{replay.running ? "Running" : "Stopped"}</i>
          </header>
          <main>
            Time:{" "}
            <i>
              {format(
                new Date(replay.start + Date.now() - replay.startedOn),
                "dd/MM/yyyy HH:mm"
              )}
            </i>
          </main>
          <footer>
            <Button variant="secondary" onClick={onRunToggle}>
              {replay.running ? <Pause /> : <Play />}
            </Button>
          </footer>
        </div>
      </header>
    );
  } else {
    return null;
  }
}
