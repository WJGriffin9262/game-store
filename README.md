# Gaming Odyssey

A React game storefront: browse a catalog, open game details, and manage a cart with local persistence. Supports multiple optional data sources (RAWG, Steam Store, GameSpot, IGDB) behind one `gamesService` layer.

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

Copy `.env.example` to `.env` and add keys **only on your machine** (never commit `.env`).

| Variable | Role |
|----------|------|
| `REACT_APP_RAWG_API_KEY` | [RAWG](https://rawg.io/apidocs) catalog (browser-friendly). |
| `REACT_APP_STEAM_WEB_API_KEY` | Enables Steam path; store data loads via Store API (see `.env.example` for `PREFER_STEAM` / proxy). |
| `REACT_APP_GAMESPOT_API_KEY` | GameSpot JSONP; merges with RAWG when both set. |
| `REACT_APP_USE_IGDB` + `TWITCH_*` | IGDB via dev proxy in `src/setupProxy.js`. |

**Provider priority** (see `src/gamesApi.js` `resolveGamesService`): e.g. RAWG + GameSpot hybrid when both keys exist; otherwise RAWG, then Steam, then IGDB, then GameSpot alone.

Restart `npm start` after changing `.env`.

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
- `src/gamesApi.js` — API adapters and `gamesService`
- `src/setupProxy.js` — dev-only proxies (IGDB, Steam Store) to avoid CORS

## License / coursework

Use only API keys you own. For submissions, include `.env.example` and omit `.env`.
