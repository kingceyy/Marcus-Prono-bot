import { Link } from "react-router-dom";
import { CircleUser, LifeBuoy, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { ClassBadge, VipBadge } from "@/components/ClassBadge";
import { PageTitle } from "@/components/PageTitle";
import { formatDate } from "@/lib/format";

export default function Profile() {
  const { profile } = useAuth();
  if (!profile) return null;

  return (
    <div className="space-y-4">
      <PageTitle title="Profil" />

      <Card className="fade-up">
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
              {profile.photo_url ? (
                <img src={profile.photo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <CircleUser className="h-7 w-7 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold">{profile.first_name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {profile.username ? `@${profile.username}` : `ID ${profile.telegram_id}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ClassBadge userClass={profile.user_class} />
            {profile.is_vip && <VipBadge />}
          </div>
          <div className="rounded-xl border border-border bg-muted p-3 text-xs text-muted-foreground">
            Membre depuis le {formatDate(profile.joined_at)}
          </div>
        </CardContent>
      </Card>

      <Card className="fade-up">
        <CardContent className="space-y-0 divide-y divide-border p-0">
          <a
            href="https://t.me/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3.5 transition active:bg-muted"
          >
            <LifeBuoy className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Support & contact</span>
          </a>
          {profile.is_admin && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3.5 transition active:bg-muted"
            >
              <Settings className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Panel admin</span>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
