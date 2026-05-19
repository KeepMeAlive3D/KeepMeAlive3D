import { useEffect } from "react";
import type {
  RelativePositionEventMessage,
  RelativePositionMessageData,
} from "@/service/wsTypes.ts";
import { useAppSelector } from "@/hooks/hooks.ts";

/**
 * Local publisher that can be used to debug. It removes the need to publish messages on mqtt.
 * It call the animationCallback with a message that has the same structure as the one received from mqtt.
 * @param animationCallback Called with the message
 */
export default function Publisher(
  animationCallback: (msg: RelativePositionEventMessage) => void
) {
  const modelParts = useAppSelector((state) => state.modelParts.partIds);

  useEffect(() => {
    async function run(topic: string) {
      if (modelParts.length === 0) {
        // Model not ready. Wait until modelParts are ready.
        return;
      }

      for (let i = 1; i < 100; i++) {
        const ev = {
          message: {
            topic: topic,
            dataSource: "",
            percentage: i / 100.0,
          } as RelativePositionMessageData,
        } as RelativePositionEventMessage;

        animationCallback(ev);

        await new Promise((f) => setTimeout(f, 100));
      }
    }

    // Adjust topics here
    run("rot.drehkranz_oben001");
    run("move.querausleger");
  }, [modelParts]);

  return null;
}
