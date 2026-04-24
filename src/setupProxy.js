/**
 * Dev-only: IGDB does not allow browser requests (CORS + OAuth). Proxies /api/igdb → api.igdb.com/v4
 * and injects Twitch Client Credentials. Requires TWITCH_CLIENT_ID + TWITCH_CLIENT_SECRET in .env
 * (do not use REACT_APP_ prefix for the secret — it must not ship to the client bundle).
 */
const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');

let tokenCache = { access_token: null, expires_at: 0 };

async function getTwitchToken() {
  const now = Date.now();
  if (tokenCache.access_token && tokenCache.expires_at > now + 60_000) {
    return tokenCache.access_token;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return null;
  }

  try {
    const { data } = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 12_000,
      },
    );

    if (!data.access_token) {
      return null;
    }

    tokenCache = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in || 3600) * 1000,
    };
    return tokenCache.access_token;
  } catch (err) {
    console.warn('[setupProxy] Twitch OAuth failed:', err.message);
    return null;
  }
}

module.exports = function setupProxy(app) {
  app.use('/api/igdb', async (req, res, next) => {
    try {
      req.igdbAccessToken = await getTwitchToken();
      next();
    } catch (err) {
      next(err);
    }
  });

  app.use(
    '/api/igdb',
    createProxyMiddleware({
      target: 'https://api.igdb.com',
      changeOrigin: true,
      pathRewrite: { '^/api/igdb': '/v4' },
      onProxyReq(proxyReq, req) {
        const clientId = process.env.TWITCH_CLIENT_ID;
        const token = req.igdbAccessToken;
        if (clientId && token) {
          proxyReq.setHeader('Client-ID', clientId);
          proxyReq.setHeader('Authorization', `Bearer ${token}`);
          proxyReq.setHeader('Accept', 'application/json');
        }
      },
      logLevel: 'warn',
    }),
  );

  // Steam Store JSON (app details + search) — avoids browser CORS on store.steampowered.com in dev.
  app.use(
    '/api/steam-store',
    createProxyMiddleware({
      target: 'https://store.steampowered.com',
      changeOrigin: true,
      pathRewrite: { '^/api/steam-store': '' },
      logLevel: 'warn',
    }),
  );
};
