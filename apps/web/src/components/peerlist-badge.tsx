"use client";
import { useTheme } from "next-themes";
import { Link } from "./link";

export const PeerlistBadge = () => {
  const { theme, systemTheme } = useTheme();

  // TODO: make this a hook lol
  const sysTheme = systemTheme === "dark" ? "dark" : "light";
  const determineTheme = (theme === "system" ? sysTheme : theme) || "dark";

  return (
    <Link href="https://peerlist.io/hacksore/project/oghunt-20">
      <img
        src={`/peerlist-${determineTheme}.svg`}
        alt="Peerlist Launch Badge"
        className="mx-auto mb-8 w-42 h-auto"
      />
    </Link>
  );
};
