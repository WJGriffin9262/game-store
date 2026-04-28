# Gaming Odyssey

A React game storefront: browse a Steam-backed catalog, open game details, and manage a cart with local persistence. Catalog data comes from the Steam Store API via `src/gamesApi.js`.

## Requirements

- **Node.js** 18+ recommended (matches current React Testing Library / tooling).
- **npm** 8+

## Quick start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test -- --watchAll=false   # run tests once
npm run build                 # production bundle in /build
```

## Configuration

Copy `.env.example` to `.env` and add your Steam Web API key **only on your machine** (never commit `.env`).

| Variable | Role |
|----------|------|
| `STEAM_API_KEY` | **Preferred:** server-only (dev `setupProxy.js` + Vercel `api/catalog-status.js` / `api/steam-web.js`). Not inlined into the CRA bundle; enables catalog via `GET /api/catalog-status` and Steam Web calls via `/api/steam-web`. |
| `REACT_APP_STEAM_WEB_API_KEY` or `REACT_APP_STEAM_API_KEY` | Optional client-bundle gate (inlined at build time). `NEXT_PUBLIC_STEAM_API_KEY` is checked first for parity; react-scripts does not inject `NEXT_PUBLIC_*` unless you customize webpack. |
| `REACT_APP_STEAM_STORE_PROXY` | Set to **`/api/steam-store`** on Vercel so requests use the rewrite in `vercel.json` (same as `setupProxy.js` in dev). |

Restart `npm start` after changing `.env`.

**Vercel:** This app does not ship `.env` to the host. In the Vercel project, open **Settings → Environment Variables** and add the same names as in `.env.example` for **Production** (and Preview if needed), then **Redeploy**.

## Stack

- React 19, React Router 7
- Context API (`src/context/AppContext.jsx`) for catalog + cart + theme
- Axios, global styles (`src/index.css`), Lucide icons
- Jest + React Testing Library (`src/*.test.js`)

## Entry points (do not treat as dead code)

Use this map before deleting exports: many pieces are **only referenced indirectly**.

| Layer | Entry | Role |
|-------|--------|------|
| **Bootstrap** | `src/index.js` | `ReactDOM.createRoot` → wraps `App` in `Router` + `AppProvider` from `src/context/AppContext.jsx`. Imports global `src/index.css`. |
| **Routes / layout** | `src/App.jsx` | Defines `/`, `/games`, `/games/:id`, `/cart`; composes `Header`, `Footer`, and page components under `src/pages/`. |
| **Catalog + cart state** | `src/context/AppContext.jsx` | Single source of truth: calls `gamesService` from `src/gamesApi.js`, owns cart/toast/theme. **All catalog fetches go through here** — `gamesApi` is not imported by pages directly. |
| **Steam HTTP (dev)** | `src/setupProxy.js` | CRA dev-only middleware: `/api/steam-store` → `store.steampowered.com`. Not a React module; required at runtime in development. |
| **Steam HTTP (prod)** | `vercel.json` | Same path pattern as the dev proxy when deployed on Vercel. |

**Listing vs search:** The app loads pages of popular titles via `gamesService.fetchPopularGames` and filters/sorts in the browser with `src/hooks/useCatalogFilters.js` (including `?search=` from the URL). There is **no** separate server search API in this repo.

### Recent rework (Steam catalog)

The **`gamesService` object exported from `src/gamesApi.js`** (Steam Store adapter: `fetchPopularGames`, `fetchGameById`) **replaces all previous catalog implementations** for this app. Earlier unused surface (`searchGames` on the service, extra context fields, stub genre/reviews/image helpers) was removed on purpose; **do not reintroduce parallel catalog clients** unless you wire every screen to them.

## Project layout

- `src/pages/` — route screens (Home, Games, GameDetails, Cart)
- `src/components/` — shared UI for header, footer, storefront, cart, and controls
- `src/hooks/` — reusable hooks
- `src/utils/` — formatting and small helpers
- `src/index.css` — global CSS (Tailwind + theme)
- `src/context/AppContext.jsx` — app-wide state
- `src/gamesApi.js` — Steam Store adapter and `gamesService`
- `src/setupProxy.js` — dev-only proxy for Steam Store (CORS)

## License / coursework

Use only API keys you own. For submissions, include `.env.example` and omit `.env`.
