import React, {startTransition, useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import {Button} from "@/components/ui/button.tsx";
import DynamicModel from "@/scene/DynamicModel.tsx";


function Edit() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [gltfUrl, setGltfUrl] = useState<string | null>(null);
    const [data, setData] = useState([{uv: 1000}]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            // Create an object URL from the file
            const objectUrl = URL.createObjectURL(file);

            startTransition(() => {
                setGltfUrl(objectUrl);
            });
            //TODO: upload to server
        }
    };


    useEffect(() => {
        let i = 1000;
        data.push({uv: 1000 + i});
        i += 1;
        setData((old) => [...old, {uv: i}])
        console.debug("Added");
    }, []);



    return <div className="edit-content flex flex-col h-auto">
        <div>
            <Input ref={fileInputRef} type="file" onChange={handleFileUpload} style={{display: "none"}}/>
        </div>
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={() => {
                        if (fileInputRef.current) {
                            fileInputRef.current.click()
                        }
                    }}>
                        Import
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>

        <div className="canvas-content flex-grow">
            {gltfUrl &&
                <DynamicModel objectUrl={gltfUrl}/>
            }
        </div>


        <div className={"footer-content ml-auto p-2"}>
            <Button className={"footer-button w-28"}>Save</Button>
        </div>

    </div>
}


export default Edit