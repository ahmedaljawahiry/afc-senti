import useWebSocketData from "../websocket";
import { useState } from "react";

import Tweet from "./Tweet";
import ConnectButton from "./ConnectButton";

type InfoMessage = {
  type: "info";
  text: string;
};

type TweetMessage = {
  type: "tweet";
  data: {
    tweet: { text: string; id: string };
  };
};

type Message = InfoMessage | TweetMessage;

export default function App() {
  const [lastTweet, setLastTweet] = useState<string>();

  const { start, stop, status } = useWebSocketData<Message>({
    onMessage: (data) => {
      if (data.type === "info") {
        console.log(data.text);
      } else if (data.type === "tweet") {
        setLastTweet(data.data.tweet.text);
      }
    },
  });

  return (
    <div className="bg-black h-screen w-full flex justify-center items-center">
      <div className="flex flex-col h-full justify-between items-center p-52">
        <div className="space-y-10 p-4">
          <ConnectButton status={status} start={start} stop={stop} />
        </div>
        <div className="flex justify-between space-x-10">
          <div className="text-6xl">😡</div>
          <div className="bg-white w-96 rounded" />
          <div className="text-6xl">🙂</div>
        </div>
        <Tweet text={lastTweet} isLoading={status === WebSocket.CONNECTING} />
      </div>
    </div>
  );
}
