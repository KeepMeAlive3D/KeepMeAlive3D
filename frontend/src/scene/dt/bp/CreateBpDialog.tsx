import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useRef, useState} from "react";

export function CreateBpDialogContent() {
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create a Buisness Process</DialogTitle>
                <DialogDescription>
                    Upload a BPMN formatted file to create Buisness Process.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="import" className="text-right">
                        Import File
                    </Label>
                    <Input
                        id="file"
                        disabled
                        className="col-span-2"
                        value={fileName}
                    />
                    <Button
                        type="button"
                        disabled={false}
                        id="import"
                        className="col-span-1"
                        variant="outline"
                        onClick={() => {
                            if (fileInputRef.current) {
                                fileInputRef.current.click();
                            }
                        }}
                    >
                        Load File
                    </Button>
                    <Input
                        style={{ display: "none" }}
                        id="hiddenFileInput"
                        ref={fileInputRef}
                        type="file"
                        onChange={() => {}}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create Process</Button>
            </DialogFooter>
        </DialogContent>
    );
}