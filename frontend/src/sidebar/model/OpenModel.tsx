import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { File, FileOutput, Trash } from "lucide-react";
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
import { deleteModel, getRemoteModelNames, ModelInfo } from "@/service/upload.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import { clearPartsList } from "@/slices/ModelPartSlice.ts";
import { Link, useNavigate } from "react-router";

export function OpenModel() {
  const [open, setOpen] = useState(false);
  const [fileNames, setFileNames] = useState<ModelInfo[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function getAndSetModels() {
    getRemoteModelNames().then(
      (req) => {
        setFileNames(req.data.files);
      },
      (err) => {
        console.error(err);
      },
    );
  }

  useEffect(() => {
    getAndSetModels();
  }, [open]);

  const handleDelete = (modelId: number) => {
    deleteModel(modelId).then(
      () => {
        getAndSetModels();
        dispatch(clearPartsList());
        navigate("/");
      },
    );
  };

  return (
    <SidebarMenuItem key="Open" id="OpenMenuBar">
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
              {fileNames.map((info, index) => (
                <TableRow key={info.modelId}>
                  <TableCell>{info.model}</TableCell>
                  <TableCell>{info.filename}</TableCell>
                  <TableCell className="text-right" id={`action-cell-${index}`}>
                    <Link to={`/model/${info.modelId}`}>
                      <Button
                        type="button"
                        id={`load-${index}`}
                        className="col-span-1 mx-4"
                        variant="outline"
                        onClick={() => setOpen(false)}
                      >
                        <FileOutput />
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      id={`delete-${index}`}
                      className="col-span-1"
                      variant="destructive"
                      onClick={() => handleDelete(info.modelId)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  );
}
