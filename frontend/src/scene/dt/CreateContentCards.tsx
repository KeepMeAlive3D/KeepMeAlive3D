import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Dialog, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CreateParticipantDialog} from "@/scene/dt/CreateParticipantDialog.tsx";
import {CreateBpDialogContent} from "@/scene/dt/bp/CreateBpDialog.tsx"
import {Waypoints, Workflow} from "lucide-react";

export function CreateContentCards() {
    return (
        <>
            <div className="flex flex-row">
                <Dialog>
                    <DialogTrigger asChild>
                        <Card className="w-full max-w-sm m-4 hover:bg-accent cursor-pointer">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex flex-row">
                                        <Waypoints/>
                                        <span className="ml-2">Create a Process Participant</span>
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    Create a buisness process participant, add a state machine later on.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </DialogTrigger>
                    <CreateParticipantDialog/>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Card className="w-full max-w-sm my-4 hover:bg-accent cursor-pointer">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex flex-row">
                                        <Workflow/>
                                        <span className="ml-2">Create a Business Process</span>
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    Upload a BPMN formatted file to create a Buisness Process
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </DialogTrigger>
                    <CreateBpDialogContent/>
                </Dialog>
            </div>
        </>
    )
}