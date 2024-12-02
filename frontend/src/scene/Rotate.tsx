import {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {Light, Object3D} from "three";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";


function Rotate({gltf}: { gltf: GLTF }) {
    const sel = useRef<Object3D | null>(null);

    gltf.scene.traverse((node: Object3D) => {
        if (node instanceof Light) {
            node.intensity *= 0.25; // Scale down light intensity
        }

        if (Object.keys(node.userData).length > 0 && node.userData["prop"]) {
            sel.current = node;
            console.log(`Custom properties for ${node.name}:`, node.userData);
        }
    });


    useFrame(() => {
        if (sel.current) {
            sel.current.rotateX(0.01)
        }
    });

    return null;
}

export default Rotate;