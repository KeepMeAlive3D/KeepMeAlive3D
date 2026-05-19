import { Sidebar, SidebarContent } from "@/components/ui/sidebar.tsx";
import { KeepMeAlive3DGroup } from "@/sidebar/KeepMeAlive3DGroup.tsx";
import { ModelGroup } from "@/sidebar/model/ModelGroup.tsx";
import { ModelPartsGroup } from "@/sidebar/ModelPartsGroup.tsx";
import { Footer } from "@/sidebar/Footer.tsx";
import { ReplayGroup } from "@/sidebar/replay/ReplayGroup.tsx";
import { SidebarVersionHeader } from "@/sidebar/header/SidebarVersionHeader.tsx";

/**
 * The `AppSidebar` component renders the main sidebar for the application.
 *
 * It includes the following sections:
 * - `SidebarVersionHeader`: Displays the application version and branding.
 * - `KeepMeAlive3DGroup`: Contains navigation links for the home and graphs pages.
 * - `ModelGroup`: Provides options to open, upload, and configure models.
 * - `ReplayGroup`: Displays replay-related controls and options.
 * - `ModelPartsGroup`: Lists and allows interaction with individual model components.
 * - `Footer`: Displays user-related actions, such as logout.
 *
 */
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarVersionHeader />
      <SidebarContent>
        <KeepMeAlive3DGroup />
        <ModelGroup />
        <ReplayGroup />
        <ModelPartsGroup />
      </SidebarContent>
      <Footer />
    </Sidebar>
  );
}
