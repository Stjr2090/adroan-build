'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HomeStory() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      document.documentElement.classList.add('home-story-motion');
      const wash = document.querySelector('.home-wash-light');
      const scenes = gsap.utils.toArray('.scene');
      gsap.fromTo('.hero-photo', { autoAlpha: 1 }, {
        autoAlpha: 0, ease: 'none',
        scrollTrigger: { trigger: '#landing', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-copy', { y: -16, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '#landing', start: 'top top', end: 'bottom 20%', scrub: true },
      });
      scenes.slice(1).forEach((scene, index) => {
        gsap.fromTo(wash, { opacity: index % 2 ? 1 : 0 }, {
          opacity: index % 2 ? 0 : 1, immediateRender: false, ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top 60%', scrub: true },
        });
        const targets = scene.querySelectorAll('.scene-title, .about-copy p, .pillar-card, .hinga-copy > p, .hinga-cta, .hinga-image, .team-card');
        gsap.fromTo(targets, { y: 16, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.06, ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top 60%', end: 'top 15%', scrub: true },
        });
      });
      return () => document.documentElement.classList.remove('home-story-motion');
    });
    return () => media.revert();
  }, []);
  return null;
}
