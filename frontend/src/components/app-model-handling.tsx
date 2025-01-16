import {AppSidebar} from "@/sidebar/AppSidebar.tsx";
import App from "@/App.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {downloadModel} from "@/service/upload.ts";
import {useState} from "react";
import service from "@/service/service.ts";

export function AppModelHandling() {
    const [model, setModel] = useState<string | null>(null)

    function setModelUri(model: string, filename: string) {
        downloadModel(model, filename).then(response => {
            const href = URL.createObjectURL(response.data);
            setModel(href)
        })
        service.defaults.responseType = undefined
    }

    return <SidebarProvider key="sidebar">
        <AppSidebar setModelUri={setModelUri}/>
        <main className="w-full">
            <App model={model}></App>
        </main>
    </SidebarProvider>
}