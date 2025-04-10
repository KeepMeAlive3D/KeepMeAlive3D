import { Button } from "@/components/ui/button.tsx";
import { Pause, Play } from "lucide-react";
import { getFormattedTime } from "@/service/model_datapoint.ts";
import { useState } from "react";

export default function ReplayIndicator() {
  const time = 1744204698;
  const [isRunning, setRunning] = useState(false);
  const currentEventTime = getFormattedTime(time);
  const replayActive = true;

  function onRunToggle() {
    console.debug("run toggle")
    setRunning(!isRunning)
    //todo
  }

  if (replayActive) {
    return (
      <header className="absolute flex right-0">
        <div
          className="aspect-video rounded-xl bg-red-600/15 z-20 m-2 p-2 flex flex-col justify-between items-center border border-red-600">
          <header>
            Replay: <i>{isRunning ? "Running" : "Stopped"}</i>
          </header>
          <main>
            Time: <i>{currentEventTime}</i>
          </main>
          <footer>
            <Button variant="secondary" onClick={onRunToggle}>
              {isRunning ? <Pause /> : <Play />}
            </Button>
          </footer>
        </div>
      </header>
    );
  } else {
    return null;
  }
}