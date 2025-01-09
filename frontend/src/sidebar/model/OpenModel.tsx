import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar.tsx";
import {File} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {getRemoteModelNames, ModelInfo} from "@/service/upload.ts";

export function OpenModel({setModelUri}: { setModelUri: (model: string, name: string) => void }) {
    const [open, setOpen] = useState(false);
    const [fileNames, setFileNames] = useState<ModelInfo[]>([]);

    useEffect(() => {
        getRemoteModelNames().then(req => {
            setFileNames(req.data.files)
        }, err => {
            console.error(err)
        })
    }, []);

    const handleFileOpen = (name: string, filename: string) => {
        setOpen(false)
        setModelUri(name, filename)
    }

    return <SidebarMenuItem key="Open">
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SidebarMenuButton asChild>
                    <div>
                        <File/>
                        <span>Open</span>
                    </div>
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
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
                        {
                            fileNames.map(info => (
                                    <TableRow key={info.model + info.filename}>
                                        <TableCell>{info.model}</TableCell>
                                        <TableCell>{info.filename}</TableCell>
                                        <TableCell className="text-right">
                                            <Button type="button" id={`load-${info.model + info.filename}`}
                                                    className="col-span-1"
                                                    variant="outline"
                                                    onClick={() => handleFileOpen(info.model, info.filename)}>Load</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        }
                    </TableBody>
                </Table>
                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </SidebarMenuItem>
}