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
import { useWebSocket } from "@/service/webSocketProvider.tsx";
import { Manifest, MessageType, ReplayStart } from "@/service/wsTypes.ts";


export function StartReplay() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { socket } = useWebSocket();

  function onStart() {
    const message = {
      manifest: {
        version: 1,
        messageType: MessageType.REPLAY_START,
        timestamp: new Date().valueOf(),
        bearerToken: localStorage.getItem("token") ?? "null",
      } as Manifest,
      start: startDate?.getMilliseconds(),
      end: endDate?.getMilliseconds(),
    } as ReplayStart;

    socket?.send(JSON.stringify(message));
  }

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
          <Button onClick={onStart}>Launch</Button>
        </SheetContent>
      </Sheet>
    </SidebarMenuItem>
  );
}