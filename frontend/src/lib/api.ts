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
import { MOCK_DB, mockAuth } from "./mock";
import { getTelegramContext } from "./telegram";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

/**
 * Centralized endpoint map. Renaming a backend route = one line here.
 */
export const ENDPOINTS = {
  authTelegram: "/auth/telegram",
  me: "/me",
  coupons: "/coupons",
  couponsHistory: "/coupons/history",
  leaderboard: "/leaderboard",
  referees: "/referees",
  vip: "/vip",
  vipPurchase: "/vip/purchase",
  forcesubCheck: "/forcesub/check",
  adminCoupons: "/admin/coupons",
  adminCouponValidate: (id: string) => `/admin/coupons/${id}/validate`,
  adminCouponUnvalidate: (id: string) => `/admin/coupons/${id}/unvalidate`,
  adminCouponDelete: (id: string) => `/admin/coupons/${id}`,
  adminUsers: "/admin/users",
  adminUser: (id: number) => `/admin/users/${id}`,
  adminStats: "/admin/stats",
} as const;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public payload?: unknown,
  ) {
    super(message);
  }
}

let bearerToken: string | null = null;
export function setAuthToken(token: string | null) {
  bearerToken = token;
}

function isMockMode(): boolean {
  if (!BASE_URL) return true;
  return getTelegramContext().isMock;
}

async function request<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, headers, ...rest } = init;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : (rest.body as BodyInit | undefined),
  });
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    throw new ApiError(
      (data && typeof data === "object" && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : res.statusText) || "Erreur réseau",
      res.status,
      data,
    );
  }
  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export const api = {
  async authTelegram(initData: string, startParam: string | null) {
    if (isMockMode()) return mockAuth(startParam);
    return request<{ token: string; profile: Profile }>(ENDPOINTS.authTelegram, {
      method: "POST",
      json: { init_data: initData, start_param: startParam },
    });
  },

  async me() {
    if (isMockMode()) return MOCK_DB.profile();
    return request<Profile>(ENDPOINTS.me);
  },

  async coupons() {
    if (isMockMode()) return MOCK_DB.coupons();
    return request<Coupon[]>(ENDPOINTS.coupons);
  },

  async couponsHistory() {
    if (isMockMode()) return MOCK_DB.history();
    return request<HistoryEntry[]>(ENDPOINTS.couponsHistory);
  },

  async leaderboard() {
    if (isMockMode()) return MOCK_DB.leaderboard();
    return request<LeaderboardEntry[]>(ENDPOINTS.leaderboard);
  },

  async referees() {
    if (isMockMode()) return MOCK_DB.referees();
    return request<Referee[]>(ENDPOINTS.referees);
  },

  async vip() {
    if (isMockMode()) return MOCK_DB.vip();
    return request<VipInfo>(ENDPOINTS.vip);
  },

  async vipPurchase() {
    if (isMockMode()) return { redirect_url: "https://t.me/" };
    return request<{ redirect_url: string }>(ENDPOINTS.vipPurchase, { method: "POST" });
  },

  async forcesubCheck() {
    if (isMockMode()) return { is_member: MOCK_DB.forceSubState() };
    return request<{ is_member: boolean }>(ENDPOINTS.forcesubCheck, { method: "POST" });
  },

  /* --- Admin --- */
  async adminCreateCoupon(payload: {
    text: string;
    image_url: string;
    code: string;
    min_class: UserClass;
    expires_at: string | null;
    quantity: number | null;
  }) {
    if (isMockMode()) return MOCK_DB.adminCreateCoupon(payload);
    return request<Coupon>(ENDPOINTS.adminCoupons, { method: "POST", json: payload });
  },

  async adminValidateCoupon(id: string) {
    if (isMockMode()) return MOCK_DB.adminValidateCoupon(id);
    return request<Coupon>(ENDPOINTS.adminCouponValidate(id), {
      method: "PATCH",
    });
  },

  async adminUnvalidateCoupon(id: string) {
    if (isMockMode()) return MOCK_DB.adminUnvalidateCoupon(id);
    return request<Coupon>(ENDPOINTS.adminCouponUnvalidate(id), {
      method: "PATCH",
    });
  },

  async adminDeleteCoupon(id: string) {
    if (isMockMode()) return MOCK_DB.adminDeleteCoupon(id);
    return request<{ ok: true }>(ENDPOINTS.adminCouponDelete(id), {
      method: "DELETE",
    });
  },

  async adminUsers() {
    if (isMockMode()) return MOCK_DB.adminUsers();
    return request<AdminUserRow[]>(ENDPOINTS.adminUsers);
  },

  async adminUpdateUser(
    id: number,
    payload: { user_class?: UserClass; is_vip?: boolean },
  ) {
    if (isMockMode()) return MOCK_DB.adminUpdateUser(id, payload);
    return request<AdminUserRow>(ENDPOINTS.adminUser(id), {
      method: "PATCH",
      json: payload,
    });
  },

  async adminStats() {
    if (isMockMode()) return MOCK_DB.adminStats();
    return request<AdminStats>(ENDPOINTS.adminStats);
  },
};
