import { useThree } from "@react-three/fiber";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import { MessageType, PositionEventMessage } from "@/service/wsTypes.ts";
import { useCallback } from "react";


function Animator() {
  const state = useThree();

  const animationCallback = useCallback((msg: PositionEventMessage) => {
    //const name = msg.message.topic.split(".")[0];
    const selectedObject = state.scene.getObjectByName("9V_querausleger_sauger_id2046_step");

    if (selectedObject) {
      console.debug("Moving object from " + selectedObject.position.x + ";" + selectedObject.position.y + ";" + selectedObject.position.z + " to " + msg.message.position.x + ";" + msg.message.position.y + ";" + msg.message.position.z);
      selectedObject.position.set(msg.message.position.x, msg.message.position.y, msg.message.position.z);
    } else {
      console.warn("Received position event for an unknown object " + msg.message.topic);
    }
  }, [state.scene]);

  useFilteredWebsocket("machine.move.mouse", MessageType.ANIMATION_POSITION, animationCallback);


  return null;
}

export default Animator;