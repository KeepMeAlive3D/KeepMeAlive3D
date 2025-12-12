import {Spinner} from "@/components/ui/spinner.tsx";
import {useState} from "react";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Plus} from "lucide-react";
import {CreateDigitalTwinProjectDialog} from "@/scene/home/CreateDigitalTwinProjectDialog.tsx";

export function ModelOverview() {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [refresh, setRefresh] = useState(false)

    return (
        <>
            <div className="max-width flex flex-row m-4 mb-0">
                <h2 className="text-xl font-semibold">3D Model</h2>
                {loading ? <Spinner className="ml-2 my-auto size-5"/> : null}
            </div>
            <div className="flex flex-wrap">
                <div className="mr-2"></div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Card className="w-full max-w-sm mx-2 my-4 hover:bg-accent cursor-pointer min-h-25">
                            <Plus className="m-auto" size={40}/>
                        </Card>
                    </DialogTrigger>
                    <CreateDigitalTwinProjectDialog setOpen={setOpen} setRefresh={setRefresh} refresh={refresh}/>
                </Dialog>
            </div>
        </>
    )
}