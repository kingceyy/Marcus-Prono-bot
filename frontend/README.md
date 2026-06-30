# CLUB JM — Mini App Telegram

Frontend React + TypeScript (Vite, SPA) pour le bot Telegram **CLUB JM**.
Communique avec une API FastAPI externe ; ne contient aucun backend.

## Démarrage local

```bash
bun install        # ou npm install / pnpm install
cp .env.example .env
bun run dev
```

Ouvre http://localhost:8080. Hors Telegram, l'app bascule automatiquement sur
des données simulées (mock) — utile pour le preview design.

## Variables d'environnement

| Variable             | Description                                             |
| -------------------- | -------------------------------------------------------- |
| `VITE_API_BASE_URL`  | URL racine de l'API FastAPI (sans `/` final).           |
| `VITE_BOT_USERNAME`  | Username du bot Telegram (sans `@`), pour `t.me/...`.   |
| `VITE_CHANNEL_URL`   | Lien d'invitation du canal Telegram (force-sub).        |
| `VITE_CHANNEL_NAME`  | Nom affiché du canal (optionnel).                       |

## Déploiement Vercel

1. Pousser ce dépôt sur GitHub.
2. Importer le projet sur Vercel — preset **Vite** détecté automatiquement.
3. Renseigner les variables d'environnement ci-dessus.
4. `vercel.json` gère déjà le rewrite SPA `/* → /index.html`.

Aucune adaptation n'est nécessaire : le projet est un Vite SPA pur.

## Stack

- React 19 + TypeScript + Vite 7
- React Router v7
- Tailwind v4 (tokens design dans `src/styles.css`)
- lucide-react (icônes SVG uniquement, zéro émoji)
- SDK Telegram WebApp avec fallback mock automatique

## Architecture

```
src/
  lib/
    api.ts            # client REST centralisé (renommer une route = 1 ligne)
    telegram.ts       # SDK Telegram + détection mode preview
    mock.ts           # données simulées hors Telegram
    auth-context.tsx  # token + profil en state React (jamais localStorage)
  components/
    ui/               # primitives (button, card, badge, ...)
    ClassBadge, VipBadge, CouponCard, BottomNav, TopBar,
    ForceSubGate, AuthGate, PageShell
  pages/
    Home, Coupons, Referral, Leaderboard, Vip,
    History, Profile, Admin
```

## Endpoints API consommés

Centralisés dans `src/lib/api.ts → ENDPOINTS`.

- `POST /auth/telegram`
- `GET /me`
- `GET /coupons`, `GET /coupons/history`
- `GET /leaderboard`
- `POST /vip/purchase`
- `POST /forcesub/check`
- `POST /admin/coupons`, `PATCH /admin/coupons/:id/validate`
- `GET /admin/users`, `PATCH /admin/users/:id`
