import useWebSocketData from "../websocket";

export default function App() {
  const { data, start, stop, status } = useWebSocketData<string>();

  const isOpen = status === WebSocket.OPEN;
  const isLoading = [WebSocket.CLOSING, WebSocket.CONNECTING].includes(status);

  return (
    <div className="bg-black h-screen w-full flex justify-center items-center">
      <div className="flex flex-col items-center space-y-10">
        <p className="text-white">{status}</p>
        <button
          disabled={isLoading}
          onClick={isOpen ? stop : start}
          className={`px-6 py-2 text-lg text-white disabled:bg-gray-500 rounded ${
            isOpen ? "bg-red-700" : "bg-green-700"
          }`}
        >
          {isOpen ? "Stop" : "Start"}
        </button>
        <div
          className={`text-3xl ${isOpen ? "text-green-700" : "text-red-700"}`}
        >
          {data}
        </div>
      </div>
    </div>
  );
}
