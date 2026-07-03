import { useState } from "react";
import { Check, Copy, Lock, Clock, Package } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CouponMedia } from "@/components/CouponMedia";
import type { Coupon } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function CouponDetailSheet({
  coupon,
  open,
  onOpenChange,
}: {
  coupon: Coupon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!coupon) return null;

  const copy = async () => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogTitle className="sr-only">Détail du coupon</DialogTitle>
        <DialogDescription className="sr-only">
          {coupon.text}
        </DialogDescription>

        <CouponMedia url={coupon.image_url} variant="detail" className="rounded-b-none rounded-t-2xl">
          {coupon.locked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 text-center backdrop-blur-[2px]">
              <div className="rounded-full border border-primary/50 bg-card p-3">
                <Lock className="h-5 w-5 text-primary" strokeWidth={2.4} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Réservé classe {coupon.min_class}
              </p>
            </div>
          )}
        </CouponMedia>

        <div className="space-y-4 p-4">
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

          <p className="text-sm leading-relaxed text-foreground">{coupon.text}</p>

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
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copié" : "Copier"}
              </span>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
