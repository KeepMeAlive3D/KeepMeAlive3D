import { useFrame, useThree } from "@react-three/fiber";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import { MessageType, PositionEventMessage } from "@/service/wsTypes.ts";
import { useCallback, useMemo, useRef } from "react";
import { useAppSelector } from "@/hooks/hooks.ts";
import { Euler, Object3D, Vector3 } from "three";


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
      } else {

        const targetRotation = new Euler(vector.x, vector.y, vector.z);
        object.rotation.x = vector.x != 0 ? object.rotation.x + (targetRotation.x - object.rotation.x) * lerpFactor : object.rotation.x;
        object.rotation.y = vector.y != 0 ? object.rotation.y + (targetRotation.y - object.rotation.y) * lerpFactor : object.rotation.y;
        object.rotation.z = vector.z != 0 ? object.rotation.z + (targetRotation.z - object.rotation.z) * lerpFactor : object.rotation.z;


        // Stop animation if rotation is close to the target
        if (distanceSmallerButGreater0(object.rotation.x, targetRotation.x) ||
          distanceSmallerButGreater0(object.rotation.y, targetRotation.y) ||
          distanceSmallerButGreater0(object.rotation.z, targetRotation.z)) {

          object.rotation.x = vector.x != 0 ? targetRotation.x : object.rotation.x;
          object.rotation.y = vector.y != 0 ? targetRotation.y : object.rotation.y;
          object.rotation.z = vector.z != 0 ? targetRotation.z : object.rotation.z;

          animationsRef.current.delete(object);
        }
      }


    });
  });

  const animationCallback = useCallback((msg: PositionEventMessage) => {
    const name = msg.message.topic.split(".").reverse()[0];
    const selectedObject = state.scene.getObjectByName(name);

    if (selectedObject) {
      const targetPosition = new Vector3(
        msg.message.position.x,
        msg.message.position.y,
        msg.message.position.z,
      );

      animationsRef.current.set(selectedObject, { vector: targetPosition, topic: msg.message.topic });

    } else {
      console.warn("Received position event for an unknown object " + msg.message.topic);
    }
  }, [state.scene]);


  const topics = useMemo(() => modelParts.map(modelPart => {
    return modelPart.topic;
  }), [modelParts]);


  useFilteredWebsocket(topics, MessageType.ANIMATION_POSITION, animationCallback);


  return null;
}

function distanceSmallerButGreater0(objectCor: number, targetRotationCor: number): boolean {
  return (Math.abs(objectCor - targetRotationCor) < 0.0001 && targetRotationCor > 0);
}

export default Animator;