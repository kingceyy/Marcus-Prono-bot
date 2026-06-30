import { useEffect, useState } from "react";
import { Copy, Check, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { Referee } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTitle } from "@/components/PageTitle";
import { nextClass, CLASS_THRESHOLDS } from "@/lib/types";
import { timeAgo } from "@/lib/format";

const BOT = import.meta.env.VITE_BOT_USERNAME ?? "club_jm_bot";

export default function Referral() {
  const { profile } = useAuth();
  const [refs, setRefs] = useState<Referee[] | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void api.referees().then(setRefs);
  }, []);

  if (!profile) return null;
  const link = `https://t.me/${BOT}?start=ref_${profile.referral_code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Lien copié");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const share = async () => {
    const data = {
      title: "Rejoins CLUB JM",
      text: "Rejoins CLUB JM avec mon lien :",
      url: link,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await copy();
    } catch {
      /* user cancelled */
    }
  };

  const next = nextClass(profile.user_class);
  const target = profile.next_threshold ?? (next ? CLASS_THRESHOLDS[next] : profile.active_invites);

  return (
    <div className="space-y-4">
      <PageTitle title="Parrainage" subtitle="Plus tu invites, plus tu débloques de récompenses." />

      <Card className="fade-up">
        <CardContent className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Ton lien unique
          </p>
          <div className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-primary/40 bg-primary-soft px-3 py-2.5">
            <span className="truncate font-mono text-xs text-foreground">{link}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copié" : "Copier"}
            </Button>
            <Button onClick={share}>
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="fade-up">
        <CardContent className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Progression
              </p>
              <p className="mt-1 text-2xl font-extrabold">
                {profile.active_invites}
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  / {target} {next ? `pour ${next}` : ""}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {profile.total_invites} invitations au total
              </p>
            </div>
          </div>
          <Progress value={profile.active_invites} max={target} />
        </CardContent>
      </Card>

      <Card className="fade-up">
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Tes filleuls</h2>
          </div>
          {!refs ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : refs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun filleul pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {refs.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-semibold">{r.display_name}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(r.joined_at)}</p>
                  </div>
                  <span
                    className={
                      r.active
                        ? "rounded-full border border-primary/40 bg-primary-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground"
                        : "rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    }
                  >
                    {r.active ? "Actif" : "Inactif"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
