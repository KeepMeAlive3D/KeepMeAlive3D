import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar.tsx";
import {Upload} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useRef, useState} from "react";
import {uploadFile} from "@/service/upload.ts";
import {useToast} from "@/hooks/use-toast.ts";

export function UploadModel({setModelUri}: { setModelUri: (model: string, name: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const modelName = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState("")
    const [open, setOpen] = useState(false);
    const {toast} = useToast()

    const updateFileName = () => {
        const name = fileInputRef?.current?.files?.item(0)?.name ?? ""
        setFileName(name)
    }

    const handleFileUpload = () => {
        const file = fileInputRef?.current?.files?.item(0) ?? null
        if (file == null) {
            return
        }
        uploadFile(modelName?.current?.value ?? "undefined", file).then(() => {
            toast({
                title: "File uploaded",
                description: `File ${modelName?.current?.value} was uploaded`,
            })
            setOpen(false)
            setModelUri(modelName?.current?.value ?? "undefined", file.name)
        })
    }

    return <SidebarMenuItem key="Upload">
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SidebarMenuButton asChild>
                    <div>
                        <Upload/>
                        <span>Upload</span>
                    </div>
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Model</DialogTitle>
                    <DialogDescription>
                        Upload your model and give it a name. Click upload when you are done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="filename" className="text-right">
                            Model Name
                        </Label>
                        <Input
                            ref={modelName}
                            id="filename"
                            className="col-span-3"
                        />
                        <Label htmlFor="import" className="text-right">
                            Import File
                        </Label>
                        <Input
                            id="file"
                            disabled
                            className="col-span-2"
                            value={fileName}
                        />
                        <Button type="button" id="import" className="col-span-1" variant="outline" onClick={() => {
                            if (fileInputRef.current) {
                                fileInputRef.current.click()
                            }
                        }}>Load File</Button>
                        <Input
                            style={{display: "none"}}
                            ref={fileInputRef}
                            type="file"
                            onChange={() => updateFileName()}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={() => handleFileUpload()}>Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </SidebarMenuItem>
}