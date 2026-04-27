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
| `REACT_APP_STEAM_WEB_API_KEY` | Required for the catalog. Enables the Steam integration (see `.env.example` for optional alias names and the store proxy). |
| `REACT_APP_STEAM_STORE_PROXY` | Set to **`/api/steam-store`** on Vercel so requests use the rewrite in `vercel.json` (same as `setupProxy.js` in dev). |

Restart `npm start` after changing `.env`.

**Vercel:** This app does not ship `.env` to the host. In the Vercel project, open **Settings → Environment Variables** and add the same names as in `.env.example` for **Production** (and Preview if needed), then **Redeploy**.

## Stack

- React 19, React Router 7
- Context API (`src/context/AppContext.jsx`) for catalog + cart + theme
- Axios, global styles (`src/styles/index.css`), Lucide icons
- Jest + React Testing Library (`src/*.test.js`)

## Project layout

- `src/pages/` — route screens (Home, Games, GameDetails, Cart)
- `src/components/layout/` — shell pieces (header, footer, page chrome)
- `src/components/ui/` — shared controls (buttons, grids, feedback)
- `src/components/catalog/` — catalog-specific widgets
- `src/components/cart/` — cart-specific widgets
- `src/hooks/` — page-level logic hooks
- `src/utils/` — formatting and small helpers
- `src/styles/` — global CSS
- `src/context/AppContext.jsx` — app-wide state
- `src/gamesApi.js` — Steam Store adapter and `gamesService`
- `src/setupProxy.js` — dev-only proxy for Steam Store (CORS)

## License / coursework

Use only API keys you own. For submissions, include `.env.example` and omit `.env`.
