import { useEffect } from "react";
import { RelativePositionEventMessage, RelativePositionMessageData } from "@/service/wsTypes.ts";
import { useAppSelector } from "@/hooks/hooks.ts";


export default function Publisher(animationCallback: (msg: RelativePositionEventMessage) => void) {
  const modelParts = useAppSelector((state) => state.modelParts.partIds);


  useEffect(() => {
    async function run() {
      if (modelParts.length === 0) {
        // Model not ready. Wait until modelParts are ready.
        return;
      }
      for (let i = 1; i < 100; i++) {
        const ev = {
          message: {
            topic: "rot.drehkranz_oben001",
            dataSource: "",
            percentage: i / 100.0,
          } as RelativePositionMessageData,
        } as RelativePositionEventMessage;

        animationCallback(ev);

        await new Promise(f => setTimeout(f, 100));
      }


    }

    run();
  }, [modelParts]);
}