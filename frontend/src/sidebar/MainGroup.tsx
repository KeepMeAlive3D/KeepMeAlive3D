import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar.tsx";
import {Home, LineChartIcon, Pencil} from "lucide-react";
import {Link} from "react-router";

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
                        <Link to="/graphs" target="_blank">
                            <LineChartIcon/>
                            <span>Graphs</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroupContent>
    </SidebarGroup>;
}