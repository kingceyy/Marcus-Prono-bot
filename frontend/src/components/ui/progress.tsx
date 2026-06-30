import { cn } from "@/lib/utils";

export function Progress({
  value,
  max = 100,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500"
        style={{
          width: `${pct}%`,
          boxShadow: "0 0 12px oklch(0.72 0.18 145 / 0.5)",
        }}
      />
    </div>
  );
}
