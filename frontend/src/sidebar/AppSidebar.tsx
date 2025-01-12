import {Sidebar, SidebarContent,} from "@/components/ui/sidebar.tsx"
import {MainGroup} from "@/sidebar/MainGroup.tsx";
import {ModelGroup} from "@/sidebar/ModelGroup.tsx";
import {ModelPartsGroup} from "@/sidebar/ModelPartsGroup.tsx";

export function AppSidebar({setModelUri}: { setModelUri: (model: string, name: string) => void }) {
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {MainGroup()}
                <ModelGroup setModelUri={setModelUri}></ModelGroup>
                {ModelPartsGroup()}
            </SidebarContent>
        </Sidebar>
    )
}
