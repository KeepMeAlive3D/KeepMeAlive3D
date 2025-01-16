import {useAppSelector} from "@/hooks/hooks.ts";
import MqttGraph from "@/graphs/MqttGraph.tsx";


function GraphView() {
    const modelParts = useAppSelector((state) => state.modelParts.partIds);


    return (
        <div>
            {modelParts.map((item) => (
                <MqttGraph key={item.topic} topic={item.topic}/>
            ))}
        </div>
    );
}


export default GraphView;