import {getDtParticipants, type ProcessParticipantInfo} from "@/scene/dt/participant/processParticipantInfo.ts";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import {DigitalTwinParticipantCard} from "@/scene/dt/participant/DigitalTwinParticipantCard.tsx";
import {CreateParticipantDialog} from "@/scene/dt/participant/CreateParticipantDialog.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Waypoints, Plus} from "lucide-react";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {Spinner} from "@/components/ui/spinner.tsx";

export function DigitalTwinParticipants() {
    const [participants, setParticipants] = useState<ProcessParticipantInfo[]>([])
    const [loading, setLoading] = useState(true)
    const {dtId} = useParams();
    const [open, setOpen] = useState(false)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await getDtParticipants(Number(dtId))
                setParticipants(response.data)
            } finally {
                setLoading(false)
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        fetchData()
    }, [dtId, refresh]);

    return (
        <>
            <div className="max-width flex flex-row m-4 mb-0">
                <h2 className="text-lg font-semibold flex flex-row">
                    <Waypoints/>
                    <span className="mx-2">Process Participants</span>
                    {loading ? <Spinner className="my-auto size-5" /> : null}
                </h2>
            </div>
            <div className="flex flex-wrap">
                <div className="mr-2"></div>
                {
                    participants.map(it => {
                        return (
                            <DigitalTwinParticipantCard data={it} setRefresh={setRefresh} refresh={refresh} key={it.id}/>
                        )
                    })
                }
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Card className="w-full max-w-sm mx-2 my-4 hover:bg-accent cursor-pointer min-h-25">
                            <Plus className="m-auto" size={40}/>
                        </Card>
                    </DialogTrigger>
                    <CreateParticipantDialog setOpen={setOpen} setRefresh={setRefresh} refresh={refresh}/>
                </Dialog>
            </div>
        </>
    )
}