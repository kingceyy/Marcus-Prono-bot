import { Link } from "react-router-dom";
import { CircleUser } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import ThemeToggle from "@/components/ThemeToggle";

export default function TopBar() {
  const { profile } = useAuth();
  const { theme } = useTheme();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 px-4 py-3 backdrop-blur-xl"
      style={{
        background:
          theme === "light"
            ? "linear-gradient(180deg, rgba(250,246,236,.9), rgba(250,246,236,.6))"
            : "linear-gradient(180deg, rgba(5,6,5,.85), rgba(5,6,5,.55))",
      }}
    >
      <Link to="/" className="group flex items-center gap-2.5">
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-xl bg-primary/40 blur-md transition-opacity group-hover:opacity-80" />
          <div className="gradient-flow flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground font-black ring-glow"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.82 0.22 145), oklch(0.62 0.18 145) 60%, oklch(0.78 0.2 145))",
            }}
          >
            J
          </div>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-medium tracking-[0.32em] text-muted-foreground">
            CLUB
          </span>
          <span className="text-sm font-black tracking-[0.18em] text-gradient">
            JM
          </span>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          to="/profile"
          aria-label="Profil"
          className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-card transition hover:border-primary/60 hover:ring-glow"
        >
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt="" className="h-full w-full object-cover transition group-hover:scale-110" />
          ) : (
            <CircleUser className="h-5 w-5 text-muted-foreground" />
          )}
          {profile?.is_vip && (
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
          )}
        </Link>
      </div>
    </header>
  );
}
