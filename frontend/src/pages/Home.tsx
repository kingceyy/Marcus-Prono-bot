import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, History, Sparkles, Ticket, Trophy, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ClassBadge, VipBadge } from "@/components/ClassBadge";
import { nextClass, CLASS_THRESHOLDS } from "@/lib/types";

export default function Home() {
  const { profile } = useAuth();
  const [available, setAvailable] = useState<number | null>(null);

  useEffect(() => {
    void api.coupons().then((cs) => setAvailable(cs.filter((c) => !c.locked).length));
  }, []);

  if (!profile) return null;

  const next = nextClass(profile.user_class);
  const target = profile.next_threshold ?? (next ? CLASS_THRESHOLDS[next] : profile.active_invites);
  const progress = next ? Math.min(100, (profile.active_invites / target) * 100) : 100;
  const remaining = next ? Math.max(0, target - profile.active_invites) : 0;

  return (
    <div className="space-y-5 stagger">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 p-5 card-elev"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, oklch(0.74 0.19 145 / .25), transparent 60%), radial-gradient(120% 80% at 100% 100%, oklch(0.62 0.18 145 / .25), transparent 60%), linear-gradient(180deg, #0e1410, #0a0c0a)",
        }}
      >
        <div aria-hidden className="float pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-3 w-3" /> Club JM
            </p>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Salut
              </p>
              <h1 className="text-2xl font-black tracking-tight">
                {profile.first_name}{" "}
                <span className="text-gradient">·</span>
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ClassBadge userClass={profile.user_class} />
              {profile.is_vip && <VipBadge />}
            </div>
          </div>
          {profile.photo_url && (
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/40 blur-lg" />
              <img
                src={profile.photo_url}
                alt=""
                className="h-16 w-16 rounded-2xl border border-primary/40 object-cover ring-glow"
              />
            </div>
          )}
        </div>
      </section>

      {/* PROGRESSION */}
      <Card>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Invitations actives
              </p>
              <p className="mt-1 text-3xl font-black">
                <span className="text-gradient">{profile.active_invites}</span>
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  / {profile.total_invites} totales
                </span>
              </p>
            </div>
            {next && (
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Palier
                </p>
                <p className="mt-1 text-sm font-bold">
                  {remaining > 0 ? `+${remaining}` : "OK"}{" "}
                  <span className="text-muted-foreground">pour</span> {next}
                </p>
              </div>
            )}
          </div>
          <Progress value={profile.active_invites} max={target} />
          {next && (
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>{profile.user_class}</span>
              <span>{Math.round(progress)}%</span>
              <span>{next}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* COUPONS DISPO */}
      <Card className="overflow-hidden">
        <CardContent className="flex items-center gap-4">
          <div className="pulse-glow flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary ring-glow">
            <Gift className="h-6 w-6" strokeWidth={2.4} />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Coupons disponibles
            </p>
            {available === null ? (
              <Skeleton className="mt-1 h-7 w-16" />
            ) : (
              <p className="text-2xl font-black text-gradient pop">{available}</p>
            )}
          </div>
          <Link
            to="/coupons"
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:scale-105 ring-glow"
            aria-label="Voir les coupons"
          >
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
          </Link>
        </CardContent>
      </Card>

      {/* SHORTCUTS */}
      <section className="grid grid-cols-2 gap-3">
        <Shortcut to="/coupons" icon={Ticket} label="Coupons" />
        <Shortcut to="/referral" icon={Users} label="Parrainage" />
        <Shortcut to="/leaderboard" icon={Trophy} label="Classement" />
        <Shortcut to="/history" icon={History} label="Historique" />
      </section>
    </div>
  );
}

function Shortcut({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_18px_40px_-22px_oklch(0.74_0.19_145/0.6)] active:scale-[0.98]"
    >
      <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(60% 80% at 0% 50%, oklch(0.74 0.19 145 / .14), transparent 70%)" }}
      />
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary transition group-hover:scale-110 group-hover:bg-primary-soft">
        <Icon className="h-5 w-5" strokeWidth={2.4} />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}
