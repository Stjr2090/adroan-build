'use client';

import { useEffect } from 'react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const desktopPointerQuery = '(hover: hover) and (pointer: fine)';

function canUseSmoothScroll() {
  return (
    window.innerWidth >= 768 &&
    window.matchMedia(desktopPointerQuery).matches &&
    navigator.maxTouchPoints === 0
  );
}

export default function SmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !canUseSmoothScroll()) return undefined;

    let lenis;
    let removeTicker;
    let cancelled = false;

    Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
      .then(([lenisModule, gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;

        const Lenis = lenisModule.default;
        const gsap = gsapModule.gsap ?? gsapModule.default;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger ?? scrollTriggerModule.default;

        gsap.registerPlugin(ScrollTrigger);

        lenis = new Lenis({
          autoRaf: false,
          anchors: true,
          lerp: 0.1,
          smoothWheel: true,
          syncTouch: false,
        });

        lenis.on('scroll', ScrollTrigger.update);

        const update = (time) => lenis?.raf(time * 1000);
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);
        removeTicker = () => gsap.ticker.remove(update);
        document.documentElement.dataset.smoothScroll = 'enabled';
      })
      .catch(() => {
        // Preserve native scrolling if an optional motion dependency is unavailable.
      });

    return () => {
      cancelled = true;
      removeTicker?.();
      lenis?.destroy();
      delete document.documentElement.dataset.smoothScroll;
    };
  }, [prefersReducedMotion]);

  return null;
}
