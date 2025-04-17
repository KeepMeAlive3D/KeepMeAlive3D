import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SquareActivity } from "lucide-react";
import { useEffect, useState } from "react";
import { getKmaVersion } from "@/service/kma_version.ts";

export function SidebarVersionHeader() {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    getKmaVersion().then(r => {
      setVersion(r.data)
    })
  })

  return (<SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <a href="#" className="text-primary bg-muted/80">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <SquareActivity className="size-6" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">KeepMeAlive3d</span>
              <span className="">{ version }</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>)
}