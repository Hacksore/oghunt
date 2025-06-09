"use client";
import { useTheme } from "next-themes";
import { Link } from "./link";

export const PeerlistBadge = () => {
  const { theme, systemTheme } = useTheme();

  const determineTheme = () => {
    if (theme === "system") {
      return systemTheme === "dark" ? "dark" : "light";
    }

    return theme === "dark" ? "dark" : "light";
  };

  return (
    <Link href="https://peerlist.io/hacksore/project/oghunt-20">
      <img
        src={`/peerlist-${determineTheme()}.svg`}
        alt="Peerlist Launch Badge"
        className="mx-auto mb-8 w-42 h-auto"
      />
    </Link>
  );
};
