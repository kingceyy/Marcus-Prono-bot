/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export type TelegramUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
};

export type TelegramContext = {
  initData: string;
  user: TelegramUser | null;
  startParam: string | null;
  isMock: boolean;
};

const MOCK: TelegramContext = {
  initData: "mock-init-data",
  user: {
    id: 4242,
    first_name: "Aperçu",
    last_name: "Lovable",
    username: "preview_user",
    photo_url: "",
    language_code: "fr",
  },
  startParam: null,
  isMock: true,
};

let cached: TelegramContext | null = null;

export function initTelegram() {
  const wa = window.Telegram?.WebApp;
  if (!wa) return;
  try {
    wa.ready?.();
    wa.expand?.();
    if (wa.setHeaderColor) wa.setHeaderColor("#0a0a0a");
    if (wa.setBackgroundColor) wa.setBackgroundColor("#0a0a0a");
  } catch {
    /* noop */
  }
}

export function getTelegramContext(): TelegramContext {
  if (cached) return cached;
  const wa = window.Telegram?.WebApp;
  if (!wa || !wa.initData) {
    cached = MOCK;
    return cached;
  }
  cached = {
    initData: wa.initData,
    user: wa.initDataUnsafe?.user ?? null,
    startParam: wa.initDataUnsafe?.start_param ?? null,
    isMock: false,
  };
  return cached;
}

export function openTelegramLink(url: string) {
  const wa = window.Telegram?.WebApp;
  if (wa?.openTelegramLink && url.startsWith("https://t.me/")) {
    wa.openTelegramLink(url);
    return;
  }
  if (wa?.openLink) {
    wa.openLink(url);
    return;
  }
  window.open(url, "_blank");
}
