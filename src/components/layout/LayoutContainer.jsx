/**
 * Centered content width — pairs with .layout-container in global styles.
 */
export default function LayoutContainer({ children, className = '', narrow = false }) {
  const mods = ['layout-container', narrow ? 'layout-container--narrow' : '', className]
    .filter(Boolean)
    .join(' ');

  return <div className={mods}>{children}</div>;
}
