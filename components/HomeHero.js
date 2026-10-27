'use client';

import { useLayoutEffect, useRef } from 'react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const headlineLines = ['Technology built with communities,', 'for communities'];

export default function HomeHero({ children }) {
  const root = useRef(null);
  const accent = useRef(null);
  const lines = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion) return undefined;

    let context;
    let cancelled = false;

    import('gsap').then(({ gsap }) => {
      if (cancelled) return;

      context = gsap.context(() => {
        const timeline = gsap.timeline();

        timeline
          .set(lines.current, { opacity: 0, y: 16 })
          .set(accent.current, { scaleX: 0 })
          .to(lines.current, {
            duration: 0.56,
            ease: 'power3.out',
            opacity: 1,
            stagger: 0.06,
            y: 0,
          })
          .to(
            accent.current,
            { duration: 0.28, ease: 'power3.out', scaleX: 1 },
            '-=0.28'
          );
      }, root);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={root} className="home-hero">
      <span ref={accent} className="home-hero-accent" aria-hidden="true" />
      <h1>
        {headlineLines.map((line, index) => (
          <span className="home-hero-line" key={line}>
            <span
              className="home-hero-line-content"
              ref={(node) => {
                lines.current[index] = node;
              }}
            >
              {line}
            </span>
          </span>
        ))}
      </h1>
      {children}
    </section>
  );
}
