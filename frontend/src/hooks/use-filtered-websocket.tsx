import { createWebsocket } from "@/service/wsService.ts";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast.ts";
import {
  EventError,
  EventSubscribe, GenericEventMessage,
  MessageType,
} from "@/service/wsTypes.ts";


function useFilteredWebsocket<Type extends GenericEventMessage>(topic: string, messageType: MessageType, onMessage: (msg: Type) => void) {
  const { toast } = useToast();

  useEffect(() => {
    let websocketConnection: WebSocket | undefined = undefined;
    createWebsocket().then(
      ws => {
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

        ws.onmessage = event => {
          const e: string = event.data.toString();

          const jsonMsg = JSON.parse(e);
          const msgType = jsonMsg["manifest"]["messageType"];

          if (msgType === MessageType.ERROR) {
            const error = jsonMsg as EventError;

            console.error(error.message.message.toString());

            toast({
              variant: "destructive",
              title: "Error",
              description: error.message.message.toString(),
            });
          } else if (msgType === messageType) {
            onMessage(jsonMsg as Type);
          }
        };
      },
    );
    return () => {
      websocketConnection?.close();
    };
  }, [messageType, onMessage, toast, topic]);
}

export default useFilteredWebsocket;