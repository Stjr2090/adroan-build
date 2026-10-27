'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function readPreference() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

/**
 * Tracks the visitor's reduced-motion preference and updates live when it
 * changes. Every motion phase reads this so motion can be switched off.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(readPreference);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;

    const media = window.matchMedia(QUERY);
    const update = () => setReduced(media.matches);

    update();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return reduced;
}

export default usePrefersReducedMotion;
