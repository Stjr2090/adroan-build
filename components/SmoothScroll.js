'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { lenisRef } from '@/lib/lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touch = window.matchMedia('(pointer: coarse)');
    let lenis;
    let rafId;
    const stop = () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = null;
      lenisRef.current = null;
    };
    const sync = () => {
      stop();
      if (reduced.matches || touch.matches) return;
      lenis = new Lenis({ duration: 0.85, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenisRef.current = lenis;
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    };
    sync();
    reduced.addEventListener('change', sync);
    touch.addEventListener('change', sync);
    return () => {
      reduced.removeEventListener('change', sync);
      touch.removeEventListener('change', sync);
      stop();
    };
  }, []);
  return null;
}
