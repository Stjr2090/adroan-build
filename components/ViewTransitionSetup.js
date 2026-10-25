'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ViewTransitionSetup() {
  const pathname = usePathname();
  const prevPathname = useRef(null);

  useEffect(() => {
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    if (
      typeof document !== 'undefined' &&
      typeof document.startViewTransition === 'function'
    ) {
      const prefersReducedMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        document.startViewTransition(() => {});
      }
    }
  }, [pathname]);

  return null;
}
