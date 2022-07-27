import { useState } from "react";

import useWebSocketData from "../hooks/websocket";
import useBucket from "../hooks/buckets";

import Tweet from "./Tweet";
import ConnectButton from "./ConnectButton";
import HeatCity from "./HeatCity";
import Emoji from "./Emoji";

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
type TweetData = {
  tweet: Tweet;
  sentiment: PolarityScore;
};

type TweetMessage = {
  type: "tweet";
  data: TweetData;
};

type Message = InfoMessage | TweetMessage;

export default function App() {
  const [lastTweetData, setLastTweetData] = useState<TweetData>();

  const {
    bucket: happy,
    addToBucket: addToHappy,
    reset: resetHappy,
  } = useBucket();

  const { bucket: sad, addToBucket: addToSad, reset: resetSad } = useBucket();

  const { start, stop, status } = useWebSocketData<Message>({
    onMessage: (data) => {
      if (data.type === "info") {
        console.log(data.text);
      } else if (data.type === "tweet") {
        setLastTweetData(data.data);
        console.log(data.data.sentiment);

        const score = data.data.sentiment.compound;
        score >= 0 ? addToHappy(score) : addToSad(score);
      }
    },
    onClose: () => {
      resetHappy();
      resetSad();
    },
  });

  return (
    <div className="bg-black min-h-screen w-full flex justify-center overflow-y-scroll pt-8">
      <div className="flex flex-col h-full w-full justify-between items-center px-52 space-y-24">
        <ConnectButton status={status} start={start} stop={stop} />
        <Tweet
          text={lastTweetData?.tweet.text}
          isLoading={status === WebSocket.CONNECTING}
        />
        <div className="flex justify-between items-center w-full space-x-10">
          <Emoji
            value={"😡"}
            score={lastTweetData?.sentiment.compound}
            key={`sad-${lastTweetData?.tweet.id}`}
          />
          <div className="flex gap-3">
            <HeatCity color="red" direction="negative" data={sad} />
            <HeatCity color="green" direction="positive" data={happy} />
          </div>
          <Emoji
            value={"🙂"}
            score={lastTweetData?.sentiment.compound}
            key={`happy-${lastTweetData?.tweet.id}`}
          />
        </div>
      </div>
    </div>
  );
}
