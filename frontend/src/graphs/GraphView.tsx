import { useAppSelector } from "@/hooks/hooks.ts";
import MqttGraph from "@/graphs/MqttGraph.tsx";

function GraphView() {
  const modelParts = useAppSelector((state) => state.modelParts.partIds);

  return (
    <div className="grid grid-cols-2 gap-5 p-5">
      {modelParts
        .filter(
          (it) => !it.topic.startsWith("move") && !it.topic.startsWith("rot")
        )
        .map((item) => (
          <MqttGraph key={item.topic} topic={item.topic} />
        ))}
    </div>
  );
}

export default GraphView;
