"use client";
import { useTheme } from "next-themes";
import { Link } from "./link";

export const PeerlistBadge = () => {
  const { theme, systemTheme } = useTheme();

  // get light or dark mode but also respect system theme
  const determinedTheme = theme === "system" ? systemTheme : theme;

  return (
    <Link href="https://peerlist.io/hacksore/project/oghunt-20">
      <img
        src={`/peerlist-${determinedTheme}.svg`}
        alt="Peerlist Launch Badge"
        className="mx-auto mb-8 w-42 h-auto"
      />
    </Link>
  );
};
