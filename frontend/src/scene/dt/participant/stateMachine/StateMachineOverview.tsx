import {Spinner} from "@/components/ui/spinner.tsx";
import {useEffect, useState} from "react";
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Plus} from "lucide-react";
import {getAllStateMachines} from "@/scene/dt/participant/stateMachine/data.ts";
import {useParams} from "react-router";
import {StateMachineCard} from "@/scene/dt/participant/stateMachine/StateMachineCard.tsx";
import {StateMachineDialog} from "@/scene/dt/participant/stateMachine/StateMachineDialog.tsx";

export function StateMachineOverview() {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [stateMachines, setStateMachines] = useState<string[]>([])

    const { dtId, participantId } = useParams();

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const request = await getAllStateMachines(dtId!, participantId!)
                setStateMachines(request.data)
            } finally {
                setLoading(false)
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        fetchData()
    }, [dtId, participantId, refresh]);

    return(
        <>
            <div className="max-width flex flex-row m-4 mb-0">
                <h2 className="text-xl font-semibold">State Machine</h2>
                {loading ? <Spinner className="ml-2 my-auto size-5"/> : null}
            </div>
            <div className="flex flex-wrap">
                <div className="mr-2"></div>
                {
                    stateMachines.map(it => <StateMachineCard data={it} setRefresh={setRefresh} refresh={refresh}/>)
                }
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Card className="w-full max-w-sm mx-2 my-4 hover:bg-accent cursor-pointer min-h-25">
                            <Plus className="m-auto" size={40}/>
                        </Card>
                    </DialogTrigger>
                    <StateMachineDialog setOpen={setOpen} setRefresh={setRefresh} refresh={refresh}/>
                </Dialog>
            </div>
        </>
    )
}