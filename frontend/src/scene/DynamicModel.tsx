import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Grid, OrbitControls, useGLTF } from "@react-three/drei";
import Rotate from "@/scene/Rotate.tsx";
import ClickObjects from "@/scene/ClickObjects.tsx";
import { Light, Object3D, Vector3 } from "three";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { addPart, clearPartsList } from "@/slices/ModelPartSlice.ts";
import { setLight } from "@/slices/SettingsSlice.ts";
import Scaler from "@/scene/Scaler.tsx";
import Animator from "@/scene/Animator.tsx";
import { parseLimits } from "@/util/LimitUtils.ts";

function DynamicModel({ objectUrl }: { objectUrl: string }) {
  const gltf = useGLTF(objectUrl, undefined, true);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  useEffect(() => {
    const lights: Array<Object3D> = [];

    dispatch(clearPartsList());

    gltf.scene.traverse((node) => {
      if (node instanceof Light) {
        lights.push(node);
      }

      if (node.name.startsWith("limit_")) {
        node.parent?.updateMatrixWorld(true);

        const worldPosition = new Vector3();
        node.parent?.getWorldPosition(worldPosition);
        console.debug(worldPosition);

        const pos = new Vector3();
        node.getWorldPosition(pos);
        console.debug(node.name + ": x:" + pos.x + " y:" + pos.y + " z:" + pos.z);
      }

      if (Object.keys(node.userData).length > 0 && node.userData["topic"]) {
        console.debug(
          `Custom properties found for ${node.name}:`,
          node.userData,
        );

        const limits = parseLimits(node);

        dispatch(
          addPart({
            id: node.id,
            name: node.name,
            isSelected: false,
            topic: node.userData["topic"],
            limits: limits,
          }),
        );
      }
    });
    // Remove lights. later custom lights will be spawned instead
    lights.forEach((x) => x.removeFromParent());
  }, [objectUrl]);

  // Fix the dark bug on window resizing
  window.addEventListener("resize", () => {
    dispatch(setLight(settings.light + 0.0000001));
  });

  return (
    <Canvas id="canvas">
      <Suspense fallback={<div>Loading...</div>}>
        <primitive
          scale={[settings.scale, settings.scale, settings.scale]}
          object={gltf.scene}
        />
        <spotLight
          position={[10000, 10000, 10000]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={settings.light}
        />
        <pointLight
          position={[-10000, -10000, -10000]}
          decay={0}
          intensity={settings.light}
        />

        <Animator />
        <Scaler />
        <OrbitControls />
        <Rotate />
        <ClickObjects></ClickObjects>
        <Grid
          cellSize={2}
          cellColor={"teal"}
          sectionColor={"darkgray"}
          sectionSize={2}
          position={new Vector3(0, -2, 0)}
          infiniteGrid={true}
          fadeDistance={20}
        ></Grid>
      </Suspense>
    </Canvas>
  );
}

export default DynamicModel;
