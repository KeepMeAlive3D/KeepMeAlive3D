import { useFrame, useThree } from "@react-three/fiber";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import { MessageType, RelativePositionEventMessage } from "@/service/wsTypes.ts";
import { useCallback, useMemo, useRef } from "react";
import { useAppSelector } from "@/hooks/hooks.ts";
import { Object3D, Quaternion, Vector3 } from "three";
import { getAnimation } from "@/util/LimitUtils.ts";
import Publisher from "@/debug/Publisher.tsx";

function Animator() {
  const state = useThree();

  const modelParts = useAppSelector((state) => state.modelParts.partIds);

  const animationsRef = useRef<Map<Object3D, { target: Vector3 | Quaternion; topic: string }>>(new Map());

  useFrame((_rootState, delta) => {
    const damping = 1;
    // For a smooth animation the lerp factor is based on the delta including a damping factor
    const lerpFactor = 1 - Math.exp(-damping * delta);
    animationsRef.current.forEach((data, object) => {

      if (data.target instanceof Vector3) {
        object.position.lerp(data.target, lerpFactor);

        // If the object is close we end the animation by setting the position directly
        if (object.position.distanceTo(data.target) < 0.0001) {
          object.position.copy(data.target);
          animationsRef.current.delete(object);
        }
      } else {
        object.quaternion.slerp(data.target, lerpFactor);

        if (object.quaternion.angleTo(data.target) < 0.0001) {
          object.quaternion.copy(data.target);
        }
      }
    });
  });

  const animationCallback = useCallback((msg: RelativePositionEventMessage) => {
    const name = msg.message.topic.split(".").reverse()[0];

    if (modelParts.length == 0) {
      // Not initialized yet
      return;
    }

    const selectedObject = state.scene.getObjectByName(name);

    if (selectedObject) {

      const localTarget = getAnimation(selectedObject, state.scene, msg.message.percentage);
      animationsRef.current.set(selectedObject, { target: localTarget, topic: msg.message.topic });

    } else {
      console.warn("Received position event for an unknown object " + msg.message.topic);
    }
  }, [state.scene, modelParts]);


  const topics = useMemo(() => modelParts.map(modelPart => {
    return modelPart.topic;
  }), [modelParts]);


  useFilteredWebsocket(topics, MessageType.ANIMATION_RELATIVE, animationCallback);


  return Publisher(animationCallback);
}

export default Animator;