import {useEffect, useState} from "react";
import {createWebsocket, EventMessageType, EventSubscribe, Message} from "@/service/wsService.ts";
import {type ChartConfig, ChartContainer} from "@/components/ui/chart.tsx";
import {Line, LineChart, XAxis, YAxis} from "recharts";


const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

function MqttGraph({topic}: { topic: string }) {
    const [data, setData] = useState<Array<Message>>([]);

    useEffect(() => {
        let websocketConnection: WebSocket | undefined = undefined
        createWebsocket().then(
            ws => {
                const subscribeData: EventSubscribe = {
                    manifest: {
                        version: 1,
                        messageType: EventMessageType.SUBSCRIBE_TOPIC,
                        timestamp: new Date().valueOf(),
                        bearerToken: localStorage.getItem("token") ?? "null",
                    },
                    message: {
                        topic: topic
                    }
                }
                websocketConnection = ws
                ws.send(JSON.stringify(subscribeData))

                ws.onmessage = event => {
                    console.debug(event.data.toString());
                    const e: string = event.data.toString()
                    const msg: Message = JSON.parse(e)
                    setData(d => [...d, msg])
                }
            }
        )
        return () => {
            websocketConnection?.close()
        };
    }, [topic])

    return (
        <ChartContainer config={chartConfig}>
            <LineChart width={500} height={300} data={data.map(x => parseInt(x.message.eventData))}>
                <XAxis/>
                <YAxis dataKey={(v) => v}/>
                <Line type="monotone" dataKey={(v) => v} stroke="#8884d8" animationDuration={0}/>
            </LineChart>
        </ChartContainer>
    )
}

export default MqttGraph;