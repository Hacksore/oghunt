"use client";
import { cn } from "@/lib/utils";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const themes = ["system", "light", "dark"] as const;

export function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1">
        {themes.map((t) => (
          <div
            key={t}
            className="h-9 w-9 rounded-md dark:bg-neutral-300 bg-neutral-300 animate-[pulse_2s_ease-in-out_infinite]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1")}>
      {themes.map((t) => {
        const isActive = theme === t;
        return (
          <Button
            key={t}
            variant={isActive ? "outline" : "ghost"}
            onClick={() => setTheme(t)}
            className="h-9 w-9 p-0"
          >
            {t === "system" && <Laptop aria-hidden="true" className="size-4" />}
            {t === "light" && (
              <Sun
                aria-hidden="true"
                className={cn("size-4", isActive && "fill-black dark:fill-white")}
              />
            )}
            {t === "dark" && (
              <Moon
                aria-hidden="true"
                className={cn("size-4", isActive && "fill-black dark:fill-white")}
              />
            )}
          </Button>
        );
      })}
    </div>
  );
}
