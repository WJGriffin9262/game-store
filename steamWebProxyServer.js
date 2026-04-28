/**
 * Relay to https://api.steampowered.com with `key` from server env only (never the browser bundle).
 */
const axios = require('axios');

const STEAM_WEB_API_BASE = 'https://api.steampowered.com';

const STEAM_KEY_ENV_NAMES = [
  'STEAM_API_KEY',
  'REACT_APP_STEAM_WEB_API_KEY',
  'REACT_APP_STEAM_API_KEY',
  'NEXT_PUBLIC_STEAM_API_KEY',
];

function resolveSteamWebApiKey(env) {
  const e = env || process.env;
  for (const name of STEAM_KEY_ENV_NAMES) {
    const t = (e[name] != null ? String(e[name]) : '').trim();
    if (t.length > 0) return t;
  }
  return null;
}

/**
 * @param {string} raw from query path=… (e.g. ISteamNews/GetNewsForApp/v2)
 */
function sanitizeSteamWebPath(raw) {
  if (raw == null || typeof raw !== 'string') return null;
  const s = raw.trim().replace(/^\/+/, '').split('?')[0];
  if (!s || s.includes('..') || /[\s<>"'`]/.test(s)) return null;
  if (!/^I[A-Za-z0-9_]+(?:\/[A-Za-z0-9_.]+)+\/?$/.test(s)) return null;
  return s.replace(/\/$/, '');
}

function firstQueryValue(raw) {
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

async function relaySteamWebApiRequest(opts) {
  const query = opts.query || {};
  const pv = firstQueryValue(query.path);
  const pathSeg = sanitizeSteamWebPath(String(pv != null ? pv : ''));
  if (!pathSeg) {
    const err = new Error('Invalid or missing path');
    err.statusCode = 400;
    throw err;
  }

  const key = resolveSteamWebApiKey(opts.env);
  if (!key) {
    const err = new Error('Steam Web API key not configured (set STEAM_API_KEY on the server)');
    err.statusCode = 503;
    throw err;
  }

  const target = new URL(`${STEAM_WEB_API_BASE}/${pathSeg}`);
  const skip = new Set(['path', 'key']);
  for (const [k, val] of Object.entries(query)) {
    if (skip.has(k)) continue;
    if (val == null) continue;
    if (Array.isArray(val)) {
      val.forEach((v) => {
        if (v != null) target.searchParams.append(k, String(v));
      });
    } else {
      target.searchParams.set(k, String(val));
    }
  }
  target.searchParams.set('key', key);
  if (!target.searchParams.has('format')) {
    target.searchParams.set('format', 'json');
  }

  const method = String(opts.method || 'GET').toUpperCase();

  try {
    const r = await axios.request({
      method,
      url: target.toString(),
      timeout: 25_000,
      validateStatus: () => true,
    });

    const body = r.data;
    const rawCt = r.headers['content-type'];
    const contentType =
      typeof body === 'object' && body !== null
        ? 'application/json; charset=utf-8'
        : typeof rawCt === 'string'
          ? rawCt
          : 'application/json; charset=utf-8';

    return { status: r.status, body, contentType };
  } catch (e) {
    const err = new Error(e.message || 'Steam Web API request failed');
    err.statusCode = 502;
    throw err;
  }
}

async function handleSteamWebProxy(req, res, env) {
  const effectiveEnv = env != null ? env : process.env;
  try {
    if ((req.method || 'GET') !== 'GET' && req.method !== 'HEAD') {
      res.status(405).setHeader('Allow', 'GET, HEAD').end();
      return;
    }

    let query = {};
    if (typeof req.query === 'object' && req.query && Object.keys(req.query).length > 0) {
      query = req.query;
    } else if (typeof req.url === 'string') {
      const parsed = new URL(req.url, 'http://steam.proxy.local');
      parsed.searchParams.forEach((value, key) => {
        if (query[key] === undefined) {
          query[key] = value;
        } else if (Array.isArray(query[key])) {
          query[key].push(value);
        } else {
          query[key] = [query[key], value];
        }
      });
    }

    const { status, body, contentType } = await relaySteamWebApiRequest({
      query,
      method: req.method || 'GET',
      env: effectiveEnv,
    });

    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.status(typeof status === 'number' ? status : 200);

    if (typeof body === 'string' || body instanceof Buffer) {
      res.send(body);
    } else if (typeof body === 'object' && body !== null) {
      res.json(body);
    } else {
      res.end();
    }
  } catch (e) {
    const code = e.statusCode && typeof e.statusCode === 'number' ? e.statusCode : 500;
    res.status(code).json({ error: typeof e.message === 'string' ? e.message : 'Steam Web API proxy error' });
  }
}

module.exports = {
  sanitizeSteamWebPath,
  resolveSteamWebApiKey,
  relaySteamWebApiRequest,
  handleSteamWebProxy,
  STEAM_KEY_ENV_NAMES,
};
