"use client";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeButton } from "./theme-button";
import { Button } from "./ui/button";

const themes = ["system", "light", "dark"] as const;

export function Header() {
  const { setTheme, theme } = useTheme();

  return (
    <header className="w-full">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.svg" alt="Oghunt Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-xl font-semibold">oghunt</span>
        </Link>
        <ThemeButton />
      </div>
    </header>
  );
}
