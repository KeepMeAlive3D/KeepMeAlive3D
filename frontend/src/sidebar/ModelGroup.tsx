import {SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu} from "@/components/ui/sidebar.tsx";
import {ModelSettings} from "@/sidebar/model/ModelSettings.tsx";
import {UploadModel} from "@/sidebar/model/UploadModel.tsx";
import {OpenModel} from "@/sidebar/model/OpenModel.tsx";

export function ModelGroup({setModelUri}: { setModelUri: (model: string, name: string) => void }) {

    return <SidebarGroup>
        <SidebarGroupLabel>Model</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu>
                <OpenModel setModelUri={setModelUri}></OpenModel>
                <UploadModel setModelUri={setModelUri}></UploadModel>
                <ModelSettings></ModelSettings>
            </SidebarMenu>
        </SidebarGroupContent>
    </SidebarGroup>;
}