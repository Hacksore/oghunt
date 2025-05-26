"use client";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const themes = ["system", "light", "dark"] as const;

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="w-full">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.svg" alt="Oghunt Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-xl font-semibold">oghunt</span>
        </Link>
        <div className={cn("flex items-center rounded-full border p-0.5")}>
          {themes.map((t) => {
            const isActive = theme === t;
            return (
              <Button
                key={t}
                type="button"
                variant={isActive ? "default" : "ghost"}
                onClick={() => setTheme(t)}
              >
                {t === "system" && "system"}
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
      </div>
    </header>
  );
}
