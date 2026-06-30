import { useEffect, useState } from "react";
import { ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { VipInfo } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTitle } from "@/components/PageTitle";
import { VipBadge } from "@/components/ClassBadge";
import { openTelegramLink } from "@/lib/telegram";

const BENEFITS = [
  "Canal VIP privé à vie",
  "Coupons exclusifs Master en avant-première",
  "Drops confidentiels réservés VIP",
  "Support prioritaire",
];

export default function Vip() {
  const [info, setInfo] = useState<VipInfo | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    void api.vip().then(setInfo);
  }, []);

  const buy = async () => {
    setBuying(true);
    try {
      const { redirect_url } = await api.vipPurchase();
      openTelegramLink(redirect_url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageTitle title="Accès VIP" subtitle="Paiement unique, accès à vie." />

      {!info ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <Card className="fade-up">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground glow">
                  <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold">Canal VIP CLUB JM</p>
                  <p className="text-xs text-muted-foreground">
                    Statut : {info.is_vip ? "VIP actif" : "Non VIP"}
                  </p>
                </div>
              </div>
              {info.is_vip && <VipBadge />}
            </div>

            <div className="rounded-xl border border-border bg-muted p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Prix
              </p>
              <p className="mt-1 text-2xl font-extrabold">{info.price_label}</p>
            </div>

            <ul className="space-y-2">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.4} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {info.is_vip && info.channel_url ? (
              <Button
                size="lg"
                className="w-full"
                onClick={() => openTelegramLink(info.channel_url!)}
              >
                <ExternalLink className="h-4 w-4" />
                Accéder au canal VIP
              </Button>
            ) : (
              <Button size="lg" className="w-full" onClick={buy} disabled={buying}>
                {buying ? "Redirection…" : "Devenir VIP à vie"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
