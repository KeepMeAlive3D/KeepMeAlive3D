import { Channel } from "typescript-channel";

export async function createWebsocket(): Promise<WebSocket> {
  return new Promise((resolve) => {
    const ws = new WebSocket(import.meta.env.VITE_APP_BASE_URL + "/ws");

    ws.onopen = () => {
      resolve(ws);
    };
    ws.onerror = onError;
    ws.onclose = onClose;
  });
}

export const wsError = new Channel<string>();

export const wsCanceled = new Channel<boolean>();

//An event listener to be called when an error occurs. This is a simple event named "error".
function onError(event: Event): void {
  wsError.send(`${event}`);
}

//An event listener to be called when the WebSocket connection's readyState changes to CLOSED.
function onClose(event: CloseEvent): void {
  wsCanceled.send(true);
  console.error(`connection was closed by server? ${event}`);
}
