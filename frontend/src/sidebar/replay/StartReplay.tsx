import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
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
import { useAppDispatch } from "@/hooks/hooks.ts";
import { updateReplay } from "@/slices/ReplaySlice.ts";
import { toast } from "@/hooks/use-toast.ts";

export function StartReplay() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { socket } = useWebSocket();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function onStart() {
    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Start and End required",
        description: "Please enter start and date.",
      });
      return;
    }

    if (startDate.getTime() > endDate.getTime()) {
      toast({
        variant: "destructive",
        title: "Start must be before end",
        description: "Please enter a start date before the end date.",
      });
      return;
    }

    if (startDate.getTime() > Date.now()) {
      toast({
        variant: "destructive",
        title: "Start must be in the past",
        description: "Please enter a start date in the past.",
      });
      return;
    }

    let actualEndDate = endDate.getTime();
    if (actualEndDate > Date.now()) {
      // Replay ends in the future -> set to current time.
      setEndDate(new Date());
      actualEndDate = new Date().getTime();
    }

    const message = {
      manifest: {
        version: 1,
        messageType: MessageType.REPLAY_START,
        timestamp: new Date().valueOf(),
        bearerToken: localStorage.getItem("token") ?? "null",
        uuid: localStorage.getItem("uuid"),
      } as Manifest,
      start: startDate?.getTime(),
      end: actualEndDate,
    } as ReplayStart;

    socket?.send(JSON.stringify(message));

    dispatch(
      updateReplay({
        running: true,
        startedOn: Date.now(),
        start: startDate?.getTime(),
        end: actualEndDate,
      })
    );

    setIsOpen(false);
  }

  return (
    <SidebarMenuItem key="Replay">
      <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
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
