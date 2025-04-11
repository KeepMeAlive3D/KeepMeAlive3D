import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider.tsx";
import { setLight, setScale } from "@/slices/SettingsSlice.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { useRef } from "react";
import { updateModelSettings } from "@/service/upload.ts";
import { useParams } from "react-router";

export function ModelSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const sliderLight = useRef<HTMLInputElement | null>(null);
  const { modelId } = useParams();

  const handleClose = async (open: boolean) => {
    if (!open && modelId !== undefined && Number(modelId) > 0) {
      await updateModelSettings(
        Number(modelId),
        settings.light,
        settings.scale
      );
    }
  };

  return (
    <SidebarMenuItem key="Settings">
      <Sheet onOpenChange={handleClose}>
        <SheetTrigger asChild>
          <SidebarMenuButton asChild>
            <div>
              <Settings />
              <span>Settings</span>
            </div>
          </SidebarMenuButton>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>
              Manage the local settings for this model
            </SheetDescription>
          </SheetHeader>
          <div className="p-4 flex-col">
            <p className="m-4">Light</p>
            <Slider
              className="m-4"
              ref={sliderLight}
              defaultValue={[settings.light]}
              max={30}
              min={0}
              step={1}
              onValueChange={(value) => {
                dispatch(setLight(value[0]));
              }}
            />
            <p className="m-4">Scale</p>
            <Slider
              className="m-4"
              defaultValue={[settings.scale]}
              max={2}
              min={0}
              step={0.01}
              onValueChange={(value) => {
                dispatch(setScale(value[0] * value[0]));
                //Light has to be adjusted to prevent the dark bug
                dispatch(setLight(settings.light + 0.0000001));
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </SidebarMenuItem>
  );
}
