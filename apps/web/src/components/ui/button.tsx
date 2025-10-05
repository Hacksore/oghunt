import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type React from "react";

import { cn } from "@/app/utils/tw";

const buttonVariants = cva(
  "inline-flex cursor-pointer text-black dark:text-white items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:underline",
  {
    variants: {
      variant: {
        default: "bg-accent text-white",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-accent shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "dark:text-white text-black hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  fullWidth?: boolean;
  className?: string;
} & (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "ref">)
    | ({ href?: never } & Omit<React.ComponentProps<"button">, "ref">)
  );

function Button({
  className,
  variant,
  size,
  fullWidth = false,
  asChild = false,
  href,
  ...props
}: ButtonProps) {
  if (href) {
    const { href: _, ...rest } = props as React.ComponentProps<typeof Link>;
    return (
      <Link
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }), fullWidth && "w-full")}
        href={href}
        {...rest}
      />
    );
  }

  const Comp = asChild ? Slot : "button";
  const { ...rest } = props as React.ComponentProps<"button">;
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), fullWidth && "w-full")}
      {...rest}
    />
  );
}

export { Button, buttonVariants };
