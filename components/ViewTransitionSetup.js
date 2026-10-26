'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const THEMED_PATH = '/hinga';

export default function ViewTransitionSetup() {
  const pathname = usePathname();
  const prevPathname = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
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
      if (prefersReducedMotion) return;

      // Theme-change curtain: entering /hinga sweeps the HINGA-themed page
      // in from the top; leaving sweeps it out upward. The curtain styling
      // is keyed off data-theme-wipe in app/page-transitions.css; the
      // attribute is removed as soon as the transition finishes.
      // Same-palette navigations keep the plain 180ms cross-fade.
      if (pathname === THEMED_PATH) {
        root.setAttribute('data-theme-wipe', 'hinga');
      } else if (root.hasAttribute('data-theme-wipe')) {
        root.setAttribute('data-theme-wipe', 'adroan');
      } else {
        root.removeAttribute('data-theme-wipe');
      }

      const transition = document.startViewTransition(() => {});
      transition.finished.finally(() => root.removeAttribute('data-theme-wipe'));
    }
  }, [pathname, prefersReducedMotion]);

  return null;
}
