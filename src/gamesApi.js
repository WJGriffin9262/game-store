import axios from 'axios';

/** Env names checked for a non-empty value (used only as a gate; the Store API requests do not send the key). */
const STEAM_CATALOG_CREDENTIAL_ENV_NAMES = [
  'NEXT_PUBLIC_STEAM_API_KEY',
  'REACT_APP_STEAM_WEB_API_KEY',
  'REACT_APP_STEAM_API_KEY',
];

let steamCatalogCredentialCache;

function readSteamCatalogCredentialPresenceFromEnv() {
  if (steamCatalogCredentialCache != null) return steamCatalogCredentialCache;
  for (const name of STEAM_CATALOG_CREDENTIAL_ENV_NAMES) {
    const raw = process.env[name];
    const trimmed = (raw != null ? String(raw) : '').trim();
    if (trimmed.length > 0) {
      steamCatalogCredentialCache = true;
      return steamCatalogCredentialCache;
    }
  }
  steamCatalogCredentialCache = false;
  return steamCatalogCredentialCache;
}

let steamEnvDiagnosticsLogged = false;

function logSteamEnvDiagnostics() {
  if (process.env.NODE_ENV !== 'development') return;
  if (steamEnvDiagnosticsLogged) return;
  steamEnvDiagnosticsLogged = true;

  const configured = readSteamCatalogCredentialPresenceFromEnv();
  const steamProxySet = (process.env.REACT_APP_STEAM_STORE_PROXY || '').trim().length > 0;

  console.info('[gamesApi] Steam catalog credential present:', configured);

  if (!configured) {
    const tried = STEAM_CATALOG_CREDENTIAL_ENV_NAMES.join(', ');
    console.info(
      `[gamesApi] No Steam key in the client bundle (checked: ${tried}). ` +
        'Using STEAM_API_KEY in .env instead? Catalog is gated by GET /api/catalog-status (server reads that name).',
    );
  }

  if (steamProxySet && !configured) {
    console.warn(
      '[gamesApi] REACT_APP_STEAM_STORE_PROXY is set but no Steam credential was found; ' +
        'the proxy path is unused until a credential is configured.',
    );
  }
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

const steamService = {
  fetchPopularGames: async (offset = 0, limit = 20) => {
    const ids = STEAM_SEED_APP_IDS.slice(offset, offset + limit);
    if (ids.length === 0) {
      return [];
    }
    return steamFetchDetailsBatch(ids);
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
};

const steamCatalogDisabledService = {
  fetchPopularGames: async () => [],
  fetchGameById: async () => {
    throw new Error(
      'Steam catalog is not configured. Prefer server-only STEAM_API_KEY (see catalogStatusEnv.js and /api/catalog-status); ' +
        'or set REACT_APP_STEAM_WEB_API_KEY / REACT_APP_STEAM_API_KEY for CRA (inlined in the bundle). Restart the dev server; on Vercel redeploy.',
    );
  },
};

/**
 * CRA only inlines REACT_APP_* into the bundle, so STEAM_API_KEY alone is wired via GET /api/catalog-status
 * (setupProxy.js in dev, api/catalog-status.js on Vercel).
 */
async function resolveGamesServiceAsync() {
  if (typeof fetch !== 'undefined') {
    try {
      const r = await fetch('/api/catalog-status', { credentials: 'same-origin' });
      if (r.ok) {
        const j = await r.json();
        if (j && j.enabled === true) {
          return steamService;
        }
      }
    } catch {
      // offline, tests, or static hosts with no API route — fall through to bundle env gate
    }
  }
  if (readSteamCatalogCredentialPresenceFromEnv()) {
    return steamService;
  }
  return steamCatalogDisabledService;
}

let resolvedGamesServicePromise;

function getResolvedGamesService() {
  if (resolvedGamesServicePromise == null) {
    resolvedGamesServicePromise = resolveGamesServiceAsync();
  }
  return resolvedGamesServicePromise;
}

export const gamesService = {
  fetchPopularGames: async (offset = 0, limit = 20) => {
    const svc = await getResolvedGamesService();
    return svc.fetchPopularGames(offset, limit);
  },
  fetchGameById: async (id) => {
    const svc = await getResolvedGamesService();
    return svc.fetchGameById(id);
  },
};

/** Steam Web API via same-origin /api/steam-web proxy (API key injected on the server). */
export async function fetchSteamWebApi(pathSegment, params = {}) {
  const qs = new URLSearchParams();
  qs.set('path', pathSegment);
  Object.entries(params).forEach(([k, v]) => {
    if (v == null || k === 'path' || k === 'key') return;
    qs.set(k, String(v));
  });
  const { data, status } = await axios.get(`/api/steam-web?${qs.toString()}`, {
    validateStatus: () => true,
  });
  if (status >= 400) {
    const msg =
      data != null &&
      typeof data === 'object' &&
      typeof data.error === 'string'
        ? data.error
        : `Steam Web API proxy error (${status})`;
    throw new Error(msg);
  }
  return data;
}

export async function fetchSteamGameNews(appId) {
  return fetchSteamWebApi('ISteamNews/GetNewsForApp/v2', {
    appid: String(appId),
    count: '3',
    maxlength: '220',
  });
}

logSteamEnvDiagnostics();
