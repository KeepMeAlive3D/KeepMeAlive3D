import {Canvas} from "@react-three/fiber";
import {Suspense, useEffect, useRef} from "react";
import {Grid, OrbitControls, useGLTF} from "@react-three/drei";
import Rotate from "@/scene/Rotate.tsx";
import ClickObjects from "@/scene/ClickObjects.tsx";
import {Light, Mesh, Vector3} from "three";
import {useAppDispatch} from "@/hooks/hooks.ts";
import {add} from "@/slices/ModelPartSlice.ts";


function DynamicModel({objectUrl}: { objectUrl: string }) {

    const loaded = useRef(false);
    const gltf = useGLTF(objectUrl);
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!loaded.current) {
            gltf.scene.traverse((node) => {
                if (node instanceof Light) {
                    node.intensity *= 0.25; // Scale down light intensity
                }

                if (Object.keys(node.userData).length > 0 && node.userData["prop"]) {
                    if (node instanceof Mesh) {
                        console.log(`Custom properties found for ${node.name}:`, node.userData);
                        dispatch(add(node))
                    }
                }
            });
            loaded.current = true;
        }
    });

    return <Canvas id="canvas">
            <Suspense fallback={null}>
                <primitive scale={[1, 1, 1]} object={gltf.scene}/>

                <OrbitControls/>
                <Rotate/>
                <ClickObjects></ClickObjects>
                <Grid cellSize={2} cellColor={"teal"} sectionColor={"darkgray"} sectionSize={2}
                      position={new Vector3(0, -2, 0)} infiniteGrid={true} fadeDistance={20}></Grid>
            </Suspense>
        </Canvas>
}


export default DynamicModel;