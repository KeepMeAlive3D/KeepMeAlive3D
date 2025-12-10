import {DigitalTwinParticipants} from "@/scene/dt/DigitalTwinParticipants.tsx";
import {CreateContentCards} from "@/scene/dt/CreateContentCards.tsx"
import { Separator } from "@/components/ui/separator.tsx";

export function DigitalTwinOverview() {
    return (
        <div className="flex flex-col">
            <h2 className="text-xl font-semibold m-4">Digital Twin <span className="ml-2 ext-blue-600 dark:text-sky-400">test</span></h2>
            <CreateContentCards/>
            <Separator/>
            <DigitalTwinParticipants/>
            <Separator/>
            <span>hello</span>
        </div>
    )
}