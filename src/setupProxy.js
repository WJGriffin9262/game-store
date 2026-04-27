/**
 * Dev-only: Steam Store JSON is blocked by browser CORS. Proxies /api/steam-store → store.steampowered.com
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
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
