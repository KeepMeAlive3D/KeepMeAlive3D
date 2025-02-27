import { useThree } from "@react-three/fiber";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import { MessageType, PositionEventMessage } from "@/service/wsTypes.ts";
import { useCallback } from "react";
import { useAppSelector } from "@/hooks/hooks.ts";


function Animator() {
  const state = useThree();
  const modelParts = useAppSelector((state) => state.modelParts.partIds);

  const animationCallback = useCallback((msg: PositionEventMessage) => {
    const name = msg.message.topic.split(".").reverse()[0];
    console.debug(name);
    const selectedObject = state.scene.getObjectByName(name);

    if (selectedObject) {
      console.debug("Moving object from " + selectedObject.position.x + ";" + selectedObject.position.y + ";" + selectedObject.position.z + " to " + msg.message.position.x + ";" + msg.message.position.y + ";" + msg.message.position.z);
      selectedObject.position.set(msg.message.position.x, msg.message.position.y, msg.message.position.z);
    } else {
      console.warn("Received position event for an unknown object " + msg.message.topic);
    }
  }, [state.scene]);


  const topics = modelParts.map(modelPart => {
    return "machine.move." + modelPart.name;
  });


  useFilteredWebsocket(topics, MessageType.ANIMATION_POSITION, animationCallback);








  return null;
}

export default Animator;