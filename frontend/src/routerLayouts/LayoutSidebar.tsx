import { AppSidebar } from "@/sidebar/AppSidebar.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Outlet, useLocation, useParams } from "react-router";
import { Separator } from "@/components/ui/separator.tsx";

/**
 * Layout that includes the Sidebar
 */
function Layout() {
  return (
    <SidebarProvider key="sidebar">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <GetTitle/>
        </header>
        <main className="w-full h-full">
          <div className={"main-body"}>
            <main className={"main-content"}>
              <Outlet />
            </main>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function GetTitle() {
  const { dtId, participantId } = useParams();
  const location = useLocation();

  if(dtId) {
    if(participantId) {
      return <div>Process Participant</div>
    }
    return <div>Digital Twin</div>
  }
  if(location.pathname.includes("state-machine")) {
    return <div>State Machine</div>
  }
  return null
}

export default Layout;
