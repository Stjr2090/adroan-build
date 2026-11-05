'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { publishHomeScene } from '@/lib/home-scene';

export default function HomeStory() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const root = document.documentElement;
      root.classList.add('home-story-motion');
      const layers = gsap.utils.toArray('.wash-layer');
      const scenes = gsap.utils.toArray('.scene');
      const groups = scenes.slice(1).map(scene => scene.querySelectorAll('.scene-title, .about-copy p, .pillar-card, .hinga-copy > p, .hinga-cta, .hinga-image, .team-card'));
      const clamp = gsap.utils.clamp(0, 1);
      const ease = gsap.parseEase('power2.out');
      let active;
      // A single scroll clock drives every wash, reveal, and header scene.
      const render = () => {
        const height = window.innerHeight;
        let next = 'landing';
        scenes.slice(1).forEach((scene, index) => {
          const top = scene.getBoundingClientRect().top;
          const wash = clamp((height * .45 - top) / (height * .25));
          gsap.set(layers[index + 1], { opacity: wash });
          if (wash === 1) next = scene.id;
          const reveal = ease(clamp((height * .50 - top) / (height * .30)));
          // Keep text opaque: movement supplies the reveal without grey copy.
          gsap.set(groups[index], { y: 16 * (1 - reveal), opacity: 1 });
        });
        const landing = scenes[0].getBoundingClientRect();
        const progress = clamp(-landing.top / landing.height);
        gsap.set('.hero-photo', { opacity: 1 - progress });
        gsap.set('.hero-copy', { y: -16 * progress, opacity: 1 - clamp(progress / .8) });
        if (next !== active) {
          active = next;
          publishHomeScene(next);
        }
      };
      const clock = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: render, onRefresh: render });
      render();
      return () => {
        clock.kill();
        root.classList.remove('home-story-motion');
        gsap.set([...layers, ...groups.flatMap(group => Array.from(group)), document.querySelector('.hero-photo'), document.querySelector('.hero-copy')], { clearProps: 'opacity,transform' });
      };
    });
    return () => media.revert();
  }, []);
  return null;
}
