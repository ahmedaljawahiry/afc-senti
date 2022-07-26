import useWebSocketData from "../websocket";
import { useState } from "react";

import Tweet from "./Tweet";
import ConnectButton from "./ConnectButton";
import HeatCity from "./HeatCity";

type InfoMessage = {
  type: "info";
  text: string;
};

type Tweet = { text: string; id: string };
type PolarityScore = {
  pos: number;
  neu: number;
  neg: number;
  compound: number;
};

type TweetMessage = {
  type: "tweet";
  data: {
    tweet: Tweet;
    sentiment: PolarityScore;
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
        console.log(data.data.sentiment);
      }
    },
  });

  return (
    <div className="bg-black min-h-screen w-full flex justify-center overflow-y-scroll pt-8">
      <div className="flex flex-col h-full w-full justify-between items-center px-52 space-y-10">
        <ConnectButton status={status} start={start} stop={stop} />
        <Tweet text={lastTweet} isLoading={status === WebSocket.CONNECTING} />
        <div className="flex justify-between items-center w-full space-x-10">
          <div className="text-6xl">😡</div>
          <div className="flex gap-3">
            <HeatCity color="red" direction="negative" />
            <HeatCity color="green" direction="positive" />
          </div>
          <div className="text-6xl">🙂</div>
        </div>
      </div>
    </div>
  );
}
