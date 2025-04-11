import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WebSocketContextType {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextType>({ socket: null });

interface WebSocketProviderProps {
  url: string;
  children: ReactNode;
}

export function WebSocketProvider({ url, children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
    };

    ws.onclose = (ev) => {
      console.debug(ev.code);
    };

    ws.onerror = (ev) => {
      console.debug(ev);
    };

    setSocket(ws);

  }, [url]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}