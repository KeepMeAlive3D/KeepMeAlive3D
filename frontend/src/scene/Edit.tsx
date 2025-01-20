import DynamicModel from "@/scene/DynamicModel.tsx";

function Edit({modelUri}: { modelUri: string | null }) {
    return <div className="edit-content flex flex-col h-auto">
        <div className="canvas-content flex-grow">
            {modelUri &&
                <DynamicModel objectUrl={modelUri}/>
            }
        </div>
    </div>
}


export default Edit