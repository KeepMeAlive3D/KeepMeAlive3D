import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar.tsx";
import {Home, LineChartIcon, Pencil} from "lucide-react";
import {NavLink} from "react-router";

export function MainGroup() {
    return <SidebarGroup>
        <SidebarGroupLabel>KeepMeAlive3D</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem key="Home">
                    <SidebarMenuButton asChild>
                        <a href="/">
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
            <SidebarMenu>
                <SidebarMenuItem key="Graphs">
                    <SidebarMenuButton asChild>
                        <NavLink to="/graphs">
                            <LineChartIcon/>
                            <span>Graphs</span>
                        </NavLink>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroupContent>
    </SidebarGroup>;
}