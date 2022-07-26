import { useEffect, useState } from "react";

const WS_ENDPOINT = "ws://localhost:8000/ws";

type WebSocketCallbacks = {
  onMessage?: (data: MessageEvent) => void;
  onOpen?: ((this: WebSocket, ev: Event) => any) | null;
  onClose?: ((this: WebSocket, ev: CloseEvent) => any) | null;
  onError?: ((this: WebSocket, ev: Event) => any) | null;
};

function openConnection({
  onMessage,
  onOpen,
  onClose,
  onError,
}: WebSocketCallbacks): WebSocket {
  console.log(`Connecting to ${WS_ENDPOINT}`);
  const ws = new WebSocket(WS_ENDPOINT);

  if (onMessage) ws.onmessage = onMessage;
  if (onOpen) ws.onopen = onOpen;
  if (onClose) ws.onclose = onClose;
  if (onError) ws.onerror = onError;

  console.log(`Connected to ${WS_ENDPOINT}`);
  return ws;
}

function closeConnection(ws: WebSocket) {
  if ([WebSocket.CONNECTING, WebSocket.OPEN].includes(ws.readyState)) {
    console.log(`Closing connection to ${WS_ENDPOINT}`);
    ws.close(1000);
    console.log(`Closed Connection to ${WS_ENDPOINT}`);
  } else {
    console.log(
      `Connection to ${WS_ENDPOINT} already closed or closing - skipping.`
    );
  }
}

export default function useWebSocket<Data>({
  onOpen,
  onClose,
  onError,
  onMessage,
}: Omit<WebSocketCallbacks, "onMessage"> & {
  onMessage: (data: Data) => void;
}) {
  const [ws, setWS] = useState<WebSocket>();

  useEffect(() => {
    return () => {
      if (ws) {
        closeConnection(ws);
      }
    };
  }, [ws]);

  function start() {
    if (!ws) {
      const connection = openConnection({
        onMessage: (ev) => {
          const data = JSON.parse(ev.data) as Data;
          onMessage(data);
        },
        onOpen,
        onClose,
        onError,
      });
      setWS(connection);
    }
  }

  function stop() {
    if (ws) {
      closeConnection(ws);
      setWS(undefined);
    }
  }

  return {
    status: ws ? ws.readyState : WebSocket.CLOSED,
    start,
    stop,
  };
}
