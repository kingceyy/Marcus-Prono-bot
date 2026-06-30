export type UserClass = "Starter" | "Loki" | "Blaise" | "Master";

export const CLASS_ORDER: UserClass[] = ["Starter", "Loki", "Blaise", "Master"];

export const CLASS_THRESHOLDS: Record<UserClass, number> = {
  Starter: 0,
  Loki: 30,
  Blaise: 50,
  Master: 80,
};

export function nextClass(c: UserClass): UserClass | null {
  const i = CLASS_ORDER.indexOf(c);
  return i < CLASS_ORDER.length - 1 ? CLASS_ORDER[i + 1] : null;
}

export function classRank(c: UserClass): number {
  return CLASS_ORDER.indexOf(c);
}

export type Profile = {
  telegram_id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  user_class: UserClass;
  is_vip: boolean;
  referral_code: string;
  active_invites: number;
  total_invites: number;
  next_threshold: number | null;
  joined_at: string;
  is_admin: boolean;
};

export type Coupon = {
  id: string;
  image_url: string;
  text: string;
  code: string;
  min_class: UserClass;
  expires_at: string | null;
  quantity_left: number | null;
  locked: boolean;
  created_at: string;
};

export type HistoryEntry = {
  id: string;
  coupon_id: string;
  coupon_text: string;
  code: string;
  validated_at: string;
};

export type LeaderboardEntry = {
  rank: number;
  display_name: string;
  active_invites: number;
  user_class: UserClass;
  is_vip: boolean;
};

export type Referee = {
  id: number;
  display_name: string;
  joined_at: string;
  active: boolean;
};

export type VipInfo = {
  is_vip: boolean;
  price_label: string;
  channel_url: string | null;
};

export type AdminUserRow = {
  telegram_id: number;
  display_name: string;
  user_class: UserClass;
  is_vip: boolean;
  active_invites: number;
};

export type AdminStats = {
  total_users: number;
  per_class: Record<UserClass, number>;
  vip_users: number;
  vip_conversion: number;
};
