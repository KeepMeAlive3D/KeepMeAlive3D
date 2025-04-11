import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar.tsx";
import { StartReplay } from "@/sidebar/replay/StartReplay.tsx";

export function ReplayGroup() {
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
}
