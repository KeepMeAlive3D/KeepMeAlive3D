import { useFrame, useThree } from "@react-three/fiber";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import { MessageType, PositionEventMessage } from "@/service/wsTypes.ts";
import { useCallback, useMemo, useRef } from "react";
import { useAppSelector } from "@/hooks/hooks.ts";
import { Object3D, Vector3 } from "three";


function Animator() {
  const state = useThree();
  const modelParts = useAppSelector((state) => state.modelParts.partIds);

  const animationsRef = useRef<Map<Object3D, Vector3>>(new Map());

  useFrame((_rootState, delta) => {
    const damping = 1;
    // For a smooth animation the lerp factor is based on the delta including a damping factor
    const lerpFactor = 1 - Math.exp(-damping * delta);
    animationsRef.current.forEach((targetPos, object) => {
      object.position.lerp(targetPos, lerpFactor);

      // If the object is close we end the animation by setting the position directly
      if (object.position.distanceTo(targetPos) < 0.0001) {
        object.position.copy(targetPos);
        animationsRef.current.delete(object);
      }
    });
  });

  const animationCallback = useCallback((msg: PositionEventMessage) => {
    const name = msg.message.topic.split(".").reverse()[0];
    console.debug(name);
    const selectedObject = state.scene.getObjectByName(name);

    if (selectedObject) {
      console.debug("Moving object from " + selectedObject.position.x + ";" + selectedObject.position.y + ";" + selectedObject.position.z + " to " + msg.message.position.x + ";" + msg.message.position.y + ";" + msg.message.position.z);

      const targetPosition = new Vector3(
        msg.message.position.x,
        msg.message.position.y,
        msg.message.position.z,
      );

      animationsRef.current.set(
        selectedObject,
        targetPosition,
      );

    } else {
      console.warn("Received position event for an unknown object " + msg.message.topic);
    }
  }, [state.scene]);


  const topics = useMemo(() => modelParts.map(modelPart => {
    return "machine.move." + modelPart.name;
  }), [modelParts]);


  useFilteredWebsocket(topics, MessageType.ANIMATION_POSITION, animationCallback);


  return null;
}

export default Animator;