import {useEffect, useState} from "react";
import {createWebsocket, EventMessageType, EventSubscribe, Message} from "@/service/wsService.ts";
import {type ChartConfig, ChartContainer} from "@/components/ui/chart.tsx";
import {Line, LineChart, XAxis, YAxis} from "recharts";
import {useToast} from "@/hooks/use-toast.ts";


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
    const {toast} = useToast()

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
                    const e: string = event.data.toString()
                    const msg: Message = JSON.parse(e) as Message

                    if (msg.manifest.messageType === EventMessageType.ERROR) {
                        toast({
                            variant: "destructive",
                            title: "Error",
                            description: msg.message.eventData.toString(),
                        });
                    } else if (msg.manifest.messageType === EventMessageType.TOPIC_DATAPOINT) {
                        setData(d => [...d, msg])
                    }
                }
            }
        )
        return () => {
            websocketConnection?.close()
        };
    }, [toast, topic])

    return (
        <div>
            <h3 className="m-auto">{topic}</h3>
            <ChartContainer config={chartConfig} className={""}>
                <LineChart width={500} height={300} data={data.map(x => parseInt(x.message.eventData))}>
                    <XAxis/>
                    <YAxis dataKey={(v) => v}/>
                    <Line type="monotone" dataKey={(v) => v} stroke="#8884d8" animationDuration={0}/>
                </LineChart>
            </ChartContainer>
        </div>
    )
}

export default MqttGraph;