'use client';

import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const beats = ['People', 'Problem', 'Idea'];

export default function HingaStoryScroll() {
  const root = useRef(null);
  const card = useRef(null);
  const beatRefs = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || window.innerWidth < 768) return undefined;

    let active = true;
    let context;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([gsapModule, scrollTriggerModule]) => {
        if (!active) return;

        const { gsap } = gsapModule;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        context = gsap.context(() => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top+=96',
              end: '+=200%',
              scrub: true,
              pin: card.current,
              anticipatePin: 1,
            },
          });

          timeline.set(beatRefs.current, { opacity: 0.3, y: 16 });
          beatRefs.current.forEach((beat) => {
            timeline.to(beat, { duration: 1, ease: 'none', opacity: 1, y: 0 });
          });
        }, root);
      })
      .catch(() => {
        // Native, fully readable content remains available when motion cannot load.
      });

    return () => {
      active = false;
      context?.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={root} className="hinga-story" aria-labelledby="hinga-story-title">
      <div ref={card} className="hinga-story-card">
        <p className="hinga-story-kicker">The HINGA story</p>
        <h2 id="hinga-story-title">Agricultural guidance in farmers&apos; languages</h2>
        <div className="hinga-story-beats">
          {beats.map((beat, index) => (
            <div
              className="hinga-story-beat"
              key={beat}
              ref={(node) => {
                beatRefs.current[index] = node;
              }}
            >
              <span>0{index + 1}</span>
              <h3>{beat}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
