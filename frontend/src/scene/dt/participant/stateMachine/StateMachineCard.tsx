import * as React from "react";
import type {SetStateAction} from "react";
import {Link, useParams} from "react-router";
import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {GitGraph, Trash} from "lucide-react";
import {deleteStateMachine} from "@/scene/dt/participant/stateMachine/data.ts";

export function StateMachineCard({data, setRefresh, refresh}: {
    data: string,
    setRefresh: React.Dispatch<SetStateAction<boolean>>
    refresh: boolean
}) {
    const { dtId, participantId } = useParams();

    function del() {
        deleteStateMachine(dtId!, participantId!, data).then(() => setRefresh(!refresh))
    }

    return (
        <Link to={`/dt/${dtId}/participant/${participantId}/state-machine/${data}`} className="w-full max-w-sm mx-2 my-4">
            <Card className=" hover:bg-accent cursor-pointer min-h-25 flex-row">
                <GitGraph className="m-auto ml-5"/>
                <h2 className="m-auto font-medium">{data}</h2>
                <Button
                    type="button"
                    id={`delete-${data}`}
                    className="col-span-1 my-auto mr-5 ml-auto"
                    variant="destructive"
                    onClick={e => {
                        e.preventDefault();
                        del();
                    }}
                >
                    <Trash/>
                </Button>
            </Card>
        </Link>
    );
}
