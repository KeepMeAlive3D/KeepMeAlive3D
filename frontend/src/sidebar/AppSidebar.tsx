import { Sidebar, SidebarContent } from "@/components/ui/sidebar.tsx";
import { MainGroup } from "@/sidebar/MainGroup.tsx";
import { ModelGroup } from "@/sidebar/ModelGroup.tsx";
import { ModelPartsGroup } from "@/sidebar/ModelPartsGroup.tsx";
import { Footer } from "@/sidebar/Footer.tsx";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {MainGroup()}
        <ModelGroup></ModelGroup>
        {ModelPartsGroup()}
      </SidebarContent>
      <Footer />
    </Sidebar>
  );
}
