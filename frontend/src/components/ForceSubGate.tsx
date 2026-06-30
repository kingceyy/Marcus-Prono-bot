import { useCallback, useEffect, useState } from "react";
import { LockKeyhole, ExternalLink, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { openTelegramLink } from "@/lib/telegram";

const CHANNEL_URL = import.meta.env.VITE_CHANNEL_URL ?? "https://t.me/";
const CHANNEL_NAME = import.meta.env.VITE_CHANNEL_NAME ?? "CLUB JM";

export default function ForceSubGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"checking" | "ok" | "blocked">("checking");
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    setState("checking");
    setError(null);
    try {
      const { is_member } = await api.forcesubCheck();
      setState(is_member ? "ok" : "blocked");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setState("blocked");
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  if (state === "checking") {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Vérification de l'accès…
        </div>
      </div>
    );
  }

  if (state === "blocked") {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-5 bg-background px-6 text-center">
        <div className="rounded-full border border-primary/40 bg-primary-soft p-4 glow">
          <LockKeyhole className="h-7 w-7 text-primary" strokeWidth={2.4} />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold">Accès réservé aux membres</h1>
          <p className="text-sm text-muted-foreground">
            Pour utiliser CLUB&nbsp;JM, tu dois d'abord rejoindre notre canal officiel
            {CHANNEL_NAME ? ` : ${CHANNEL_NAME}` : ""}.
          </p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button
            size="lg"
            onClick={() => openTelegramLink(CHANNEL_URL)}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4" />
            Rejoindre le canal
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => void check()}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4" />
            J'ai rejoint, vérifier
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
