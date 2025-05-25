import NextLink from "next/link";
import type { ComponentProps } from "react";
import { cn } from "../app/utils/tw";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<"a">, "href">;

export function Link({ href, children, className = "", ...props }: LinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("//");
  const baseStyles = "text-accent hover:text-hover-accent hover:underline";

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(baseStyles, className)}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={cn(baseStyles, className)} {...props}>
      {children}
    </NextLink>
  );
}
