import { useThree } from "@react-three/fiber";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import { MessageType, PositionEventMessage } from "@/service/wsTypes.ts";


function Animator() {
  const state = useThree();

  useFilteredWebsocket("machine.move.mouse", MessageType.ANIMATION_POSITION, (msg: PositionEventMessage) => {
    const name = msg.message.topic.split(".")[0];
    const selectedObject = state.scene.getObjectByName(name);

    if (selectedObject) {
      selectedObject.position.set(msg.message.position.x, msg.message.position.y, msg.message.position.z);
    } else {
      console.warn("Received position event for an unknown object " + msg.message.topic);
    }
  });


  return null;
}

export default Animator;