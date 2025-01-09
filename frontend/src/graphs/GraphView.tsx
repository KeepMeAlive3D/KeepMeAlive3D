import {useAppSelector} from "@/hooks/hooks.ts";
import MqttGraph from "@/graphs/MqttGraph.tsx";


function GraphView() {
    const modelParts = useAppSelector((state) => state.modelParts.parts);


    return (
        <div>
            {modelParts.map((item) => (
                <MqttGraph topic={item.userData["topic"]}/>
            ))}
        </div>
    );
}


export default GraphView;