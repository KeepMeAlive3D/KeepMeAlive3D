import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar.tsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Play } from "lucide-react";
import { DateTimePicker24h } from "@/components/custom/date-time-picker-24h.tsx";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";


export function StartReplay() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);


  return (
    <SidebarMenuItem key="Replay">
      <Sheet>
        <SheetTrigger asChild>
          <SidebarMenuButton asChild>
            <div>
              <Play />
              <span>New</span>
            </div>
          </SidebarMenuButton>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>New replay</SheetTitle>
            <SheetDescription>
              Set the start end end of the replay period.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4 flex-col">
            <p className="m-4">Start</p>
            <DateTimePicker24h date={startDate} setDate={setStartDate} />
            <p className="m-4">Stop</p>
            <DateTimePicker24h date={endDate} setDate={setEndDate} />
          </div>
          <Button>Launch</Button>
        </SheetContent>
      </Sheet>
    </SidebarMenuItem>
  );
}