import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-black bg-black text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950",
        secondary: "border-black bg-white text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
        outline: "border-black text-black dark:border-zinc-700 dark:text-zinc-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
