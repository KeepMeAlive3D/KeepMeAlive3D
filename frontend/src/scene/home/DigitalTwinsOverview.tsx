import {DigitalTwinsOverviewCard} from "@/scene/home/DigitalTwinsOverviewCard.tsx";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import {CreateDigitalTwinProjectDialog} from "@/scene/home/CreateDigitalTwinProjectDialog.tsx";
import {useEffect, useState} from "react";
import {type DigitalTwinInfo, getDigitalTwins} from "@/scene/home/digitalTwinInfo.ts";
import {Card} from "@/components/ui/card.tsx";
import {Plus} from "lucide-react";
import {Spinner} from "@/components/ui/spinner.tsx";

export function DigitalTwinsOverview() {
    const [dtData, setDtData] = useState<DigitalTwinInfo[]>([])
    const [open, setOpen] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const request = await getDigitalTwins()
                setDtData(request.data)
            } finally {
                setLoading(false)
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        fetchData()
    }, [refresh]);

    return (
        <div className="flex flex-col">
            <div className="max-width flex flex-row m-4 mb-0">
                <h2 className="text-xl font-semibold">My Business Process Digital Twins</h2>
                {loading ? <Spinner className="ml-2 my-auto size-5"/> : null}
            </div>
            <div className="flex flex-wrap">
                <div className="mr-2"></div>
                {
                    dtData.map(dt => {
                        return (
                            <DigitalTwinsOverviewCard key={dt.id} dtData={dt} refresh={refresh} setRefresh={setRefresh}/>
                        )
                    })
                }
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Card className="w-full max-w-sm mx-2 my-4 hover:bg-accent cursor-pointer min-h-25">
                            <Plus className="m-auto" size={40}/>
                        </Card>
                    </DialogTrigger>
                    <CreateDigitalTwinProjectDialog setOpen={setOpen} setRefresh={setRefresh} refresh={refresh}/>
                </Dialog>
            </div>
            </div>
            )
            }