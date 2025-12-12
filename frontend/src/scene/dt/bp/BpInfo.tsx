import type {BpInfoData} from "@/scene/dt/bp/bpInfoData.ts";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Card} from "@/components/ui/card.tsx";
import {File, Plus, Trash, Workflow} from "lucide-react";
import {CreateBpDialogContent} from "@/scene/dt/bp/CreateBpDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";
import {type SetStateAction, useState} from "react";
import * as React from "react";

export function BpInfo() {
    const [sample, setSample] = useState<BpInfoData | undefined>(
        {
            dtId: 2,
            fileName: "abc.xml"
        }
    )

    return (
        <>
            <div className="max-width flex flex-row m-4 mb-0">
                <h2 className="text-lg font-semibold flex flex-row">
                    <Workflow/>
                    <span className="ml-2">Business Process Model</span>
                </h2>
            </div>
            <div className="flex flex-wrap">
                <div className="mr-2"></div>
                <RenderBp data={sample} setData={setSample}/>
            </div>
        </>
    )
}

function RenderBp({data, setData}: { data:  BpInfoData | undefined, setData: React.Dispatch<SetStateAction<BpInfoData | undefined>> }) {
    const [open, setOpen] = useState(false);
    if (data) {
        return (
            <Link to={`/dt/${data.dtId}/bp/${data.fileName}`} className="w-full max-w-sm mx-2 my-4">
                <Card className=" hover:bg-accent cursor-pointer min-h-25 flex-row">
                    <File className="m-auto ml-5"/>
                    <h2 className="m-auto font-medium">{data.fileName}</h2>
                    <Button
                        type="button"
                        id={`delete-${data.fileName}`}
                        className="col-span-1 my-auto mr-5 ml-auto"
                        variant="destructive"
                        onClick={e => {
                            e.preventDefault()
                            setData(undefined)
                        }}
                    >
                        <Trash/>
                    </Button>
                </Card>
            </Link>
        )
    } else {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Card className="w-full max-w-sm mx-2 my-4 hover:bg-accent cursor-pointer min-h-25">
                        <Plus className="m-auto" size={40}/>
                    </Card>
                </DialogTrigger>
                <CreateBpDialogContent setData={setData} setOpen={setOpen}/>
            </Dialog>
        )
    }
}