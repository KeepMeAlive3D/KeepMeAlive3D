import { Channel } from "typescript-channel";

export async function createWebsocket(): Promise<WebSocket> {
  return new Promise((resolve) => {
    const ws = new WebSocket(import.meta.env.VITE_APP_BASE_URL + "/ws");

    ws.onopen = () => {
      resolve(ws);
    };
    ws.onmessage = onMessage;
    ws.onerror = onError;
    ws.onclose = onClose;
  });
}

export const wsMessages = new Channel<unknown>();
export const wsError = new Channel<string>();

export const wsCanceled = new Channel<boolean>();

//An event listener to be called when a message is received from the server
function onMessage(event: MessageEvent): void {
  try {
    const e: string = event.data.toString();
    wsMessages.send(e);
  } catch (e) {
    wsError.send(`${e}`);
  }
}

//An event listener to be called when an error occurs. This is a simple event named "error".
function onError(event: Event): void {
  wsError.send(`${event}`);
}

//An event listener to be called when the WebSocket connection's readyState changes to CLOSED.
function onClose(event: CloseEvent): void {
  wsCanceled.send(true);
  console.error(`connection was closed by server? ${event}`);
}
