'use client';

import { useEffect, useState } from 'react';

const query = '(prefers-reduced-motion: reduce)';

function getPreference() {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : true;
}

export default function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(query);
    if (!mediaQuery) return undefined;

    const updatePreference = () => setPrefersReducedMotion(getPreference());
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  return prefersReducedMotion;
}
