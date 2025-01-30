import { useEffect, useState } from "react";
import { createWebsocket } from "@/service/wsService.ts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart.tsx";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast.ts";
import {
  DataPointEventMessage,
  EventError,
  EventSubscribe,
  MessageType,
} from "@/service/wsTypes.ts";

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
  const { toast } = useToast();

  useEffect(() => {
    let websocketConnection: WebSocket | undefined = undefined;
    createWebsocket().then((ws) => {
      const subscribeData: EventSubscribe = {
        manifest: {
          version: 1,
          messageType: MessageType.SUBSCRIBE_TOPIC,
          timestamp: new Date().valueOf(),
          bearerToken: localStorage.getItem("token") ?? "null",
        },
        message: {
          topic: topic,
        },
      };
      websocketConnection = ws;
      ws.send(JSON.stringify(subscribeData));

      ws.onmessage = (event) => {
        const e: string = event.data.toString();
        const jsonMsg = JSON.parse(e);
        const msgType = jsonMsg["manifest"]["messageType"];

        if (msgType === MessageType.ERROR) {
          const error = jsonMsg as EventError;

          toast({
            variant: "destructive",
            title: "Error",
            description: error.message.message.toString(),
          });
        } else if (msgType === MessageType.TOPIC_DATAPOINT) {
          setData((d) => [...d, jsonMsg as DataPointEventMessage]);
        }
      };
    });
    return () => {
      websocketConnection?.close();
    };
  }, [toast, topic]);

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
