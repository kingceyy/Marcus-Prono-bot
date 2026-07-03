import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { AdminStats, AdminUserRow, Coupon, UserClass } from "@/lib/types";
import { CLASS_ORDER } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label, Select } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ClassBadge, VipBadge } from "@/components/ClassBadge";

export default function Admin() {
  const [tab, setTab] = useState<"create" | "coupons" | "users" | "stats">("create");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <h1 className="text-lg font-extrabold tracking-tight">Panel admin</h1>
        <span className="w-12" />
      </div>

      <div className="grid grid-cols-4 gap-1 rounded-xl border border-border bg-card p-1 text-xs font-bold uppercase tracking-wider">
        {(
          [
            ["create", "Créer"],
            ["coupons", "Coupons"],
            ["users", "Users"],
            ["stats", "Stats"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={
              tab === k
                ? "rounded-lg bg-primary px-2 py-2 text-primary-foreground"
                : "rounded-lg px-2 py-2 text-muted-foreground"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "create" && <CreateCoupon />}
      {tab === "coupons" && <ManageCoupons />}
      {tab === "users" && <ManageUsers />}
      {tab === "stats" && <Stats />}
    </div>
  );
}

function CreateCoupon() {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [code, setCode] = useState("");
  const [minClass, setMinClass] = useState<UserClass>("Starter");
  const [expires, setExpires] = useState("");
  const [qty, setQty] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.adminCreateCoupon({
        text,
        image_url: image,
        code,
        min_class: minClass,
        expires_at: expires ? new Date(expires).toISOString() : null,
        quantity: qty ? Number(qty) : null,
      });
      toast.success("Coupon créé");
      setText("");
      setImage("");
      setCode("");
      setExpires("");
      setQty("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="fade-up">
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Texte</Label>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Image (URL)</Label>
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Classe min.</Label>
              <Select
                value={minClass}
                onChange={(e) => setMinClass(e.target.value as UserClass)}
              >
                {CLASS_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Expiration</Label>
              <Input
                type="datetime-local"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Quantité</Label>
              <Input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            <Plus className="h-4 w-4" />
            {busy ? "Création…" : "Créer le coupon"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ManageCoupons() {
  const [rows, setRows] = useState<Coupon[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const load = () => void api.coupons().then(setRows);
  useEffect(load, []);

  const toggleValidate = async (c: Coupon) => {
    setBusyId(c.id);
    try {
      if (c.is_validated) {
        await api.adminUnvalidateCoupon(c.id);
        toast.success("Validation retirée");
      } else {
        await api.adminValidateCoupon(c.id);
        toast.success("Coupon validé");
      }
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (c: Coupon) => {
    if (!window.confirm(`Supprimer définitivement le coupon "${c.code}" ?`)) return;
    setBusyId(c.id);
    try {
      await api.adminDeleteCoupon(c.id);
      toast.success("Coupon supprimé");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  };

  if (!rows) return <Skeleton className="h-40 w-full rounded-2xl" />;
  if (rows.length === 0)
    return <p className="text-sm text-muted-foreground">Aucun coupon actif.</p>;

  return (
    <ul className="space-y-2">
      {rows.map((c) => (
        <li key={c.id}>
          <Card className="fade-up">
            <CardContent className="flex items-start gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                <img
                  src={c.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {c.is_validated && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/40">
                    <span className="-rotate-12 select-none rounded border border-primary px-1 text-[9px] font-extrabold uppercase tracking-wider text-primary">
                      Validé
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold">{c.text}</p>
                  {c.is_validated && (
                    <Badge variant="primary">
                      <CheckCircle2 className="h-3 w-3" />
                      Validé
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-mono">{c.code}</span> · min {c.min_class}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <Button
                  size="sm"
                  variant={c.is_validated ? "secondary" : "primary"}
                  disabled={busyId === c.id}
                  onClick={() => toggleValidate(c)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {c.is_validated ? "Dévalider" : "Valider"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busyId === c.id}
                  onClick={() => remove(c)}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function ManageUsers() {
  const [rows, setRows] = useState<AdminUserRow[] | null>(null);
  const load = () => void api.adminUsers().then(setRows);
  useEffect(load, []);

  const update = async (id: number, patch: { user_class?: UserClass; is_vip?: boolean }) => {
    try {
      await api.adminUpdateUser(id, patch);
      toast.success("Utilisateur mis à jour");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  };

  if (!rows) return <Skeleton className="h-40 w-full rounded-2xl" />;

  return (
    <ul className="space-y-2">
      {rows.map((u) => (
        <li key={u.telegram_id}>
          <Card className="fade-up">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{u.display_name}</p>
                  <p className="text-xs text-muted-foreground">
                    ID {u.telegram_id} · {u.active_invites} actifs
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-1">
                  <ClassBadge userClass={u.user_class} size="sm" />
                  {u.is_vip && <VipBadge size="sm" />}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={u.user_class}
                  onChange={(e) =>
                    update(u.telegram_id, { user_class: e.target.value as UserClass })
                  }
                >
                  {CLASS_ORDER.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
                <Button
                  size="sm"
                  variant={u.is_vip ? "secondary" : "primary"}
                  onClick={() => update(u.telegram_id, { is_vip: !u.is_vip })}
                >
                  {u.is_vip ? "Retirer VIP" : "Donner VIP"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function Stats() {
  const [s, setS] = useState<AdminStats | null>(null);
  useEffect(() => {
    void api.adminStats().then(setS);
  }, []);

  if (!s) return <Skeleton className="h-40 w-full rounded-2xl" />;

  return (
    <div className="space-y-3">
      <Card className="fade-up">
        <CardContent className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Users className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Utilisateurs
            </p>
            <p className="text-2xl font-extrabold">{s.total_users}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="fade-up">
        <CardContent className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Répartition par classe
          </p>
          {CLASS_ORDER.map((c) => (
            <div key={c} className="flex items-center justify-between text-sm">
              <ClassBadge userClass={c} size="sm" />
              <span className="font-bold">{s.per_class[c]}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="fade-up">
        <CardContent>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Conversion VIP
          </p>
          <p className="text-2xl font-extrabold">
            {(s.vip_conversion * 100).toFixed(1)}%
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              ({s.vip_users} VIP)
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
