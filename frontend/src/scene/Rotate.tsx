import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Light, Object3D } from "three";

function Rotate() {
  const sel = useRef<Object3D | null>(null);
  const state = useThree();

  state.scene.traverse((node: Object3D) => {
    if (node instanceof Light) {
      node.intensity *= 0.25; // Scale down light intensity
    }

    if (Object.keys(node.userData).length > 0 && node.userData["prop"]) {
      sel.current = node;
      // TODO: save a list of all objects which have custom properties
    }
  });

  useFrame(() => {
    if (sel.current) {
      sel.current.rotateX(0.01);
    }
  });

  return null;
}

export default Rotate;
