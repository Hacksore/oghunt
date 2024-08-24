"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "./icons/ChevronUp";

export default function ScrollToTop() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 1500) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`fixed bottom-6 right-6 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full rounded-lg border border-[#434343]/75 shadow-lg transition-opacity duration-500 hover:bg-stone-300/10 ${showScrollToTop ? "opacity-100" : "opacity-0"}`}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-5 w-5 opacity-80" />
    </button>
  );
}
