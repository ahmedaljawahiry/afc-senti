type Props = {
  value: "🙂" | "😡";
  score?: number;
};

export default function Emoji({ value, score }: Props) {
  let shouldShake = false;
  if (score !== undefined) {
    shouldShake =
      score === 0 || (score && value === "🙂") || (value === "😡" && score < 0);
  }

  return (
    <div className={`text-6xl ${shouldShake ? "shake" : ""}`}>{value}</div>
  );
}
