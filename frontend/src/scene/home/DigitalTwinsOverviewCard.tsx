import {deleteDigitalTwin, type DigitalTwinInfo} from "@/scene/home/digitalTwinInfo.ts";
import {Hammer, Star, Trash, Wrench} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";
import {Card} from "@/components/ui/card.tsx";
import * as React from "react";
import type {SetStateAction} from "react";

export function DigitalTwinsOverviewCard({dtData, refresh, setRefresh}: {
    dtData: DigitalTwinInfo,
    refresh: boolean,
    setRefresh: React.Dispatch<SetStateAction<boolean>>
}) {
    function del() {
        deleteDigitalTwin(dtData.id).then(() => setRefresh(!refresh))
    }

    return (
        <Link to={`/dt/${dtData.id}`} className="w-full max-w-sm mx-2 my-4">
            <Card className=" hover:bg-accent cursor-pointer min-h-25 flex-row">
                <GetProjectIcon iconId={dtData.icon} className="m-auto ml-5"/>
                <h2 className="m-auto font-medium">{dtData.name}</h2>
                <Button
                    type="button"
                    id={`delete-${dtData.id}`}
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

function GetProjectIcon({iconId, className}: { iconId: number, className: string }) {
    switch (iconId) {
        case 1:
            return (<Wrench className={className}/>);
        case 2:
            return (<Star className={className}/>);
        default:
            return (<Hammer className={className}/>);
    }
}