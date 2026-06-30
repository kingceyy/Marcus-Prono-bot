import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, setAuthToken } from "./api";
import { getTelegramContext } from "./telegram";
import type { Profile } from "./types";

type AuthState = {
  status: "idle" | "loading" | "ready" | "error";
  profile: Profile | null;
  error: string | null;
  refresh: () => Promise<void>;
  retryAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const me = await api.me();
      setProfile(me);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }, []);

  const authenticate = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const ctx = getTelegramContext();
      const { token, profile: p } = await api.authTelegram(ctx.initData, ctx.startParam);
      setAuthToken(token);
      // Merge Telegram initData user fields (photo_url, names, username)
      // when the backend hasn't returned them yet — gives instant UI feel.
      const merged = {
        ...p,
        first_name: p.first_name || ctx.user?.first_name || p.first_name,
        username: p.username || ctx.user?.username || p.username,
        photo_url: p.photo_url || ctx.user?.photo_url || "",
      };
      setProfile(merged);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'authentification");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void authenticate();
  }, [authenticate]);

  const value = useMemo<AuthState>(
    () => ({ status, profile, error, refresh, retryAuth: authenticate }),
    [status, profile, error, refresh, authenticate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
