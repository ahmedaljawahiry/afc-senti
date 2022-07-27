type Props = {
  value: "🙂" | "😡";
  score?: number;
};

export default function Emoji({ value, score }: Props) {
  const shouldShake =
    (score && score && value === "🙂" && score > 0) ||
    (score && value === "😡" && score < 0);

  return (
    <div className={`text-6xl ${shouldShake ? "shake" : ""}`}>{value}</div>
  );
}
