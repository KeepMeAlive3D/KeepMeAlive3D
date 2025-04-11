import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar.tsx";
import { StartReplay } from "@/sidebar/replay/StartReplay.tsx";
import { useAppSelector } from "@/hooks/hooks.ts";
import { selectModelParts } from "@/slices/ModelPartSlice.ts";

export function ReplayGroup() {
  const modelParts = useAppSelector(selectModelParts);

  // Display only if model is loaded
  if (modelParts.partIds.length > 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Replay</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <StartReplay />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  } else {
    return null;
  }

}
