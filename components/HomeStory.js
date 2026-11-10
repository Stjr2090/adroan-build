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
      const layers = gsap.utils.toArray('.wash-layer');
      const scenes = gsap.utils.toArray('.scene');
      const publish = (id) => window.dispatchEvent(new CustomEvent('adroan:scene', { detail: id }));
      gsap.fromTo('.hero-photo', { autoAlpha: 1 }, {
        autoAlpha: 0, ease: 'none',
        scrollTrigger: { trigger: '#landing', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-copy', { y: -16, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '#landing', start: 'top top', end: 'bottom 20%', scrub: true },
      });
      scenes.slice(1).forEach((scene, index) => {
        // Each scene's own approved gradient rides in as one fixed layer,
        // covering the layer below it; the layers never merge.
        gsap.fromTo(layers[index + 1], { opacity: 0 }, {
          opacity: 1, immediateRender: false, ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top 60%', scrub: true },
        });
        const targets = scene.querySelectorAll('.scene-title, .about-copy p, .pillar-card, .hinga-copy > p, .hinga-cta, .hinga-image, .team-card');
        gsap.fromTo(targets, { y: 16, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.06, ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top 60%', end: 'top 15%', scrub: true },
        });
        // Publish the scene on the same frame the wash lands: the same
        // "top 60%" edge the gradient uses, in both scroll directions.
        ScrollTrigger.create({
          trigger: scene,
          start: 'top 60%',
          end: 'bottom top',
          onEnter: () => publish(scene.id),
          onLeaveBack: () => publish(scenes[index].id),
        });
      });
      return () => document.documentElement.classList.remove('home-story-motion');
    });
    return () => media.revert();
  }, []);
  return null;
}
