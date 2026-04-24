/** Branding and small formatting helpers shared across the app. */
export const APP_NAME = 'Gaming Odyssey';
export const SUPPORT_EMAIL = 'support@gamingodyssey.com';

/** Inline SVG so images never 404 when the API omits art or CDN fails (no public/ file needed). */
export const PLACEHOLDER_GAME_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect fill="#1e293b" width="800" height="450"/><path fill="#334155" d="M120 280 L320 120 L520 300 L680 160 L680 330 L120 330 Z"/><circle fill="#475569" cx="620" cy="110" r="36"/><text x="400" y="400" text-anchor="middle" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="22">No cover image</text></svg>',
)}`;

/**
 * Use when an img fails to load: swap once to placeholder and stop the error loop.
 */
export function handleGameImageError(event) {
  const el = event.currentTarget;
  el.onerror = null;
  el.src = PLACEHOLDER_GAME_IMAGE;
}

export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncateText(text, length = 100) {
  const s = text == null ? '' : String(text);
  if (s.length <= length) return s;
  return `${s.substring(0, length)}...`;
}
