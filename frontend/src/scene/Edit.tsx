import {Canvas} from "@react-three/fiber";
import {Suspense, useRef, useState} from "react";
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
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                console.log(result);
                setGltfUrl(result);
            };
            reader.readAsDataURL(file);
            //TODO: upload to server
        }
    };

    const gltf = gltfUrl ? useGLTF(gltfUrl) : null;

    return <div style={{display: 'flex', flexDirection: 'column'}}>
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
            <div style={{flex: 1}}>
                <Canvas>
                    <Suspense fallback={null}>
                        <ambientLight color={"white"} intensity={1}></ambientLight>
                        <primitive scale={[0.01, 0.01, 0.01]} object={gltf.scene}/>
                        ;
                        <OrbitControls/>

                        <Grid cellSize={2} cellColor={"teal"} sectionColor={"darkgray"} sectionSize={2}
                              position={new Vector3(0, -2, 0)} infiniteGrid={true} fadeDistance={20}></Grid>
                    </Suspense>
                </Canvas>
            </div>
        }
        <div style={{marginLeft: "auto", padding: "10px"}}>
            <Button style={{width: '100px'}}>Save</Button>
        </div>

    </div>
}

export default Edit