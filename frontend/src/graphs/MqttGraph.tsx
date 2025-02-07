import { useCallback, useState } from "react";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart.tsx";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import {
  DataPointEventMessage,
  MessageType,
} from "@/service/wsTypes.ts";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

function MqttGraph({ topic }: { topic: string }) {
  const [data, setData] = useState<Array<DataPointEventMessage>>([]);

  const dataCallback = useCallback((msg: DataPointEventMessage) => {
    setData((d) => [...d, msg]);
  }, []);

  useFilteredWebsocket<DataPointEventMessage>(topic, MessageType.TOPIC_DATAPOINT, dataCallback);

  return (
    <div>
      <h3 className="m-auto">{topic}</h3>
      <ChartContainer config={chartConfig} className={""}>
        <LineChart
          width={500}
          height={300}
          data={data.map((x) => x.message.point)}
        >
          <XAxis />
          <YAxis dataKey={(v) => v} />
          <Line
            type="monotone"
            dataKey={(v) => v}
            stroke="#8884d8"
            animationDuration={0}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export default MqttGraph;
