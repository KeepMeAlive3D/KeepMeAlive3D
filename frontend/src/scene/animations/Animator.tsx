import { useFrame, useThree } from "@react-three/fiber";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import {
  MessageType,
  type RelativePositionEventMessage,
} from "@/service/wsTypes.ts";
import { useCallback, useMemo, useRef } from "react";
import { useAppSelector } from "@/hooks/hooks.ts";
import { Object3D, Quaternion, Vector3 } from "three";
import { getAnimation } from "@/util/LimitUtils.ts";

function Animator() {
  // Access the Three.js state, including the scene and camera
  const state = useThree();

  // Retrieve the list of model parts from the Redux store
  const modelParts = useAppSelector((state) => state.modelParts.partIds);

  // Ref to store animations for objects, mapping each object to its target position or rotation
  const animationsRef = useRef<
    Map<Object3D, { target: Vector3 | Quaternion; topic: string }>
  >(new Map());

  // Update animations on every frame
  useFrame((_rootState, delta) => {
    const damping = 1;
    // Calculate the lerp factor for smooth animations
    const lerpFactor = 1 - Math.exp(-damping * delta);
    animationsRef.current.forEach((data, object) => {
      if (data.target instanceof Vector3) {
        // Smoothly interpolate the object's position
        object.position.lerp(data.target, lerpFactor);

        // Stop the animation if the object is close to the target
        if (object.position.distanceTo(data.target) < 0.0001) {
          object.position.copy(data.target);
          animationsRef.current.delete(object);
        }
      } else {
        // Smoothly interpolate the object's rotation
        object.quaternion.slerp(data.target, lerpFactor);

        // Stop the animation if the object is close to the target rotation
        if (object.quaternion.angleTo(data.target) < 0.0001) {
          object.quaternion.copy(data.target);
        }
      }
    });
  });

  // Callback to handle incoming animation messages
  const animationCallback = useCallback(
    (msg: RelativePositionEventMessage) => {
      const name = msg.message.topic.split(".").reverse()[0];

      if (modelParts.length == 0) {
        // Skip processing if the model is not initialized yet
        return;
      }

      const selectedObject = state.scene.getObjectByName(name);

      if (selectedObject) {
        // Calculate the target position or rotation for the animation
        const localTarget = getAnimation(
          selectedObject,
          state.scene,
          msg.message.percentage
        );
        // Store the animation data in the ref to be used in the useFrame loop
        animationsRef.current.set(selectedObject, {
          target: localTarget,
          topic: msg.message.topic,
        });
      } else {
        console.warn(
          "Received position event for an unknown object " + msg.message.topic
        );
      }
    },
    [state.scene, modelParts]
  );

  const topics = useMemo(
    () =>
      modelParts.map((modelPart) => {
        return modelPart.topic;
      }),
    [modelParts]
  );

  // Subscribe to filtered WebSocket messages for animation updates
  useFilteredWebsocket(
    topics,
    MessageType.ANIMATION_RELATIVE,
    animationCallback
  );

  return null;
}

export default Animator;
