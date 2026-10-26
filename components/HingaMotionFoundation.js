'use client';

import { useEffect } from 'react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

export default function HingaMotionFoundation() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    let mounted = true;

    Promise.all([import('gsap'), import('lenis')])
      .then(() => {
        if (!mounted) return;
        // Phase 0 intentionally establishes route-scoped loading only.
      })
      .catch(() => {
        // A later motion phase can surface route-specific load errors.
      });

    return () => {
      mounted = false;
    };
  }, [prefersReducedMotion]);

  return null;
}
