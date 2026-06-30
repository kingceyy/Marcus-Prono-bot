import { useState, type FormEvent } from "react";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "club_jm_admin_unlocked";
const ADMIN_PASSWORD = "Marcus007";

export default function AdminPasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(
    () => typeof sessionStorage !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1",
  );
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setError(null);
    } else {
      setError("Mot de passe incorrect");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 py-10">
      <Link
        to="/"
        className="absolute left-4 top-4 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-2xl" />
        <div className="pulse-glow flex h-20 w-20 items-center justify-center rounded-full border border-primary/40 bg-primary-soft glow">
          <ShieldCheck className="h-9 w-9 text-primary" strokeWidth={2.4} />
        </div>
      </div>

      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Accès <span className="text-gradient">restreint</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Cette zone est réservée aux administrateurs.
        </p>
      </div>

      <form
        onSubmit={submit}
        className={`w-full max-w-xs space-y-3 ${shake ? "animate-[shake_.4s_ease]" : ""}`}
      >
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="password"
            autoFocus
            placeholder="Mot de passe"
            className="pl-9 text-center tracking-[0.3em]"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        {error && (
          <p className="scale-in text-center text-xs font-semibold text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full">
          Déverrouiller
        </Button>
      </form>

      <style>{`
        @keyframes shake {
          10%,90% { transform: translateX(-1px); }
          20%,80% { transform: translateX(2px); }
          30%,50%,70% { transform: translateX(-4px); }
          40%,60% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
