type Color = "red" | "green";
type Direction = "positive" | "negative";

type CityProps = {
  color?: Color;
  direction?: Direction;
};

const colorScale: Record<Color, string[]> = {
  // type manually so tailwind parses these colours
  red: [
    "bg-gray-500",
    "bg-red-200",
    "bg-red-300",
    "bg-red-400",
    "bg-red-500",
    "bg-red-600",
    "bg-red-700",
    "bg-red-800",
    "bg-red-900",
  ],
  green: [
    "bg-gray-500",
    "bg-green-200",
    "bg-green-300",
    "bg-green-400",
    "bg-green-500",
    "bg-green-600",
    "bg-green-700",
    "bg-green-800",
    "bg-green-900",
  ],
};

export default function HeatCity({
  color = "green",
  direction = "positive",
}: CityProps) {
  let colors = colorScale[color];
  let classes = "items-end";
  let towerClasses = "flex flex-wrap-reverse pt-2";

  if (direction === "negative") {
    colors = [...colors].reverse();
    classes = "items-start translate-y-full";
    towerClasses = "flex flex-wrap pb-2";
  }

  return (
    <div className={`w-96 rounded flex flex-row justify-center ${classes}`}>
      {colors.map((variant) => (
        <Tower
          color={variant}
          density={30}
          key={variant}
          className={towerClasses}
        />
      ))}
    </div>
  );
}

type TowerProps = {
  color: string;
  density: number;
  className?: string;
};

function Tower({
  color,
  density,
  className = "flex flex-wrap hover:border-b-8",
}: TowerProps) {
  let hw = "h-1.5 w-1.5";
  if (density > 1000) {
    hw = "h-1 w-1";
  } else if (density > 4000) {
    hw = "h-0.5 w-0.5";
  }

  return (
    <div
      className={`bg-gray-800 hover:bg-gray-400 border-2 border-black w-10  
        h-fit justify-between rounded-lg px-px mb-2 ${className}`}
    >
      {[...Array(density).keys()].map((i) => (
        <div
          title={`Density: ${density}`}
          className={`${color} ${hw} rounded-full`}
          key={`${color}-${i}`}
        />
      ))}
    </div>
  );
}
