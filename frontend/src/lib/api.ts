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

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

/**
 * Centralized endpoint map. Toutes les routes backend vivent sous le prefixe
 * /api (voir app/api.py, router = APIRouter(prefix="/api")).
 */
export const ENDPOINTS = {
  authTelegram: "/api/auth/telegram",
  me: "/api/me",
  coupons: "/api/coupons",
  couponsHistory: "/api/coupons/history",
  leaderboard: "/api/leaderboard",
  referees: "/api/referees",
  vip: "/api/vip",
  vipPurchase: "/api/vip/purchase",
  forcesubCheck: "/api/forcesub/check",
  adminCoupons: "/api/admin/coupons",
  adminCouponValidate: (id: string) => `/api/admin/coupons/${id}/validate`,
  adminUsers: "/api/admin/users",
  adminUser: (id: number) => `/api/admin/users/${id}`,
  adminStats: "/api/admin/stats",
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

async function request<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  if (!BASE_URL) {
    throw new ApiError(
      "VITE_API_BASE_URL n'est pas configurée. Définissez-la dans les variables d'environnement du frontend.",
      0,
    );
  }
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
    return request<{ token: string; profile: Profile; is_member: boolean }>(
      ENDPOINTS.authTelegram,
      {
        method: "POST",
        json: { init_data: initData, start_param: startParam },
      },
    );
  },

  async me() {
    return request<Profile>(ENDPOINTS.me);
  },

  async coupons() {
    return request<Coupon[]>(ENDPOINTS.coupons);
  },

  async couponsHistory() {
    return request<HistoryEntry[]>(ENDPOINTS.couponsHistory);
  },

  async leaderboard() {
    return request<LeaderboardEntry[]>(ENDPOINTS.leaderboard);
  },

  async referees() {
    return request<Referee[]>(ENDPOINTS.referees);
  },

  async vip() {
    return request<VipInfo>(ENDPOINTS.vip);
  },

  async vipPurchase() {
    return request<{ redirect_url: string }>(ENDPOINTS.vipPurchase, { method: "POST" });
  },

  async forcesubCheck() {
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
    return request<Coupon>(ENDPOINTS.adminCoupons, { method: "POST", json: payload });
  },

  async adminValidateCoupon(id: string) {
    return request<{ ok: true }>(ENDPOINTS.adminCouponValidate(id), {
      method: "PATCH",
    });
  },

  async adminUsers() {
    return request<AdminUserRow[]>(ENDPOINTS.adminUsers);
  },

  async adminUpdateUser(
    id: number,
    payload: { user_class?: UserClass; is_vip?: boolean },
  ) {
    return request<AdminUserRow>(ENDPOINTS.adminUser(id), {
      method: "PATCH",
      json: payload,
    });
  },

  async adminStats() {
    return request<AdminStats>(ENDPOINTS.adminStats);
  },
};
