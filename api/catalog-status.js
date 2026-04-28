const { isSteamCatalogConfiguredInNodeEnv } = require('../catalogStatusEnv');

/**
 * GET /api/catalog-status → { "enabled": boolean }
 * Reads STEAM_API_KEY (and legacy names) only on the server — never sent to the client bundle.
 */
module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).setHeader('Allow', 'GET').end();
    return;
  }
  const enabled = isSteamCatalogConfiguredInNodeEnv();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json({ enabled });
};
