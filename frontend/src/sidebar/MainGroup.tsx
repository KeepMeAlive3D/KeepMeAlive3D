import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar.tsx";
import {Home, Pencil} from "lucide-react";

export function MainGroup() {
    return <SidebarGroup>
        <SidebarGroupLabel>KeepMeAlive3D</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem key="Home">
                    <SidebarMenuButton asChild>
                        <a href="/frontend/public">
                            <Home/>
                            <span>Home</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
                <SidebarMenuItem key="Edit">
                    <SidebarMenuButton asChild>
                        <a href="/Edit">
                            <Pencil/>
                            <span>Edit</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroupContent>
    </SidebarGroup>;
}