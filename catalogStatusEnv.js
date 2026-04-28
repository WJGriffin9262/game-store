/**
 * Node-only: whether the Steam catalog should be enabled (checks real env, not the CRA client bundle).
 * Prefer STEAM_API_KEY — not inlined into the browser by react-scripts.
 */
const STEAM_CATALOG_NODE_ENV_NAMES = [
  'STEAM_API_KEY',
  'REACT_APP_STEAM_WEB_API_KEY',
  'REACT_APP_STEAM_API_KEY',
  'NEXT_PUBLIC_STEAM_API_KEY',
];

function isSteamCatalogConfiguredInNodeEnv() {
  for (const name of STEAM_CATALOG_NODE_ENV_NAMES) {
    const raw = process.env[name];
    const trimmed = (raw != null ? String(raw) : '').trim();
    if (trimmed.length > 0) return true;
  }
  return false;
}

module.exports = { isSteamCatalogConfiguredInNodeEnv, STEAM_CATALOG_NODE_ENV_NAMES };
