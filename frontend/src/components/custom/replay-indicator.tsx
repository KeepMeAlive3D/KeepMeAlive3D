import { Button } from "@/components/ui/button.tsx";
import { Pause, Play } from "lucide-react";
import { getFormattedTime } from "@/service/model_datapoint.ts";
import { selectReplay, setReplayRunning } from "@/slices/ReplaySlice.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { useEffect, useState } from "react";

export default function ReplayIndicator() {
  const replay = useAppSelector(selectReplay);
  const dispatch = useAppDispatch();

  const [, setTick] = useState<number>(0);

  // Used to force re-render every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
              {getFormattedTime(replay.start + Date.now() - replay.startedOn)}
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
