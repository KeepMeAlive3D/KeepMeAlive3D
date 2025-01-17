import {AppSidebar} from "@/sidebar/AppSidebar.tsx";
import App from "@/App.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";

export function AppModelHandling() {

    return <SidebarProvider key="sidebar">
        <AppSidebar/>
        <main className="w-full">
            <App></App>
        </main>
    </SidebarProvider>
}