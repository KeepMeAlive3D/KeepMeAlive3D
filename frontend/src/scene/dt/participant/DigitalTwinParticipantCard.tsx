import {Button} from "@/components/ui/button.tsx";
import {Trash} from "lucide-react";
import {deleteParticipant, type ProcessParticipantInfo} from "@/scene/dt/participant/processParticipantInfo.ts";
import {Link, useParams} from "react-router";
import {Card} from "@/components/ui/card.tsx";
import * as React from "react";
import type {SetStateAction} from "react";
import { GetParticipantIcon } from "@/scene/dt/participant/ParticipantIcon.tsx";

export function DigitalTwinParticipantCard({data, setRefresh, refresh}: {
    data: ProcessParticipantInfo,
    setRefresh: React.Dispatch<SetStateAction<boolean>>
    refresh: boolean
}) {
    const {dtId} = useParams();

    function del() {
        deleteParticipant(Number(dtId), Number(data.id)).then(() => setRefresh(!refresh))
    }

    return (
        <Link to={`/dt/${dtId}/participant/${data.id}`} className="w-full max-w-sm mx-2 my-4">
            <Card className=" hover:bg-accent cursor-pointer min-h-25 flex-row">
                <GetParticipantIcon iconId={data.icon} className="m-auto ml-5" size={45}/>
                <h2 className="m-auto font-medium">{data.name}</h2>
                <Button
                    type="button"
                    id={`delete-${data.id}`}
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

