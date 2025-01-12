import {Button} from "@/components/ui/button.tsx";
import DynamicModel from "@/scene/DynamicModel.tsx";

function Edit({modelUri}: { modelUri: string | null }) {
    return <div className="edit-content flex flex-col h-auto">
        <div className="canvas-content flex-grow">
            {modelUri &&
                <DynamicModel objectUrl={modelUri}/>
            }
        </div>

        <div className={"footer-content ml-auto p-2"}>
            <Button className={"footer-button w-28"}>Save</Button>
        </div>

    </div>
}


export default Edit