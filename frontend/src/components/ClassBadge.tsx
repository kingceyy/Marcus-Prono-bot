import { Crown, Flame, Rocket, Sparkles, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserClass } from "@/lib/types";

const CONFIG: Record<UserClass, { icon: LucideIcon; ring: string; text: string; tone: string }> = {
  Starter: {
    icon: Sparkles,
    ring: "from-neutral-600/40 to-neutral-800/60",
    text: "text-neutral-200",
    tone: "border-neutral-700",
  },
  Loki: {
    icon: Rocket,
    ring: "from-emerald-500/30 to-emerald-900/40",
    text: "text-emerald-200",
    tone: "border-emerald-900/60",
  },
  Blaise: {
    icon: Flame,
    ring: "from-emerald-400/40 to-emerald-700/60",
    text: "text-emerald-100",
    tone: "border-emerald-700/70",
  },
  Master: {
    icon: Crown,
    ring: "from-emerald-300/60 to-emerald-600/80",
    text: "text-emerald-50",
    tone: "border-emerald-500",
  },
};

export function ClassBadge({
  userClass,
  size = "md",
  className,
}: {
  userClass: UserClass;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const c = CONFIG[userClass];
  const Icon = c.icon;
  const sizes = {
    sm: "h-7 px-2.5 text-[10px] gap-1",
    md: "h-9 px-3 text-xs gap-1.5",
    lg: "h-11 px-4 text-sm gap-2",
  } as const;
  return (
    <span
      className={cn(
        "group/badge inline-flex items-center rounded-full border bg-gradient-to-br font-bold uppercase tracking-wider transition hover:brightness-110",
        sizes[size],
        c.tone,
        c.ring,
        c.text,
        userClass === "Master" && "ring-glow",
        className,
      )}
    >
      <Icon
        className={cn(
          size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
          "transition group-hover/badge:rotate-12",
        )}
        strokeWidth={2.5}
      />
      {userClass}
    </span>
  );
}

export function VipBadge({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-7 px-2.5 text-[10px] gap-1",
    md: "h-9 px-3 text-xs gap-1.5",
    lg: "h-11 px-4 text-sm gap-2",
  } as const;
  return (
    <span
      className={cn(
        "relative inline-flex items-center rounded-full border border-primary/60 bg-primary text-primary-foreground font-bold uppercase tracking-wider ring-glow",
        sizes[size],
        className,
      )}
    >
      <span className="absolute inset-0 rounded-full bg-primary/40 blur-md -z-10" />
      <ShieldCheck className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={2.6} />
      VIP
    </span>
  );
}
