import axios from 'axios';
import jsonp from 'jsonp';

// GameSpot API Configuration
const GAMESPOT_BASE_URL = 'http://www.gamespot.com/api';
const API_KEY = process.env.REACT_APP_GAMESPOT_API_KEY || process.env.REACT_APP_IGDB_API_KEY;

// Create axios instance with GameSpot configuration for server-side requests
const gamespotApi = axios.create({
  baseURL: GAMESPOT_BASE_URL,
  timeout: 10000,
  headers: {
    'User-Agent': 'GamingOdyssey/1.0 (course-project)',
  },
});

// Add request interceptor for API key
gamespotApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: API_KEY,
    format: 'json',
  };
  return config;
});

// Add response interceptor for error handling
gamespotApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      throw new Error('Invalid GameSpot API key');
    }
    if (error.response?.status === 429) {
      throw new Error('GameSpot API rate limit exceeded');
    }
    throw error;
  }
);

// JSONP helper function for browser requests
const gamespotJsonpRequest = (endpoint, params = {}) => {
  return new Promise((resolve, reject) => {
    const url = `${GAMESPOT_BASE_URL}${endpoint}`;
    const queryParams = new URLSearchParams({
      ...params,
      api_key: API_KEY,
      format: 'jsonp',
    });

    const fullUrl = `${url}?${queryParams.toString()}`;

    // GameSpot requires callbackParam to be 'json_callback'
    jsonp(fullUrl, {
      timeout: 10000,
      param: 'json_callback'  // GameSpot expects this specific parameter name
    }, (err, data) => {
      if (err) {
        reject(new Error(`GameSpot API request failed: ${err.message}`));
        return;
      }

      if (!data) {
        reject(new Error('Empty response from GameSpot API'));
        return;
      }

      if (data.status_code !== 1) {
        reject(new Error(`GameSpot API error (${data.status_code}): ${data.error}`));
        return;
      }

      if (!data.results || !Array.isArray(data.results)) {
        reject(new Error('Invalid results format from GameSpot API'));
        return;
      }

      resolve(data);
    });
  });
};

// Transform GameSpot game data to our app format
const transformGameSpotGame = (game) => {
  return {
    id: game.id,
    title: game.name,
    image: normalizeImageUrl(
      game.image?.original || game.image?.screen_url || game.image?.medium_url,
    ),
    price: roundPriceUp(calculatePrice(game)),
    genre: game.genres?.[0]?.name || 'Unknown',
    genres: game.genres?.map(g => g.name) || [],
    rating: roundRatingToHalf(game.score || (Math.random() * 2 + 3)), // Use review score or random 3-5
    description: game.description || game.deck,
    developer: game.developers?.[0]?.name || 'Unknown',
    publisher: game.publishers?.[0]?.name || 'Unknown',
    releaseDate: game.release_date,
    platforms: game.platforms?.map(p => p.name) || [],
    slug: game.site_detail_url?.split('/').pop() || game.name?.toLowerCase().replace(/\s+/g, '-'),
    // GameSpot specific fields
    deck: game.deck,
    site_detail_url: game.site_detail_url,
    videos_api_url: game.videos_api_url,
    articles_api_url: game.articles_api_url,
    reviews_api_url: game.reviews_api_url,
    images_api_url: game.images_api_url,
    themes: game.themes?.map(t => t.name) || [],
    franchises: game.franchises?.map(f => f.name) || [],
  };
};

// Helper function to round price up to .01 under whole integer
const roundPriceUp = (price) => {
  const wholeNumber = Math.ceil(price);
  return wholeNumber - 0.01;
};

// Helper function to round rating to nearest half integer
const roundRatingToHalf = (rating) => {
  return Math.round(rating * 2) / 2;
};

/** Ensure usable absolute URL for img src (protocol-relative, empty, or string "null"). */
function normalizeImageUrl(url) {
  if (url == null || typeof url !== 'string') return null;
  const u = url.trim();
  if (!u || u === 'null') return null;
  if (u.startsWith('//')) return `https:${u}`;
  return u;
}

// Calculate price based on game data (mock pricing)
const calculatePrice = (game) => {
  const basePrice = 29.99;
  const ratingMultiplier = (game.score || 4) / 5;
  const genreMultiplier = game.genres?.length > 1 ? 1.2 : 1;
  const rd = game.release_date;
  const year = rd ? new Date(rd).getFullYear() : new Date().getFullYear();
  const ageMultiplier = year > 2020 ? 1.3 : year > 2015 ? 1.1 : 0.9;

  return Math.round((basePrice * ratingMultiplier * genreMultiplier * ageMultiplier) * 100) / 100;
};

// Common field list for game requests
const GAME_FIELD_LIST = 'id,name,image,deck,description,genres,themes,franchises,release_date,platforms,developers,publishers,score,site_detail_url,videos_api_url,articles_api_url,reviews_api_url,images_api_url';

// Helper function for common game fetching operations
const fetchGamesWithParams = async (params) => {
  const data = await gamespotJsonpRequest('/games/', {
    ...params,
    field_list: GAME_FIELD_LIST,
  });
  return data.results.map(transformGameSpotGame);
};

// API Functions
export const gamespotService = {
  // Fetch popular games (sorted by score/rating)
  fetchPopularGames: async (offset = 0, limit = 20) => {
    return await fetchGamesWithParams({
      sort: 'score:desc',
      limit: limit.toString(),
      offset: offset.toString(),
    });
  },

  // Search games
  searchGames: async (query, limit = 20) => {
    return await fetchGamesWithParams({
      filter: `name:${query}`,
      limit: limit.toString(),
    });
  },

  // Fetch single game by ID
  fetchGameById: async (id) => {
    const games = await fetchGamesWithParams({
      filter: `id:${id}`,
    });

    if (!games || games.length === 0) {
      throw new Error('Game not found');
    }

    return games[0];
  },

  // Fetch games by genre
  fetchGamesByGenre: async (genreName, limit = 20) => {
    return await fetchGamesWithParams({
      filter: `genres:${genreName}`,
      sort: 'score:desc',
      limit: limit.toString(),
    });
  },

  // Fetch game reviews
  fetchGameReviews: async (gameId, limit = 10) => {
    try {
      const data = await gamespotJsonpRequest('/reviews/', {
        filter: `game:${gameId}`,
        sort: 'publish_date:desc',
        limit: limit.toString(),
        field_list: 'id,title,deck,score,authors,publish_date,site_detail_url',
      });

      const reviews = data.results.map(review => ({
        id: review.id,
        title: review.title,
        deck: review.deck,
        score: review.score,
        authors: review.authors,
        publish_date: review.publish_date,
        site_detail_url: review.site_detail_url,
      }));

      return reviews;
    } catch (error) {
      throw error;
    }
  },

  // Fetch game images
  fetchGameImages: async (gameId, limit = 10) => {
    try {
      const data = await gamespotJsonpRequest('/images/', {
        association: gameId,
        limit: limit.toString(),
        field_list: 'id,site_detail_url,icon_url,medium_url,screen_url,small_url,super_url,thumb_url,tiny_url,screen_tiny,square_tiny,original',
      });

      const images = data.results.map(image => ({
        id: image.id,
        site_detail_url: image.site_detail_url,
        icon_url: image.icon_url,
        medium_url: image.medium_url,
        screen_url: image.screen_url,
        small_url: image.small_url,
        super_url: image.super_url,
        thumb_url: image.thumb_url,
        tiny_url: image.tiny_url,
        screen_tiny: image.screen_tiny,
        square_tiny: image.square_tiny,
        original: image.original,
      }));

      return images;
    } catch (error) {
      throw error;
    }
  },
};

// ——— RAWG — free tier, browser-safe (single REACT_APP_RAWG_API_KEY). https://rawg.io/apidocs

const RAWG_BASE_URL = 'https://api.rawg.io/api';

function rawgApiKey() {
  return (process.env.REACT_APP_RAWG_API_KEY || '').trim();
}

export function shouldUseRawg() {
  return rawgApiKey().length > 0;
}

export function shouldUseGameSpot() {
  return (process.env.REACT_APP_GAMESPOT_API_KEY || '').trim().length > 0;
}

/** RAWG returns absolute https URLs; `background_image` is often null for new/TBA titles — use screenshots. */
function pickRawgImage(game) {
  const primary = normalizeImageUrl(game.background_image);
  if (primary) return primary;
  const shots = game.short_screenshots || [];
  for (let i = 0; i < shots.length; i += 1) {
    const u = normalizeImageUrl(shots[i]?.image);
    if (u) return u;
  }
  return null;
}

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function transformRawgGame(game, isDetail) {
  const genres = (game.genres || []).map((g) => g.name).filter(Boolean);
  const platforms = (game.platforms || [])
    .map((p) => p.platform?.name)
    .filter(Boolean);
  const genre = genres[0] || 'Unknown';
  const rating = roundRatingToHalf(game.rating != null ? game.rating : 3.5);
  const releaseDate = game.released || null;
  const developer = game.developers?.[0]?.name || 'Various';
  const publisher = game.publishers?.[0]?.name || 'Various';
  const metacritic = game.metacritic != null ? game.metacritic : null;
  const longDesc = stripHtml(game.description_raw || game.description || '');
  const shortBlurb =
    longDesc.slice(0, 360) ||
    `${game.name} — a ${genre.toLowerCase()} game in the RAWG catalog.`;
  const description = isDetail ? longDesc : `${shortBlurb}${longDesc.length > 360 ? '…' : ''}`;
  const slug = game.slug || '';
  const website = game.website || null;
  const tags = (game.tags || []).map((t) => t.name).filter(Boolean).slice(0, 16);
  const scoreForPricing =
    metacritic != null ? metacritic / 10 : (game.rating != null ? game.rating * 2 : 6);
  const price = roundPriceUp(
    calculatePrice({
      score: scoreForPricing,
      genres: genres.map((name) => ({ name })),
      release_date: releaseDate,
    }),
  );

  return {
    id: game.id,
    title: game.name,
    image: pickRawgImage(game),
    price,
    genre,
    genres,
    rating,
    description,
    storyline: isDetail ? longDesc : '',
    developer,
    publisher,
    releaseDate,
    platforms,
    slug,
    metacritic,
    website,
    tags,
  };
}

async function rawgGet(path, params = {}) {
  const key = rawgApiKey();
  const { data } = await axios.get(`${RAWG_BASE_URL}${path}`, {
    params: { key, ...params },
    timeout: 15_000,
  });
  return data;
}

export const rawgService = {
  fetchPopularGames: async (offset = 0, limit = 20) => {
    const page = Math.floor(offset / limit) + 1;
    const data = await rawgGet('/games', {
      ordering: '-released',
      page_size: limit,
      page,
    });
    const rows = data.results || [];
    return rows.map((g) => transformRawgGame(g, false));
  },

  searchGames: async (query, limit = 20) => {
    const q = (query || '').trim();
    if (!q) {
      return rawgService.fetchPopularGames(0, limit);
    }
    const data = await rawgGet('/games', {
      search: q,
      page_size: limit,
    });
    const rows = data.results || [];
    return rows.map((g) => transformRawgGame(g, false));
  },

  fetchGameById: async (id) => {
    const data = await rawgGet(`/games/${id}`);
    if (!data?.id) {
      throw new Error('Game not found');
    }
    return transformRawgGame(data, true);
  },

  fetchGamesByGenre: async () => {
    throw new Error('fetchGamesByGenre is not implemented for RAWG in this app');
  },

  fetchGameReviews: async () => [],

  fetchGameImages: async () => [],
};

// ——— IGDB (Twitch) — browser hits /api/igdb in dev via setupProxy.js; production needs REACT_APP_IGDB_API_BASE.

const IGDB_LIST_FIELDS = [
  'name',
  'summary',
  'first_release_date',
  'total_rating',
  'rating',
  'aggregated_rating',
  'cover.image_id',
  'genres.name',
  'platforms.name',
  'involved_companies.company.name',
  'involved_companies.developer',
  'involved_companies.publisher',
  'slug',
  'url',
].join(',');

const IGDB_DETAIL_FIELDS = [
  IGDB_LIST_FIELDS,
  'storyline',
  'themes.name',
  'websites.url',
  'websites.category',
].join(',');

function igdbApiBase() {
  const custom = process.env.REACT_APP_IGDB_API_BASE;
  if (custom) {
    return custom.replace(/\/$/, '');
  }
  if (process.env.NODE_ENV === 'development') {
    return '/api/igdb';
  }
  return null;
}

export function shouldUseIgdb() {
  if (process.env.REACT_APP_USE_IGDB !== 'true') {
    return false;
  }
  return igdbApiBase() != null;
}

async function igdbPost(endpoint, apicalypseBody) {
  const base = igdbApiBase();
  if (!base) {
    throw new Error('IGDB is not configured for this environment');
  }

  const { data } = await axios.post(`${base}${endpoint}`, apicalypseBody, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'text/plain',
    },
    timeout: 15_000,
  });

  return data;
}

function transformIgdbGame(game) {
  const coverId = game.cover?.image_id;
  const image = normalizeImageUrl(
    coverId ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${coverId}.jpg` : null,
  );

  const rawRating =
    game.total_rating != null
      ? game.total_rating
      : game.aggregated_rating != null
        ? game.aggregated_rating
        : game.rating;

  const rating =
    rawRating != null ? roundRatingToHalf((rawRating / 100) * 5) : roundRatingToHalf(3.5);

  const genres = (game.genres || []).map((g) => g.name).filter(Boolean);
  const genre = genres[0] || 'Unknown';

  const developer =
    (game.involved_companies || []).find((i) => i.developer)?.company?.name || 'Unknown';
  const publisher =
    (game.involved_companies || []).find((i) => i.publisher)?.company?.name || 'Unknown';

  const releaseDate = game.first_release_date
    ? new Date(game.first_release_date * 1000).toISOString().slice(0, 10)
    : null;

  const platforms = (game.platforms || []).map((p) => p.name).filter(Boolean);

  const metacritic =
    game.aggregated_rating != null ? Math.round(game.aggregated_rating) : null;

  const slug =
    game.slug ||
    (game.name
      ? game.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : '');

  const scoreForPricing = rawRating != null ? (rawRating / 100) * 10 : 6;

  const price = roundPriceUp(
    calculatePrice({
      score: scoreForPricing,
      genres: genres.map((name) => ({ name })),
      release_date: releaseDate,
    }),
  );

  const websites = game.websites || [];
  const official =
    websites.find((w) => w.category === 1) ||
    websites.find((w) => w.category === 17) ||
    websites[0];
  let website = official?.url || null;
  if (!website && game.url && typeof game.url === 'string' && game.url.startsWith('//')) {
    website = `https:${game.url}`;
  }

  const tags = (game.themes || []).map((t) => t.name).filter(Boolean);

  return {
    id: game.id,
    title: game.name,
    image,
    price,
    genre,
    genres,
    rating,
    description: game.summary || game.storyline || '',
    storyline: game.storyline || '',
    developer,
    publisher,
    releaseDate,
    platforms,
    slug,
    metacritic,
    website,
    tags,
  };
}

export const igdbService = {
  fetchPopularGames: async (offset = 0, limit = 20) => {
    const body = [
      `fields ${IGDB_LIST_FIELDS};`,
      'where category = 0 & cover != null;',
      'sort first_release_date desc;',
      `limit ${limit};`,
      `offset ${offset};`,
    ].join('\n');

    const rows = await igdbPost('/games', body);
    if (!Array.isArray(rows)) {
      throw new Error('Unexpected IGDB response');
    }
    return rows.map(transformIgdbGame);
  },

  searchGames: async (query, limit = 20) => {
    const q = (query || '').replace(/"/g, '').trim();
    if (!q) {
      return igdbService.fetchPopularGames(0, limit);
    }

    const safe = q.replace(/;/g, ' ').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    // IGDB: search cannot be combined with `where` (see api-docs.igdb.com).
    const body = [`search "${safe}";`, `fields ${IGDB_LIST_FIELDS};`, `limit ${limit};`].join('\n');

    const rows = await igdbPost('/games', body);
    if (!Array.isArray(rows)) {
      throw new Error('Unexpected IGDB response');
    }
    return rows.map(transformIgdbGame);
  },

  fetchGameById: async (id) => {
    const numericId = Number.parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      throw new Error('Game not found');
    }

    const body = [
      `fields ${IGDB_DETAIL_FIELDS};`,
      `where id = ${numericId};`,
      'limit 1;',
    ].join('\n');

    const rows = await igdbPost('/games', body);
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Game not found');
    }
    return transformIgdbGame(rows[0]);
  },

  fetchGamesByGenre: async () => {
    throw new Error('fetchGamesByGenre is not implemented for IGDB in this app');
  },

  fetchGameReviews: async () => [],

  fetchGameImages: async () => [],
};

// ——— Steam — Web API key in .env enables this provider. Catalog data comes from the public Store
// API (details + search); dev proxy: /api/steam-store → store.steampowered.com

export function shouldUseSteam() {
  return (process.env.REACT_APP_STEAM_WEB_API_KEY || '').trim().length > 0;
}

/** When true with a Steam key, Steam catalog wins over RAWG (hybrid Rawg+GameSpot still wins). */
export function preferSteamCatalog() {
  return process.env.REACT_APP_PREFER_STEAM === 'true';
}

function steamStoreBase() {
  const custom = (process.env.REACT_APP_STEAM_STORE_PROXY || '').trim();
  if (custom) {
    return custom.replace(/\/$/, '');
  }
  if (process.env.NODE_ENV === 'development') {
    return '/api/steam-store';
  }
  // Production without REACT_APP_STEAM_STORE_PROXY: direct store origin (may hit CORS in the browser).
  return 'https://store.steampowered.com';
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
    metaScore != null ? roundRatingToHalf(metaScore / 20) : roundRatingToHalf((d.recommendations?.total || 0) > 50000 ? 4 : 3.5);

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
    const numeric = Number.parseInt(String(id), 10);
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

// ——— Hybrid RAWG + GameSpot (both keys): broader catalog, deduped by title, prefixed ids.

const RAWG_ROUTE_PREFIX = 'r';
const GAMESPOT_ROUTE_PREFIX = 'g';

function withRawgRouteIds(games) {
  return games.map((g) => ({ ...g, id: `${RAWG_ROUTE_PREFIX}${g.id}` }));
}

function withGamespotRouteIds(games) {
  return games.map((g) => ({ ...g, id: `${GAMESPOT_ROUTE_PREFIX}${g.id}` }));
}

function withRawgRouteId(game) {
  return { ...game, id: `${RAWG_ROUTE_PREFIX}${game.id}` };
}

function withGamespotRouteId(game) {
  return { ...game, id: `${GAMESPOT_ROUTE_PREFIX}${game.id}` };
}

function dedupeGamesByTitle(firstList, secondList, limit) {
  const seen = new Set();
  const out = [];
  for (const game of [...firstList, ...secondList]) {
    const key = (game.title || '').toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(game);
    if (out.length >= limit) break;
  }
  return out;
}

export const hybridRawgGameSpotService = {
  fetchPopularGames: async (offset = 0, limit = 20) => {
    const half = Math.max(Math.ceil(limit / 2), 5);
    const rawgOffset = (Math.floor(offset / limit) || 0) * half;
    const [rawgRows, gsRows] = await Promise.all([
      rawgService.fetchPopularGames(rawgOffset, half).catch(() => []),
      gamespotService.fetchPopularGames(offset, half).catch(() => []),
    ]);
    const merged = dedupeGamesByTitle(
      withRawgRouteIds(rawgRows),
      withGamespotRouteIds(gsRows),
      limit,
    );
    return merged;
  },

  searchGames: async (query, limit = 20) => {
    const half = Math.max(Math.ceil(limit / 2), 5);
    const [rawgRows, gsRows] = await Promise.all([
      rawgService.searchGames(query, half).catch(() => []),
      gamespotService.searchGames(query, half).catch(() => []),
    ]);
    return dedupeGamesByTitle(
      withRawgRouteIds(rawgRows),
      withGamespotRouteIds(gsRows),
      limit,
    );
  },

  fetchGameById: async (routeId) => {
    const s = String(routeId);
    if (s.startsWith(RAWG_ROUTE_PREFIX)) {
      const inner = s.slice(RAWG_ROUTE_PREFIX.length);
      const game = await rawgService.fetchGameById(inner);
      return withRawgRouteId(game);
    }
    if (s.startsWith(GAMESPOT_ROUTE_PREFIX)) {
      const inner = s.slice(GAMESPOT_ROUTE_PREFIX.length);
      const game = await gamespotService.fetchGameById(inner);
      return withGamespotRouteId(game);
    }
    if (shouldUseRawg()) {
      try {
        const game = await rawgService.fetchGameById(s);
        return withRawgRouteId(game);
      } catch {
        /* try GameSpot */
      }
    }
    const game = await gamespotService.fetchGameById(s);
    return shouldUseGameSpot() ? withGamespotRouteId(game) : game;
  },

  fetchGamesByGenre: async (genreName, limit = 20) => {
    return gamespotService.fetchGamesByGenre(genreName, limit);
  },

  fetchGameReviews: async (gameId, limit = 10) => {
    const s = String(gameId);
    if (s.startsWith(GAMESPOT_ROUTE_PREFIX)) {
      return gamespotService.fetchGameReviews(s.slice(GAMESPOT_ROUTE_PREFIX.length), limit);
    }
    return [];
  },

  fetchGameImages: async (gameId, limit = 10) => {
    const s = String(gameId);
    if (s.startsWith(GAMESPOT_ROUTE_PREFIX)) {
      return gamespotService.fetchGameImages(s.slice(GAMESPOT_ROUTE_PREFIX.length), limit);
    }
    return [];
  },
};

function resolveGamesService() {
  if (preferSteamCatalog() && shouldUseSteam()) {
    return steamService;
  }
  if (shouldUseRawg() && shouldUseGameSpot()) {
    return hybridRawgGameSpotService;
  }
  if (shouldUseRawg()) {
    return rawgService;
  }
  if (shouldUseSteam()) {
    return steamService;
  }
  if (shouldUseIgdb()) {
    return igdbService;
  }
  return gamespotService;
}

export const gamesService = resolveGamesService();

export default gamesService;
