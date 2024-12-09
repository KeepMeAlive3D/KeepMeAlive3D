import {Home, Pencil} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useAppSelector} from "@/hooks/hooks.ts";

export function AppSidebar() {
    const modelParts = useAppSelector((state) => state.modelParts.parts);

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
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
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Components</SidebarGroupLabel>
                    {modelParts.map((item) => (
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild onClick={() => {
                                item.scale.set(1.2, 1.2, 1.2);
                            }}>
                                <span>{item.name}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    <SidebarGroupContent></SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
