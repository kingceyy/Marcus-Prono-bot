import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import type { HistoryEntry } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageTitle } from "@/components/PageTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";

export default function History() {
  const [rows, setRows] = useState<HistoryEntry[] | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    void api.couponsHistory().then(setRows);
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return null;
    return rows.filter((r) => {
      const t = new Date(r.validated_at).getTime();
      if (from && t < new Date(from).getTime()) return false;
      if (to && t > new Date(to).getTime() + 86400000) return false;
      return true;
    });
  }, [rows, from, to]);

  return (
    <div>
      <PageTitle title="Historique" subtitle="Coupons validés par l'administration." />

      <Card className="mb-4 fade-up">
        <CardContent className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Du
            </label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Au
            </label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {!filtered ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun coupon dans cette période.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((h) => (
            <li key={h.id}>
              <Card className="fade-up">
                <CardContent className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <CheckCircle2 className="h-5 w-5" strokeWidth={2.4} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{h.coupon_text}</p>
                    <p className="text-xs text-muted-foreground">
                      Code <span className="font-mono">{h.code}</span> ·{" "}
                      {formatDate(h.validated_at, true)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
