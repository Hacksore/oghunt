function stringToHexColorAndFont(str: string): {
  backgroundColor: string;
  color: string;
  borderColor: string;
} {
  // Hash the input string to get a number
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to a more visually appealing dark hex color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    // Generate a dark but vivid color by limiting the RGB value to a middle range and adding a base value
    const value = (((hash >> (i * 8)) & 0xff) % 128) + 64; // Limit to [64, 191] range for richer colors
    color += ("00" + value.toString(16)).slice(-2);
  }

  // Convert the hex color to RGB for manipulation
  const r = Number.parseInt(color.slice(1, 3), 16);
  const g = Number.parseInt(color.slice(3, 5), 16);
  const b = Number.parseInt(color.slice(5, 7), 16);

  // Calculate a lighter version of the background color for the font
  const lighten = (value: number, amount: number) => Math.min(255, value + amount);
  const fontColor = `#${lighten(r, 200).toString(16).padStart(2, "0")}${lighten(g, 200).toString(16).padStart(2, "0")}${lighten(b, 200).toString(16).padStart(2, "0")}`;

  // Calculate a border color that is between the background and font color
  const borderColor = `#${lighten(r, 40).toString(16).padStart(2, "0")}${lighten(g, 40).toString(16).padStart(2, "0")}${lighten(b, 40).toString(16).padStart(2, "0")}`;

  return {
    backgroundColor: color,
    color: fontColor,
    borderColor: borderColor,
  };
}

type Props = {
  name: string;
};

export const Pill = ({ name }: Props) => {
  const { backgroundColor, borderColor, color } = stringToHexColorAndFont(name);
  return (
    <span
      style={{
        backgroundColor,
        color,
        borderColor,
      }}
      className="rounded-2xl border px-1 py-0.5 text-xs md:px-2 md:py-1 md:text-sm"
    >
      {name}
    </span>
  );
};
