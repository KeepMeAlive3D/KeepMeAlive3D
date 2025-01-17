import {AppSidebar} from "@/sidebar/AppSidebar.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {Outlet} from "react-router";


function Layout() {
    return (
        <SidebarProvider key="sidebar">
            <AppSidebar/>
            <main className="w-full">
                <div className={"main-body"}>
                    <main className={"main-content"}>
                        <Outlet/>
                    </main>
                </div>
            </main>
        </SidebarProvider>
    );
}

export default Layout;