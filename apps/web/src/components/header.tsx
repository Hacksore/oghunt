"use client";
import Image from "next/image";
import Link from "next/link";
import { ThemeButton } from "./theme-button";

export function Header() {
  return (
    <header className="w-full">
      <div className="max-w-4xl container mx-auto px-4 py-4 flex justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.svg" alt="Oghunt Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-xl font-semibold">oghunt</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/homies" className="opacity-50 hover:opacity-100 duration-300 group mr-2 max-sm:hidden"><span className="group-hover:opacity-100 opacity-0 duration-300">/</span>homies</Link>
          <ThemeButton />
          <Link href="https://github.com/Hacksore/oghunt" className="flex items-center gap-2 p-2 rounded-full hover:bg-neutral-500/20 dark:hover:bg-neutral-500/15 duration-300 group opacity-50 hover:opacity-100 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700">
            <svg className="size-5 fill-current group-hover:rotate-360 group-hover:scale-125 duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-active:duration-75 group-active:scale-95" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
