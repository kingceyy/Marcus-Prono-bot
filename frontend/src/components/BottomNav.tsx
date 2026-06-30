import { NavLink } from "react-router-dom";
import { Home, Ticket, Users, Trophy, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Accueil", icon: Home, end: true },
  { to: "/coupons", label: "Coupons", icon: Ticket },
  { to: "/referral", label: "Invite", icon: Users },
  { to: "/leaderboard", label: "Top", icon: Trophy },
  { to: "/vip", label: "VIP", icon: ShieldCheck },
] as const;

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2"
    >
      <div className="glass relative grid grid-cols-5 rounded-2xl px-2 py-1.5 card-elev">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : false}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-col items-center gap-1 rounded-xl px-1.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      aria-hidden
                      className="pop absolute inset-x-3 top-0 h-[2px] rounded-full bg-primary shadow-[0_0_10px_oklch(0.74_0.19_145/0.8)]"
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-5 w-5 transition",
                      isActive &&
                        "scale-110 drop-shadow-[0_0_10px_oklch(0.74_0.19_145/0.8)]",
                    )}
                    strokeWidth={isActive ? 2.6 : 2}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
