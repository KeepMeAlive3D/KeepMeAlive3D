import {Canvas} from "@react-three/fiber";
import {Suspense, useEffect, useRef} from "react";
import {Grid, OrbitControls, useGLTF} from "@react-three/drei";
import Rotate from "@/scene/Rotate.tsx";
import ClickObjects from "@/scene/ClickObjects.tsx";
import {Light, Mesh, Object3D, Vector3} from "three";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks.ts";
import {add} from "@/slices/ModelPartSlice.ts";
import {setLight} from "@/slices/SettingsSlice.ts";


function DynamicModel({objectUrl}: { objectUrl: string }) {

    const loaded = useRef(false);
    const gltf = useGLTF(objectUrl);
    const dispatch = useAppDispatch()
    const settings = useAppSelector((state) => state.settings);

    useEffect(() => {
        if (!loaded.current) {
            const lights: Array<Object3D> = [];

            gltf.scene.traverse((node) => {
                if (node instanceof Light) {
                    lights.push(node);
                }

                if (Object.keys(node.userData).length > 0 && node.userData["prop"]) {
                    if (node instanceof Mesh) {
                        console.log(`Custom properties found for ${node.name}:`, node.userData);
                        dispatch(add(node))
                    }
                }
            });
            // Remove lights. later custom lights will be spawned instead
            lights.forEach(x => x.removeFromParent());

            loaded.current = true;
        }
    });

    // Fix the dark bug on window resizing
    window.addEventListener("resize", () => {
        dispatch(setLight(settings.light + 0.0000001));
    })

    return <Canvas id="canvas">
        <Suspense fallback={null}>
            <primitive scale={[settings.scale, settings.scale, settings.scale]} object={gltf.scene}/>
            <spotLight position={[10000, 10000, 10000]} angle={0.15} penumbra={1} decay={0} intensity={settings.light}/>
            <pointLight position={[-10000, -10000, -10000]} decay={0} intensity={settings.light}/>

            <OrbitControls/>
            <Rotate/>
            <ClickObjects></ClickObjects>
            <Grid cellSize={2} cellColor={"teal"} sectionColor={"darkgray"} sectionSize={2}
                  position={new Vector3(0, -2, 0)} infiniteGrid={true} fadeDistance={20}></Grid>
        </Suspense>
    </Canvas>
}


export default DynamicModel;