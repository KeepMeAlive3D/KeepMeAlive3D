import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { File } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { getRemoteModelNames, ModelInfo } from "@/service/upload.ts";
import { LoadingSpinner } from "@/components/custom/loading-spinner.tsx";
import { useAppDispatch } from "@/hooks/hooks.ts";
import { fetchAndSetModel } from "@/slices/ModelSlice.ts";
import { fetchAndSetModelSettings } from "@/slices/SettingsSlice.ts";

export function OpenModel() {
  const [open, setOpen] = useState(false);
  const [fileNames, setFileNames] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getRemoteModelNames().then(
      (req) => {
        setFileNames(req.data.files);
      },
      (err) => {
        console.error(err);
      }
    );
  }, [open]);

  const handleFileOpen = (modelId: number) => {
    setLoading(true);
    dispatch(fetchAndSetModel({ modelId: modelId }));
    dispatch(fetchAndSetModelSettings({modelId: modelId}))
    setLoading(false);
    setOpen(false);
  };

  return (
    <SidebarMenuItem key="Open">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <SidebarMenuButton asChild>
            <div>
              <File />
              <span>Open</span>
            </div>
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent className={"max-w-3xl"}>
          <DialogHeader>
            <DialogTitle>Open Model</DialogTitle>
            <DialogDescription>
              Click a load button from the list to download and load the model.
            </DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Filename</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fileNames.map((info) => (
                <TableRow key={info.modelId}>
                  <TableCell>{info.model}</TableCell>
                  <TableCell>{info.filename}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      id={`load-${info.modelId}`}
                      className="col-span-1"
                      variant="outline"
                      disabled={loading}
                      onClick={() => handleFileOpen(info.modelId)}
                    >
                      Load
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button
              type="button"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Close
              <LoadingSpinner className={"static"} loading={loading} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  );
}
