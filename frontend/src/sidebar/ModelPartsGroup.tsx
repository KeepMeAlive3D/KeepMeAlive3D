import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { setOutlinedObject } from "@/slices/OutlineSlice.ts";

export function ModelPartsGroup() {
  const modelParts = useAppSelector((state) => state.modelParts.partIds);
  const dispatch = useAppDispatch();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Components</SidebarGroupLabel>
      {modelParts.map((item, i) => (
        <SidebarMenuItem key={item.name} id={"Component" + i}>
          <SidebarMenuButton
            asChild
            onClick={() => {
              dispatch(setOutlinedObject(item.id));
            }}
          >
            <span>{item.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <SidebarGroupContent></SidebarGroupContent>
    </SidebarGroup>
  );
}
