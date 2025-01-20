import DynamicModel from "@/scene/DynamicModel.tsx";
import {useAppSelector} from "@/hooks/hooks.ts";
import {Suspense} from "react";

function Edit() {
    const {url, error} = useAppSelector((state) => state.model);

    return <div className="edit-content flex flex-col h-auto">
        <div className="canvas-content flex-grow">
            {url &&
                <Suspense>
                    <DynamicModel objectUrl={url}/>
                </Suspense>

            }
            <p>{error}</p>
        </div>
    </div>
}


export default Edit