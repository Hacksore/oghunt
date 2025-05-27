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
            className="size-8 rounded-full dark:bg-neutral-300 bg-neutral-300 animate-[pulse_2s_ease-in-out_infinite]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-full border bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700")}>
      {themes.map((t) => {
        const isActive = theme === t;
        return (
          <Button
            key={t}
            variant={isActive ? "outline" : "ghost"}
            onClick={() => setTheme(t)}
            className={`size-6 p-0 rounded-full !border-none ${isActive ? "bg-accent text-white" : "hover:bg-neutral-200 dark:hover:bg-neutral-800"}`}
          >
            {t === "system" && <Laptop aria-hidden="true" className="size-4" />}
            {t === "light" && (
              <Sun
                aria-hidden="true"
                className={cn("size-4", isActive && "dark:fill-white")}
              />
            )}
            {t === "dark" && (
              <Moon
                aria-hidden="true"
                className={cn("size-4", isActive && "dark:fill-white")}
              />
            )}
          </Button>
        );
      })}
    </div>
  );
}
