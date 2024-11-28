import {Canvas} from "@react-three/fiber";
import {startTransition, Suspense, useRef, useState} from "react";
import {Grid, OrbitControls, useGLTF} from "@react-three/drei";
import {Vector3} from "three";
import {Input} from "@/components/ui/input"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import {Button} from "@/components/ui/button.tsx";


function Edit() {
    const fileInputRef = useRef();
    const [gltfUrl, setGltfUrl] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            // Create an object URL from the file
            const objectUrl = URL.createObjectURL(file);
            console.log("Generated Object URL:", objectUrl);

            startTransition(() => {
                setGltfUrl(objectUrl);
            });
            //TODO: upload to server
        }
    };


    const gltf = gltfUrl ? useGLTF(gltfUrl) : null;

    if (gltf) {
        gltf.scene.traverse((node) => {
            if (node.isLight) {
                node.intensity *= 0.25; // Scale down light intensity
            }
        });

    }

    return <div className="edit-content flex flex-col h-screen">
        <div>
            <Input ref={fileInputRef} type="file" onChange={handleFileUpload} style={{display: "none"}}/>
        </div>
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={() => {
                        fileInputRef.current.click()
                    }}>
                        Import
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
        {gltf &&
            <div className="canvas-content flex-grow">
                <Canvas>
                    <Suspense fallback={null}>
                        <primitive scale={[1, 1, 1]} object={gltf.scene}/>
                        <OrbitControls/>

                        <Grid cellSize={2} cellColor={"teal"} sectionColor={"darkgray"} sectionSize={2}
                              position={new Vector3(0, -2, 0)} infiniteGrid={true} fadeDistance={20}></Grid>
                    </Suspense>
                </Canvas>
            </div>
        }
        <div className={"footer-content ml-auto p-2"}>
            <Button className={"footer-button w-28"}>Save</Button>
        </div>

    </div>
}

export default Edit