import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline" | "primary" | "muted";
}) {
  const variants = {
    default: "bg-muted text-foreground border-border",
    outline: "border-border text-foreground",
    primary: "bg-primary-soft text-accent-foreground border-transparent",
    muted: "bg-muted text-muted-foreground border-border",
  } as const;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
