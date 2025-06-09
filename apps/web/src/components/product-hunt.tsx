"use client";

import { useTheme } from "next-themes";

export const ProductHunt = () => {
  const { theme, systemTheme } = useTheme();

  // TODO: make this a hook lol
  const sysTheme = systemTheme === "dark" ? "dark" : "light";
  const determinedTheme = (theme === "system" ? sysTheme : theme) || "dark";

  return (
    <a
      href="https://www.producthunt.com/products/oghunt?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-oghunt&#0045;3"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=966874&theme=${determinedTheme}&t=1749312733388`}
        alt="oghunt - Product&#0032;Hunt&#0032;with&#0032;ZERO&#0032;AI&#0032;Slop&#0032;Powered&#0032;By&#0032;AI | Product Hunt"
        style={{ width: 250, height: 54 }}
        width="250"
        height="54"
      />
    </a>
  );
};
