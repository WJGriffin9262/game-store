/**
 * Dev-only: Steam Store JSON is blocked by browser CORS. Proxies /api/steam-store → store.steampowered.com
 */
const { createProxyMiddleware } = require('http-proxy-middleware');
const { isSteamCatalogConfiguredInNodeEnv } = require('../catalogStatusEnv');
const { handleSteamWebProxy } = require('../steamWebProxyServer');

module.exports = function setupProxy(app) {
  app.get('/api/catalog-status', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json({ enabled: isSteamCatalogConfiguredInNodeEnv() });
  });

  app.get('/api/steam-web', (req, res) => handleSteamWebProxy(req, res));

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
