import { useFrame, useThree } from "@react-three/fiber";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import { MessageType, RelativePositionEventMessage } from "@/service/wsTypes.ts";
import { useCallback, useMemo, useRef } from "react";
import { useAppSelector } from "@/hooks/hooks.ts";
import { Object3D, Vector3 } from "three";
import { getLocalPositionBetweenLimits, getRotationByLimits } from "@/util/LimitUtils.ts";
import Publisher from "@/debug/Publisher.tsx";

function Animator() {
  const state = useThree();

  const modelParts = useAppSelector((state) => state.modelParts.partIds);

  const animationsRef = useRef<Map<Object3D, { vector: Vector3; topic: string }>>(new Map());

  useFrame((_rootState, delta) => {
    const damping = 1;
    // For a smooth animation the lerp factor is based on the delta including a damping factor
    const lerpFactor = 1 - Math.exp(-damping * delta);
    animationsRef.current.forEach((data, object) => {
      const vector = data.vector;

      if (data.topic.startsWith("move.")) {
        object.position.lerp(vector, lerpFactor);

        // If the object is close we end the animation by setting the position directly
        if (object.position.distanceTo(vector) < 0.0001) {
          object.position.copy(vector);
          animationsRef.current.delete(object);
        }
      }


    });
  });

  const animationCallback = useCallback((msg: RelativePositionEventMessage) => {
    const name = msg.message.topic.split(".").reverse()[0];
    const rotation = msg.message.topic.startsWith("rot.");

    if (modelParts.length == 0) {
      return;
    }

    const selectedObject = state.scene.getObjectByName(name);

    if (selectedObject) {
      if (rotation) {
        const localTargetRotation = getRotationByLimits(selectedObject, state.scene, msg.message.percentage);
        selectedObject.quaternion.copy(localTargetRotation);
      } else {
        const targetLocal = getLocalPositionBetweenLimits(selectedObject, state.scene, msg.message.percentage);

        animationsRef.current.set(selectedObject, { vector: targetLocal, topic: msg.message.topic });
      }
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