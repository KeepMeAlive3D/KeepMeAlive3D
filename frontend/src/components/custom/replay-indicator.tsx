import { Button } from "@/components/ui/button.tsx";
import { Pause, Play } from "lucide-react";
import { getFormattedTime } from "@/service/model_datapoint.ts";
import { useState } from "react";
import { createWebsocket } from "@/service/wsService.ts";
import { MessageType, ReplayEnd, ReplayStart } from "@/service/wsTypes.ts";

export default function ReplayIndicator() {
  const time = 1744204698;
  const [isRunning, setRunning] = useState(false);
  const currentEventTime = getFormattedTime(time);
  const replayActive = true;

  function onRunToggle() {
    console.debug("run toggle")
    setRunning(!isRunning)

    const replayStart: ReplayStart = {
      manifest: {
        version: 1,
        messageType: MessageType.REPLAY_START,
        uuid: "50e50fd7-5aaf-436e-a2e3-1261bf9fbe9e",
        timestamp: new Date().valueOf(),
        bearerToken: localStorage.getItem("token") ?? "null",
      },
      start: 1744290108000,
      end: 1744290134000
    }
    const replayEnd: ReplayEnd = {
      manifest: {
        version: 1,
        messageType: MessageType.REPLAY_END,
        uuid: "50e50fd7-5aaf-436e-a2e3-1261bf9fbe9e",
        timestamp: new Date().valueOf(),
        bearerToken: localStorage.getItem("token") ?? "null",
      },
    }

    createWebsocket().then(it => {
      if(!isRunning) {
        it.send(JSON.stringify(replayStart))
      } else {
        it.send(JSON.stringify(replayEnd))
      }
      it.onmessage = (it) => {
        console.debug(it.data)
      }
    })
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