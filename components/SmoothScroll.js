'use client';

import { useEffect } from 'react';
import { easeFluid } from '@/lib/motion';

/* Lenis runs on desktop pointers only; touch devices keep native scrolling. */
const DESKTOP_QUERY = '(min-width: 1024px) and (pointer: fine)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Smooth scroll engine. GSAP and Lenis are imported on demand, only when the
 * visitor gets smooth scrolling, and Lenis is driven by GSAP's ticker so
 * ScrollTrigger reads the smoothed positions.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia(REDUCED_QUERY);

    let destroyed = false;
    let lenis = null;
    let ticker = null;
    let onScroll = null;
    let gsap = null;

    const stop = () => {
      if (gsap && ticker) gsap.ticker.remove(ticker);
      if (lenis && onScroll) lenis.off('scroll', onScroll);
      if (lenis) lenis.destroy();

      lenis = null;
      ticker = null;
      onScroll = null;
      gsap = null;
      document.documentElement.classList.remove('has-smooth-scroll');
    };

    const start = async () => {
      if (destroyed || lenis) return;
      if (!desktop.matches || reduced.matches) return;

      const [lenisModule, gsapModule, triggerModule] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (destroyed || lenis) return;

      const Lenis = lenisModule.default;
      const { gsap: gsapInstance } = gsapModule;
      const { ScrollTrigger } = triggerModule;

      gsapInstance.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.1,
        easing: easeFluid,
      });

      onScroll = () => ScrollTrigger.update();
      lenis.on('scroll', onScroll);

      ticker = (time) => lenis.raf(time * 1000);
      gsapInstance.ticker.add(ticker);
      gsapInstance.ticker.lagSmoothing(0);

      gsap = gsapInstance;
      document.documentElement.classList.add('has-smooth-scroll');
    };

    const sync = () => {
      stop();
      start();
    };

    start();
    desktop.addEventListener('change', sync);
    reduced.addEventListener('change', sync);

    return () => {
      destroyed = true;
      desktop.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
      stop();
    };
  }, []);

  return null;
}
