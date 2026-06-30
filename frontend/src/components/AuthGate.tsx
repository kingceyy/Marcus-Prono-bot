import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { status, error, retryAuth } = useAuth();

  if (status === "loading" || status === "idle") {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 bg-background p-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <div className="rounded-full border border-destructive/40 bg-destructive/10 p-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="text-lg font-bold">Connexion impossible</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => void retryAuth()}>Réessayer</Button>
      </div>
    );
  }

  return <>{children}</>;
}
