import { useEffect, useState } from "react";
import { Medal } from "lucide-react";
import { api } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { ClassBadge, VipBadge } from "@/components/ClassBadge";
import { PageTitle } from "@/components/PageTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Leaderboard() {
  const [rows, setRows] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    void api.leaderboard().then(setRows);
  }, []);

  return (
    <div>
      <PageTitle title="Classement" subtitle="Les meilleurs parraineurs de la communauté." />

      {!rows ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 items-end gap-2 fade-up">
            {[rows[1], rows[0], rows[2]].filter(Boolean).map((r, i) => {
              const heights = ["h-20", "h-28", "h-16"];
              const ranks = [2, 1, 3];
              const rank = ranks[i];
              return (
                <div key={r.rank} className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border",
                      rank === 1
                        ? "border-primary bg-primary text-primary-foreground glow"
                        : "border-border bg-card text-foreground",
                    )}
                  >
                    <Medal className="h-5 w-5" strokeWidth={2.4} />
                  </div>
                  <p className="text-sm font-bold truncate max-w-full">{r.display_name}</p>
                  <p className="text-xs text-muted-foreground">{r.active_invites}</p>
                  <div
                    className={cn(
                      "w-full rounded-t-xl border border-b-0 border-border bg-card",
                      heights[i],
                    )}
                  />
                </div>
              );
            })}
          </div>

          <Card className="fade-up">
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {rows.map((r) => (
                  <li
                    key={r.rank}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span className="w-6 text-sm font-extrabold text-muted-foreground">
                      {r.rank}
                    </span>
                    <span className="flex-1 truncate text-sm font-semibold">
                      {r.display_name}
                    </span>
                    <ClassBadge userClass={r.user_class} size="sm" />
                    {r.is_vip && <VipBadge size="sm" />}
                    <span className="w-10 text-right text-sm font-bold text-primary">
                      {r.active_invites}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
