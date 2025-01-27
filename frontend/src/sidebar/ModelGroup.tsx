import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar.tsx";
import { ModelSettings } from "@/sidebar/model/ModelSettings.tsx";
import { UploadModel } from "@/sidebar/model/UploadModel.tsx";
import { OpenModel } from "@/sidebar/model/OpenModel.tsx";

export function ModelGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Model</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <OpenModel></OpenModel>
          <UploadModel></UploadModel>
          <ModelSettings></ModelSettings>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
