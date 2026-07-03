import { useState } from "react";
import { Check, Copy, Lock, Clock, Package } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CouponMedia } from "@/components/CouponMedia";
import type { Coupon } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CouponCard({
  coupon,
  onOpenDetail,
}: {
  coupon: Coupon;
  onOpenDetail?: (coupon: Coupon) => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success("Code copié");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  return (
    <Card
      onClick={() => onOpenDetail?.(coupon)}
      className={cn(
        "group overflow-hidden transition-all duration-300",
        onOpenDetail && "cursor-pointer",
        coupon.locked
          ? "opacity-95"
          : "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_50px_-22px_oklch(0.74_0.19_145/0.6)]",
      )}
    >
      <CouponMedia
        url={coupon.image_url}
        variant="thumbnail"
        className={cn(
          "transition-all duration-700",
          coupon.locked ? "blur-md scale-110" : "group-hover:scale-105",
        )}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, rgba(5,6,5,0.85) 100%)",
          }}
        />
        {!coupon.locked && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-y-4 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[420%] group-hover:opacity-100" />
          </div>
        )}
        {coupon.locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 text-center backdrop-blur-[2px]">
            <div className="pulse-glow rounded-full border border-primary/50 bg-card p-3 ring-glow">
              <Lock className="h-5 w-5 text-primary" strokeWidth={2.4} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Réservé classe {coupon.min_class}
            </p>
          </div>
        )}
      </CouponMedia>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="primary">{coupon.min_class}</Badge>
          {coupon.expires_at && (
            <Badge variant="muted">
              <Clock className="h-3 w-3" />
              Jusqu'au {formatDate(coupon.expires_at)}
            </Badge>
          )}
          {coupon.quantity_left !== null && (
            <Badge variant="muted">
              <Package className="h-3 w-3" />
              {coupon.quantity_left} restants
            </Badge>
          )}
        </div>
        <p className="text-sm text-foreground leading-snug">{coupon.text}</p>
        {!coupon.locked && (
          <button
            type="button"
            onClick={copy}
            className="group/btn relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-dashed border-primary/40 bg-primary-soft px-3 py-2.5 text-left transition active:scale-[0.98] hover:border-primary"
          >
            <span className="font-mono text-sm font-bold tracking-wider text-foreground">
              {coupon.code}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-foreground">
              {copied ? <Check className="h-4 w-4 pop" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copié" : "Copier"}
            </span>
          </button>
        )}
      </div>
    </Card>
  );
}
