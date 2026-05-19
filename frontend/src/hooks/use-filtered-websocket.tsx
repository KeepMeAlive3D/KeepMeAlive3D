import { createWebsocket } from "@/service/wsService.ts";
import { useEffect } from "react";
import { toast } from "sonner";
import { type EventError, type EventSubscribe, type GenericEventMessage, MessageType } from "@/service/wsTypes.ts";

/**
 * The `useFilteredWebsocket` hook establishes a WebSocket connection and subscribes to specific topics.
 * It listens for messages of a specified type and invokes a callback when such messages are received.
 *
 * @Features
 * - Automatically subscribes to the provided topics upon connection.
 * - Filters incoming messages by the specified `messageType`.
 * - Displays error messages using the `useToast` hook if an error message is received.
 * - Cleans up the WebSocket connection when the component unmounts.
 *
 * @template Type - The type of the WebSocket message expected.
 * @param topicsArg - An array of topics to subscribe to.
 * @param messageType - The type of message to filter and handle.
 * @param onMessage - A callback function to handle messages of the specified type.
 * @param onReplayEnd - A callback function to let the caller know that the server has ended the channel.
 * This does not trigger when the client loses the connection or proactively closes the channel.
 */
function useFilteredWebsocket<Type extends GenericEventMessage>(
  topicsArg: Array<string>,
  messageType: MessageType,
  onMessage: (msg: Type) => void,
  onReplayEnd: () => void = () => {},
) {

  useEffect(() => {
    let isCancelled = false;
    let websocketConnection: WebSocket | undefined = undefined;
    createWebsocket().then((ws) => {
      if (isCancelled) {
        ws.close();
        return;
      }

      // Create subscription messages
      const subscriptions = topicsArg.map((topic: string) => {
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

      // Subscribe to the topics
      subscriptions.forEach((subscription) => {
        ws.send(JSON.stringify(subscription));
      });
      console.info(`Subscribe to topics ${topicsArg}`)

      ws.onmessage = (event) => {
        const e: string = event.data.toString();

        const jsonMsg = JSON.parse(e);
        const receivedMsgType: MessageType = jsonMsg["manifest"]["messageType"];

        if (receivedMsgType === MessageType.ERROR) {
          const error = jsonMsg as EventError;

          console.error(error.message.message.toString());

          toast.error("Error", {
            description: error.message.message.toString()
          })
        } else if (receivedMsgType === MessageType.END_MESSAGE) {
          onReplayEnd()
          console.info(`Received end message from server, closing websocket for topic: ${topicsArg}.`)
          isCancelled = true;
          ws.close();
        } else if (receivedMsgType === messageType) {
          // Call callback function with the parsed message
          onMessage(jsonMsg as Type);
        } else {
          toast.error("Lost connection to server", {description: "A websocket connection was unexpectedly closed!"})
          console.error(`Received invalid msg type from server, got '${receivedMsgType}' but expected '${messageType}'`)
        }
      };
    });
    // Cleanup -> close socket
    return () => {
      console.info(`Closing websocket, cleanup for ${topicsArg}`)
      isCancelled = true;
      websocketConnection?.close();
    };
  }, [messageType, onMessage, onReplayEnd, topicsArg]);
}

export default useFilteredWebsocket;
