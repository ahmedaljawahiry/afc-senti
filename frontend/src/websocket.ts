import { useEffect, useState } from "react";

const WS_ENDPOINT = "ws://localhost:8000/ws";

type OpenConnectionArgs = {
  onMessage?: (data: MessageEvent) => void;
};

type CloseConnectionArgs = WebSocket;

function openConnection({ onMessage }: OpenConnectionArgs): WebSocket {
  console.log(`Connecting to ${WS_ENDPOINT}`);
  const ws = new WebSocket(WS_ENDPOINT);

  if (onMessage) {
    ws.onmessage = onMessage;
  }
  console.log(`Connected to ${WS_ENDPOINT}`);
  return ws;
}

function closeConnection(ws: CloseConnectionArgs) {
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

export default function useWebSocketData<T>() {
  const [ws, setWS] = useState<WebSocket>();
  const [data, setData] = useState<T>();

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
        onMessage: (ev) => setData(ev.data),
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
    data,
    status: ws?.readyState || WebSocket.CLOSED,
    start,
    stop,
  };
}
