import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar.tsx";
import {File} from "lucide-react";

export function OpenModel() {
    return <SidebarMenuItem key="Open">
        <SidebarMenuButton asChild>
            <div>
                <File/>
                <span>Open</span>
            </div>
        </SidebarMenuButton>
    </SidebarMenuItem>
}