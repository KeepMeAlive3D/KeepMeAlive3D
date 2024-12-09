import {useAppSelector} from "@/hooks/hooks.ts";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar.tsx";

export function ModelPartsGroup() {
    const modelParts = useAppSelector((state) => state.modelParts.parts);

    return <SidebarGroup>
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
    </SidebarGroup>;
}