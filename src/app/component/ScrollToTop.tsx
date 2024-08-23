"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "./icons/ChevronUp.tsx";

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
      className={`fixed bottom-6 right-6 z-50 flex h-10 w-10 border border-[#434343]/75 rounded-lg cursor-pointer items-center justify-center hover:bg-stone-300/20 transition-opacity duration-500 rounded-full shadow-lg transition-all hover:bg-primary/90 ${showScrollToTop ? "opacity-100" : "opacity-0"}`}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-5 w-5 opacity-80" />
    </button>
  );
}
