import * as React from "react";
import type {SetStateAction} from "react";
import {Link, useParams} from "react-router";
import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {GitGraph, Trash} from "lucide-react";
import {deleteStateMachine} from "@/scene/dt/participant/stateMachine/data.ts";

export function StateMachineCard({id, setRefresh, refresh, name}: {
    id: number,
    setRefresh: React.Dispatch<SetStateAction<boolean>>
    refresh: boolean,
    name: string
}) {
    const { dtId, participantId } = useParams();

    function del() {
        deleteStateMachine(dtId!, participantId!, id).then(() => setRefresh(!refresh))
    }

    return (
        <Link to={`/dt/${dtId}/participant/${participantId}/state-machine/${id}`} className="w-full max-w-sm mx-2 my-4">
            <Card className=" hover:bg-accent cursor-pointer min-h-25 flex-row">
                <GitGraph className="m-auto ml-5"/>
                <h2 className="m-auto font-medium">{name}</h2>
                <Button
                    type="button"
                    id={`delete-${id}`}
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
