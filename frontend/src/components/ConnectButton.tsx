type Props = {
  status: number;
  start: () => void;
  stop: () => void;
};

export default function ConnectButton({ status, start, stop }: Props) {
  const isOpen = status === WebSocket.OPEN;

  const textLookup = {
    [WebSocket.OPEN]: "Stop",
    [WebSocket.CLOSED]: "Go",
    [WebSocket.CONNECTING]: "Waiting...",
    [WebSocket.CLOSING]: "Closing",
  };

  return (
    <div className="space-y-10 p-4">
      <div
        className={`text-6xl text-red-600 text-center ${
          status === WebSocket.CLOSED ? "animate-bounce" : ""
        }`}
      >
        {isOpen ? "👀" : "👇"}
      </div>
      <button
        disabled={[WebSocket.CLOSING, WebSocket.CONNECTING].includes(status)}
        onClick={isOpen ? stop : start}
        className={`px-16 py-8 w-60 text-lg w-full text-white disabled:bg-gray-800 disabled:cursor-not-allowed rounded ${
          isOpen
            ? "bg-red-700 hover:bg-red-900"
            : "bg-green-700 hover:bg-green-900"
        }`}
      >
        {textLookup[status]}
      </button>
    </div>
  );
}
