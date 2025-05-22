import NextLink from "next/link";
import type { ComponentProps } from "react";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<"a">, "href">;

export function Link({ href, children, className = "", ...props }: LinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("//");
  const baseStyles = "text-accent hover:underline";
  const combinedClassName = `${baseStyles} ${className}`.trim();

  if (isExternal) {
    return (
      <a
        href={href}
        className={combinedClassName}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={combinedClassName} {...props}>
      {children}
    </NextLink>
  );
}
