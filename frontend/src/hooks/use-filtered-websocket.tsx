import { createWebsocket } from "@/service/wsService.ts";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast.ts";
import {
  EventError,
  EventSubscribe, GenericEventMessage,
  MessageType,
} from "@/service/wsTypes.ts";


function useFilteredWebsocket<Type extends GenericEventMessage>(topicsArg: Array<string>, messageType: MessageType, onMessage: (msg: Type) => void) {
  const { toast } = useToast();

  const topics = useRef<string[]>([]);

  // Only update if the topics actually changed and not only the reference of the array
  if (!topics.current || !areArraysEqual(topicsArg, topics.current)) {
    topics.current = topicsArg;
  }

  useEffect(() => {
    let websocketConnection: WebSocket | undefined = undefined;
    createWebsocket().then(
      ws => {
        const subscriptions = topics.current.map((topic) => {
          return {
            manifest: {
              version: 1,
              messageType: MessageType.SUBSCRIBE_TOPIC,
              timestamp: new Date().valueOf(),
              bearerToken: localStorage.getItem("token") ?? "null",
              uuid: localStorage.getItem("uuid"),
            },
            message: {
              topic: topic,
            },
          } as EventSubscribe;
        });

        websocketConnection = ws;

        subscriptions.forEach((subscription) => {
          ws.send(JSON.stringify(subscription));
        });




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
  }, [messageType, onMessage, toast, topics]);
}

function areArraysEqual(arr1: string[], arr2: string[]): boolean {
  return arr1.length === arr2.length && new Set(arr1).size === new Set(arr2).size &&
    [...new Set(arr1)].every(item => arr2.includes(item));
}

export default useFilteredWebsocket;