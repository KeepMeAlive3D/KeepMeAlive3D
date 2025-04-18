import { useCallback, useEffect, useState } from "react";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart.tsx";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { DataPointEventMessage, MessageType } from "@/service/wsTypes.ts";
import useFilteredWebsocket from "@/hooks/use-filtered-websocket.tsx";
import { getEventDataPointsOfTopic } from "@/service/model_datapoint.ts";
import { format } from "date-fns";
import { useAppSelector } from "@/hooks/hooks.ts";
import { selectReplay } from "@/slices/ReplaySlice.ts";

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
  const replay = useAppSelector(selectReplay);

  useEffect(() => {
    setData([]);
  }, [replay]);

  const dataCallback = useCallback((msg: DataPointEventMessage) => {
    setData((d) => {
      const current = [...d, msg];

      const lastMsgTime = current[current.length - 1].manifest.timestamp;
      let currTime = new Date();
      if (lastMsgTime) {
        currTime = new Date(lastMsgTime * 1000);
      }

      const twoMinAgo = currTime.getTime() - 2 * 60 * 1000;
      return current.filter(
        (it) => (it.manifest.timestamp ?? 0) * 1000 > twoMinAgo
      );
    });
  }, []);

  useFilteredWebsocket<DataPointEventMessage>(
    [topic],
    MessageType.TOPIC_DATAPOINT,
    dataCallback
  );

  useEffect(() => {
    getEventDataPointsOfTopic(topic).then((it) => {
      setData(it.data);
    });
  }, [topic]);

  return (
    <div>
      <h3 className="m-auto">{topic}</h3>
      <ChartContainer config={chartConfig} className={""}>
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            tickFormatter={(v) =>
              format(new Date(v * 1000), "dd/MM/yyyy HH:mm")
            }
            dataKey={(v) => v.manifest.timestamp}
          />
          <YAxis dataKey={(v) => v.message.point} />
          <Line
            type="monotone"
            dataKey={(v) => v.message.point}
            stroke="#8884d8"
            animationDuration={0}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export default MqttGraph;
