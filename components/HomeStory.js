'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scroll story for the homepage (wireframe v3 + brief #1319):
// - Landing photo opacity is scrubbed with scroll: fully visible at the top,
//   faded out as the About wash approaches, faded back in on the way up.
// - The HINGA card copy morphs in (scrubbed) as the Projects scene darkens.
// Under prefers-reduced-motion nothing is animated: the final state stands.
export default function HomeStory() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const photo = document.querySelector('.hero-photo');
    if (photo) {
      gsap.fromTo(
        photo,
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#landing',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }

    const hingaCopy = document.querySelector('.hinga-copy');
    if (hingaCopy) {
      gsap.fromTo(
        hingaCopy,
        { y: 16, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#projects',
            start: 'top 80%',
            end: 'top 30%',
            scrub: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.set(['.hero-photo', '.hinga-copy'], { clearProps: 'all' });
    };
  }, []);

  return null;
}
