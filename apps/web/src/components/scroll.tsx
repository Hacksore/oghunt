"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

// FIXME: figure out how to fix this moar better
// https://github.com/vercel/next.js/discussions/64435
export default function Scroll() {
  const searchParams = useSearchParams();
  useEffect(() => {
    console.log(
      "Scrolling to top because of https://github.com/vercel/next.js/discussions/64435",
      searchParams.toString(),
    );
    window.scroll(0, 0);
  }, [searchParams]);
  return <></>;
}
