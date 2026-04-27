import axios from 'axios';

// ——— Steam — Web API key in .env enables this provider. Catalog data comes from the public Store
// API (details + search; no key is sent to Store endpoints). Dev proxy: /api/steam-store → store.steampowered.com
//
// Env resolution (first non-empty wins). Create React App only inlines REACT_APP_* at build time;
// NEXT_PUBLIC_STEAM_API_KEY works on Next.js / Vite; STEAM_API_KEY is listed for dashboards that
// use that name — duplicate as REACT_APP_STEAM_WEB_API_KEY on Vercel for CRA builds.

const STEAM_KEY_ENV_NAMES = [
  'REACT_APP_STEAM_WEB_API_KEY',
  'NEXT_PUBLIC_STEAM_API_KEY',
  'STEAM_API_KEY',
];

let steamKeyEnvCache;

function readSteamWebApiKeyFromEnv() {
  if (steamKeyEnvCache) return steamKeyEnvCache;
  for (const name of STEAM_KEY_ENV_NAMES) {
    const raw = process.env[name];
    const value = (raw != null ? String(raw) : '').trim();
    if (value) {
      steamKeyEnvCache = { value, source: name };
      return steamKeyEnvCache;
    }
  }
  steamKeyEnvCache = { value: '', source: null };
  return steamKeyEnvCache;
}

/** Resolved Steam Web API key (trimmed), or empty string if unset. */
export function steamWebApiKey() {
  return readSteamWebApiKeyFromEnv().value;
}

/** Which env var supplied the key, or null — for diagnostics only. */
export function steamWebApiKeySource() {
  return readSteamWebApiKeyFromEnv().source;
}

let steamEnvDiagnosticsLogged = false;

function logSteamEnvDiagnostics() {
  if (steamEnvDiagnosticsLogged) return;
  steamEnvDiagnosticsLogged = true;

  const { value, source } = readSteamWebApiKeyFromEnv();
  const steamProxySet = (process.env.REACT_APP_STEAM_STORE_PROXY || '').trim().length > 0;

  // TODO(remove): temporary — confirm key is embedded at build time without printing the secret.
  if (value) {
    console.info(
      `[gamesApi] Steam Web API key: loaded (length ${value.length}, source env: ${source})`,
    );
  } else {
    const tried = STEAM_KEY_ENV_NAMES.join(', ');
    console.warn(
      `[gamesApi] Steam Web API key: missing (checked: ${tried}). ` +
        'The catalog will be empty until you set REACT_APP_STEAM_WEB_API_KEY and rebuild. ' +
        'On Vercel, add it for Production (not only Development) and redeploy.',
    );
  }

  if (steamProxySet && !value) {
    console.warn(
      '[gamesApi] REACT_APP_STEAM_STORE_PROXY is set but no Steam Web API key was found; ' +
        'the proxy path is unused until a key is configured.',
    );
  }
}

export function shouldUseSteam() {
  return steamWebApiKey().length > 0;
}

function steamStoreBase() {
  const custom = (process.env.REACT_APP_STEAM_STORE_PROXY || '').trim();
  if (custom) {
    return custom.replace(/\/$/, '');
  }
  if (process.env.NODE_ENV === 'development') {
    return '/api/steam-store';
  }
  return 'https://store.steampowered.com';
}

function roundPriceUp(price) {
  const wholeNumber = Math.ceil(price);
  return wholeNumber - 0.01;
}

function roundRatingToHalf(rating) {
  return Math.round(rating * 2) / 2;
}

/** Ensure usable absolute URL for img src (protocol-relative, empty, or string "null"). */
function normalizeImageUrl(url) {
  if (url == null || typeof url !== 'string') return null;
  const u = url.trim();
  if (!u || u === 'null') return null;
  if (u.startsWith('//')) return `https:${u}`;
  return u;
}

function calculatePrice(game) {
  const basePrice = 29.99;
  const ratingMultiplier = (game.score || 4) / 5;
  const genreMultiplier = game.genres?.length > 1 ? 1.2 : 1;
  const rd = game.release_date;
  const year = rd ? new Date(rd).getFullYear() : new Date().getFullYear();
  const ageMultiplier = year > 2020 ? 1.3 : year > 2015 ? 1.1 : 0.9;

  return Math.round(basePrice * ratingMultiplier * genreMultiplier * ageMultiplier * 100) / 100;
}

function stripSteamHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Popular / recognizable Steam app IDs for the storefront seed list. */
const STEAM_SEED_APP_IDS = [
  730, 570, 271590, 1174180, 1245620, 1091500, 1599340, 1938090, 252490, 440, 1086940, 413150,
  578080, 359550, 381210, 236850, 377160, 228980, 239140, 8930, 1222670, 1888930, 1627720, 1818450,
  1621690, 1145360, 1986010, 1326470, 227300, 359320, 275850, 292030, 379720, 435150, 489830, 526870,
  814380, 105600, 367520, 242760, 261550, 394360, 431960, 284160, 374320, 218620, 323190, 379730,
  582010, 606160, 892970, 1158310, 1284410, 1426210, 1551360, 1675200, 1794680, 2050650,
];

function parseSteamAppId(routeId) {
  const s = String(routeId).trim();
  if (s.startsWith('s') || s.startsWith('S')) {
    return Number.parseInt(s.slice(1), 10);
  }
  return Number.parseInt(s, 10);
}

async function steamFetchAppDetails(appId) {
  const id = String(appId);
  const { data } = await axios.get(`${steamStoreBase()}/api/appdetails`, {
    params: { appids: id, l: 'en', cc: 'us' },
    timeout: 18_000,
  });
  return data[id];
}

function steamPriceUsd(data) {
  const po = data.price_overview;
  if (po && typeof po.final === 'number') {
    return Math.max(0.01, po.final / 100);
  }
  return null;
}

function transformSteamStoreGame(appId, entry) {
  if (!entry?.success || !entry.data) {
    return null;
  }
  const d = entry.data;
  const genres = (d.genres || []).map((g) => g.description).filter(Boolean);
  const genre = genres[0] || 'PC';
  const platforms = [];
  if (d.platforms?.windows) platforms.push('PC');
  if (d.platforms?.mac) platforms.push('Mac');
  if (d.platforms?.linux) platforms.push('Linux');

  const metaScore = d.metacritic?.score;
  const rating =
    metaScore != null
      ? roundRatingToHalf(metaScore / 20)
      : roundRatingToHalf((d.recommendations?.total || 0) > 50000 ? 4 : 3.5);

  const releaseRaw = d.release_date?.date || null;
  const about = stripSteamHtml(d.about_the_game || '');
  const shortDesc = (d.short_description || '').trim();
  const description = shortDesc || about.slice(0, 600) || d.name;

  const img =
    normalizeImageUrl(d.header_image) ||
    normalizeImageUrl(d.screenshots?.[0]?.path_full) ||
    null;

  const priceUsd = steamPriceUsd(d);
  const price =
    priceUsd != null
      ? roundPriceUp(priceUsd)
      : roundPriceUp(
          calculatePrice({
            score: metaScore != null ? metaScore / 10 : 6,
            genres: genres.map((name) => ({ name })),
            release_date: releaseRaw,
          }),
        );

  return {
    id: Number(appId),
    title: d.name,
    image: img,
    price,
    genre,
    genres,
    rating,
    description,
    storyline: about || shortDesc,
    developer: d.developers?.[0] || 'Various',
    publisher: d.publishers?.[0] || 'Various',
    releaseDate: releaseRaw,
    platforms: platforms.length ? platforms : ['PC'],
    slug: d.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(appId),
    metacritic: metaScore ?? null,
    website: d.website || `https://store.steampowered.com/app/${appId}`,
    tags: (d.categories || []).map((c) => c.description).filter(Boolean).slice(0, 12),
  };
}

async function steamFetchDetailsBatch(appIds) {
  const chunkSize = 4;
  const games = [];
  for (let i = 0; i < appIds.length; i += chunkSize) {
    const chunk = appIds.slice(i, i + chunkSize);
    const part = await Promise.all(
      chunk.map(async (appId) => {
        try {
          const entry = await steamFetchAppDetails(appId);
          return transformSteamStoreGame(appId, entry);
        } catch {
          return null;
        }
      }),
    );
    games.push(...part.filter(Boolean));
  }
  return games;
}

export const steamService = {
  fetchPopularGames: async (offset = 0, limit = 20) => {
    const ids = STEAM_SEED_APP_IDS.slice(offset, offset + limit);
    if (ids.length === 0) {
      return [];
    }
    return steamFetchDetailsBatch(ids);
  },

  searchGames: async (query, limit = 20) => {
    const q = (query || '').trim();
    if (!q) {
      return steamService.fetchPopularGames(0, limit);
    }
    try {
      const { data } = await axios.get(`${steamStoreBase()}/api/storesearch/`, {
        params: { term: q, cc: 'us', l: 'en' },
        timeout: 15_000,
      });
      const items = data?.items || [];
      const ids = items
        .filter((it) => it?.type === 'app')
        .map((it) => it?.id)
        .filter((id) => id != null)
        .slice(0, limit);
      if (ids.length === 0) {
        return [];
      }
      return steamFetchDetailsBatch(ids);
    } catch {
      return [];
    }
  },

  fetchGameById: async (id) => {
    const numeric = parseSteamAppId(id);
    if (Number.isNaN(numeric)) {
      throw new Error('Game not found');
    }
    const entry = await steamFetchAppDetails(numeric);
    const game = transformSteamStoreGame(numeric, entry);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  },

  fetchGamesByGenre: async () => {
    throw new Error('fetchGamesByGenre is not implemented for Steam in this app');
  },

  fetchGameReviews: async () => [],

  fetchGameImages: async () => [],
};

const steamCatalogDisabledService = {
  fetchPopularGames: async () => [],
  searchGames: async () => [],
  fetchGameById: async () => {
    throw new Error(
      'Steam catalog is not configured. Set REACT_APP_STEAM_WEB_API_KEY in .env and restart the dev server.',
    );
  },
  fetchGamesByGenre: async () => [],
  fetchGameReviews: async () => [],
  fetchGameImages: async () => [],
};

function resolveGamesService() {
  if (shouldUseSteam()) {
    return steamService;
  }
  return steamCatalogDisabledService;
}

export const gamesService = resolveGamesService();

logSteamEnvDiagnostics();

export default gamesService;
