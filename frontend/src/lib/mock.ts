import type {
  AdminStats,
  AdminUserRow,
  Coupon,
  HistoryEntry,
  LeaderboardEntry,
  Profile,
  Referee,
  UserClass,
  VipInfo,
} from "./types";
import { classRank } from "./types";

let profile: Profile = {
  telegram_id: 4242,
  first_name: "Aperçu",
  username: "preview_user",
  photo_url: "https://api.dicebear.com/9.x/initials/svg?seed=JM&backgroundColor=10b981&fontSize=44",
  user_class: "Loki",
  is_vip: false,
  referral_code: "JMPREVIEW",
  active_invites: 34,
  total_invites: 41,
  next_threshold: 50,
  joined_at: "2025-09-12T10:24:00Z",
  is_admin: true,
};

let coupons: Coupon[] = [
  {
    id: "c1",
    image_url:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=70",
    text: "Code promo -25% sur la boutique partenaire, valable cette semaine uniquement.",
    code: "JM-WEEK-25",
    min_class: "Starter",
    expires_at: "2026-07-05T22:00:00Z",
    quantity_left: 120,
    locked: false,
    created_at: "2026-06-24T10:00:00Z",
  },
  {
    id: "c2",
    image_url:
      "https://images.unsplash.com/photo-1556742400-b5b7c5121f9c?auto=format&fit=crop&w=800&q=70",
    text: "Bonus exclusif Loki — accès anticipé à la prochaine campagne.",
    code: "LOKI-EARLY",
    min_class: "Loki",
    expires_at: null,
    quantity_left: null,
    locked: false,
    created_at: "2026-06-23T10:00:00Z",
  },
  {
    id: "c3",
    image_url:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=70",
    text: "Pack Blaise — récompense limitée pour les meilleurs parraineurs.",
    code: "BLAISE-PACK",
    min_class: "Blaise",
    expires_at: "2026-07-10T22:00:00Z",
    quantity_left: 35,
    locked: true,
    created_at: "2026-06-22T10:00:00Z",
  },
  {
    id: "c4",
    image_url:
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=800&q=70",
    text: "Récompense Master — drop confidentiel réservé aux Masters actifs.",
    code: "MASTER-DROP",
    min_class: "Master",
    expires_at: null,
    quantity_left: 10,
    locked: true,
    created_at: "2026-06-21T10:00:00Z",
  },
];

const history: HistoryEntry[] = [
  {
    id: "h1",
    coupon_id: "c0",
    coupon_text: "Promo lancement -15%",
    code: "LAUNCH15",
    validated_at: "2026-06-15T18:30:00Z",
  },
  {
    id: "h2",
    coupon_id: "c0b",
    coupon_text: "Bonus parrainage x2 week-end",
    code: "WE-X2",
    validated_at: "2026-06-08T11:12:00Z",
  },
  {
    id: "h3",
    coupon_id: "c0c",
    coupon_text: "Accès vidéo formation #3",
    code: "VID-03",
    validated_at: "2026-05-30T09:00:00Z",
  },
];

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, display_name: "Naël", active_invites: 142, user_class: "Master", is_vip: true },
  { rank: 2, display_name: "Sami", active_invites: 118, user_class: "Master", is_vip: true },
  { rank: 3, display_name: "Inès", active_invites: 96, user_class: "Master", is_vip: false },
  { rank: 4, display_name: "Yanis", active_invites: 74, user_class: "Blaise", is_vip: true },
  { rank: 5, display_name: "Lina", active_invites: 61, user_class: "Blaise", is_vip: false },
  { rank: 6, display_name: "Karim", active_invites: 52, user_class: "Blaise", is_vip: false },
  { rank: 7, display_name: "Aperçu", active_invites: 34, user_class: "Loki", is_vip: false },
  { rank: 8, display_name: "Théo", active_invites: 28, user_class: "Loki", is_vip: false },
];

const referees: Referee[] = [
  { id: 1, display_name: "Sofiane", joined_at: "2026-06-20T15:00:00Z", active: true },
  { id: 2, display_name: "Amine", joined_at: "2026-06-18T12:00:00Z", active: true },
  { id: 3, display_name: "Lou", joined_at: "2026-06-12T09:30:00Z", active: false },
  { id: 4, display_name: "Mehdi", joined_at: "2026-06-02T20:15:00Z", active: true },
];

let adminUsers: AdminUserRow[] = leaderboard.map((l) => ({
  telegram_id: 1000 + l.rank,
  display_name: l.display_name,
  user_class: l.user_class,
  is_vip: l.is_vip,
  active_invites: l.active_invites,
}));

let forceSubOk = true;

function applyLock(c: Coupon, userClass: UserClass): Coupon {
  return { ...c, locked: classRank(userClass) < classRank(c.min_class) };
}

export const MOCK_DB = {
  profile: () => ({ ...profile }),
  coupons: () => coupons.map((c) => applyLock(c, profile.user_class)),
  history: () => [...history],
  leaderboard: () => [...leaderboard],
  referees: () => [...referees],
  vip: (): VipInfo => ({
    is_vip: profile.is_vip,
    price_label: "49 € (accès à vie)",
    channel_url: profile.is_vip ? "https://t.me/+vip_canal_demo" : null,
  }),
  forceSubState: () => forceSubOk,
  setForceSub: (v: boolean) => {
    forceSubOk = v;
  },

  adminCreateCoupon: (payload: {
    text: string;
    image_url: string;
    code: string;
    min_class: UserClass;
    expires_at: string | null;
    quantity: number | null;
  }): Coupon => {
    const created: Coupon = {
      id: `c${Date.now()}`,
      image_url:
        payload.image_url ||
        "https://images.unsplash.com/photo-1556742400-b5b7c5121f9c?auto=format&fit=crop&w=800&q=70",
      text: payload.text,
      code: payload.code,
      min_class: payload.min_class,
      expires_at: payload.expires_at,
      quantity_left: payload.quantity,
      locked: false,
      created_at: new Date().toISOString(),
    };
    coupons = [created, ...coupons];
    return created;
  },

  adminValidateCoupon: (id: string) => {
    const c = coupons.find((x) => x.id === id);
    if (c) {
      history.unshift({
        id: `h${Date.now()}`,
        coupon_id: c.id,
        coupon_text: c.text,
        code: c.code,
        validated_at: new Date().toISOString(),
      });
      coupons = coupons.filter((x) => x.id !== id);
    }
    return { ok: true as const };
  },

  adminUsers: () => [...adminUsers],
  adminUpdateUser: (id: number, payload: { user_class?: UserClass; is_vip?: boolean }) => {
    adminUsers = adminUsers.map((u) =>
      u.telegram_id === id ? { ...u, ...payload } : u,
    );
    if (id === profile.telegram_id) {
      profile = { ...profile, ...payload };
    }
    return adminUsers.find((u) => u.telegram_id === id)!;
  },

  adminStats: (): AdminStats => {
    const per_class = { Starter: 0, Loki: 0, Blaise: 0, Master: 0 } as Record<
      UserClass,
      number
    >;
    adminUsers.forEach((u) => {
      per_class[u.user_class] += 1;
    });
    const vip_users = adminUsers.filter((u) => u.is_vip).length;
    return {
      total_users: adminUsers.length,
      per_class,
      vip_users,
      vip_conversion: adminUsers.length ? vip_users / adminUsers.length : 0,
    };
  },
};

export function mockAuth(_startParam: string | null) {
  void _startParam;
  return {
    token: "mock-token",
    profile: MOCK_DB.profile(),
  };
}
