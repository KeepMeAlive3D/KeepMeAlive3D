import { Canvas } from "@react-three/fiber";
import { RefObject, Suspense, useRef, useState } from "react";
import { Bounds, Grid, OrbitControls, useGLTF } from "@react-three/drei";
import ClickObjects from "@/scene/ClickObjects.tsx";
import { Light, Object3D, Scene, Vector3 } from "three";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { addPart, clearPartsList } from "@/slices/ModelPartSlice.ts";
import Scaler from "@/scene/Scaler.tsx";
import Animator from "@/scene/Animator.tsx";
import { pullLimitsUp } from "@/util/LimitUtils.ts";
import { useWindowResizeDelta } from "@/hooks/useWindowResizeDelta.tsx";
import { setLight } from "@/slices/SettingsSlice";

function DynamicModel({ objectUrl }: { objectUrl: string }) {
  const gltf = useGLTF(objectUrl, undefined, true);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const initialised = useRef(false);

  const containerRef: RefObject<HTMLDivElement> = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // This fixes the bug with the canvas not shrinking on window shrinking
  useWindowResizeDelta((delta: { width: number, height: number }) => {
    if (containerRef.current && containerRef.current) {
      const currentWidth = containerRef.current.clientWidth + (size.width === 0 ? 0 : 2);
      const currentHeight = containerRef.current.clientHeight + (size.height === 0 ? 0 : 2);

      setSize({ width: currentWidth + delta.width, height: currentHeight + delta.height });

      // This is a workaround for the threejs bug that after window resize the model is dark.
      setTimeout(() => {
        dispatch(setLight(settings.light + 0.0000001));
      }, 1000);
    }
  });


  // Ran after model fully loaded and all transformations are done
  // useEffect is here not sufficient as threejs applies some transformations between the first useEffect call and the
  // rendering of the model
  const handleUpdate = () => {
    if (!initialised.current) {
      initialised.current = true;
      const lights: Array<Object3D> = [];

      dispatch(clearPartsList());

      gltf.scene.traverse((node) => {
        if (node instanceof Light) {
          lights.push(node);
        }

        if (Object.keys(node.userData).length > 0 && node.userData["topic"]) {
          console.debug(
            `Custom properties found for ${node.name}:`,
            node.userData
          );

          pullLimitsUp(node, gltf.scene as unknown as Scene);

          dispatch(
            addPart({
              id: node.id,
              name: node.name,
              isSelected: false,
              topic: node.userData["topic"],
            })
          );
        }
      });
      // Remove lights. later custom lights will be spawned instead
      lights.forEach((x) => x.removeFromParent());

      // This is a workaround for the threejs bug that after window reload the model is dark
      dispatch(setLight(settings.light + 0.0000001));

    }
  };


  return (
    <div style={{
      height: (size.height === 0 ? "100%" : `${size.height - 2}px`),
      width: (size.width === 0 ? "100%" : `${size.width - 2}px`),
    }} ref={containerRef}>
    <Canvas id="canvas">
      <Suspense fallback={<div>Loading...</div>}>
        <Bounds fit observe margin={1.2}>
          <primitive
            scale={[settings.scale, settings.scale, settings.scale]}
            object={gltf.scene}
            onUpdate={handleUpdate}
          />
        </Bounds>

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
        <OrbitControls makeDefault />
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
    </div>
  );
}

export default DynamicModel;
