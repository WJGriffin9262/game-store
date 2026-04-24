import { useEffect, useRef } from 'react';

/**
 * Re-triggers the route outlet enter animation on pathname changes (skips the first paint).
 */
export function useRouteOutletAnimation(pathname) {
  const outletRef = useRef(null);
  const skipFirstPaintRef = useRef(true);

  useEffect(() => {
    if (skipFirstPaintRef.current) {
      skipFirstPaintRef.current = false;
      return undefined;
    }
    const el = outletRef.current;
    if (!el) return undefined;
    el.classList.remove('app__outlet--animating');
    const id = requestAnimationFrame(() => {
      void el.offsetWidth;
      el.classList.add('app__outlet--animating');
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return outletRef;
}
