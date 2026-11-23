'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// HINGA page story: the same system the homepage uses, scoped to /hinga.
// Load reveal for the hero lines + CTA (plays once per document), then the
// scroll story: one fixed wash layer per scene, staggered section reveals,
// and scene publishes on the wash frame so the header dots track the page.
// Transform and opacity only. Static base (no JS / reduced motion) shows the
// settled state: the hidden start states live under html.js-hinga, a class
// the inline script in page.js adds during HTML parsing (pre-paint); the
// effect clears it whenever the reveal does not run.

let heroPlayed = false;

export default function HingaScenes() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero load reveal -------------------------------------------------
    const lines = gsap.utils.toArray('.hinga-hero-line');
    const heroButton = document.querySelector('.hinga-hero-copy .hinga-button');
    if (!heroPlayed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroPlayed = true;
      if (lines.length && heroButton) {
        gsap.set(lines, { y: 24, opacity: 0 });
        gsap.set(heroButton, { y: 16, opacity: 0 });
        const timeline = gsap.timeline();
        timeline.to(lines, {
          y: 0,
          opacity: 1,
          duration: 0.42,
          stagger: 0.1,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        });
        timeline.to(
          heroButton,
          { y: 0, opacity: 1, duration: 0.4, ease: 'cubic-bezier(0.22, 1, 0.36, 1)' },
          0.38
        );
        timeline.eventCallback('onComplete', () => {
          document.documentElement.classList.remove('js-hinga');
        });
        // A live reduce flip mid-reveal jumps straight to the final state.
        const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onReduceChange = (event) => {
          if (event.matches) timeline.progress(1);
        };
        reduceQuery.addEventListener('change', onReduceChange);
      } else {
        document.documentElement.classList.remove('js-hinga');
      }
    } else {
      document.documentElement.classList.remove('js-hinga');
    }

    // --- Scroll story (motion mode only) ---------------------------------
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      document.documentElement.classList.add('hinga-story-motion');
      const layers = gsap.utils.toArray('.hinga-wash .wash-layer');
      const scenes = gsap.utils.toArray('.hinga-scene');
      const publish = (id) =>
        window.dispatchEvent(new CustomEvent('adroan:scene', { detail: id }));
      gsap.fromTo('.hinga-hero-photo', { autoAlpha: 1 }, {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#hinga-hero', start: 'top top', end: 'bottom 45%', scrub: true },
      });
      gsap.to('.hinga-hero-copy', {
        y: -16,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#hinga-hero', start: 'top top', end: 'bottom 55%', scrub: true },
      });
      scenes.slice(1).forEach((scene, index) => {
        gsap.fromTo(layers[index + 1], { opacity: 0 }, {
          opacity: 1,
          immediateRender: false,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top 72%', end: 'top 45%', scrub: true },
        });
        const targets = scene.querySelectorAll(
          '.hinga-scene-title, .hinga-copy > p, .hinga-panel, .hinga-trace-photo, .hinga-cta-row > *, .hinga-signup-card'
        );
        gsap.fromTo(targets, { y: 16, opacity: 0 }, {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top 40%', end: 'top 12%', scrub: true },
        });
        ScrollTrigger.create({
          trigger: scene,
          start: 'top 40%',
          end: 'bottom top',
          onEnter: () => publish(scene.id),
          onLeaveBack: () => publish(scenes[index].id),
        });
      });
      return () => document.documentElement.classList.remove('hinga-story-motion');
    });

    return () => {
      media.revert();
      const heroTargets = [...lines, heroButton].filter((el) => el && el.isConnected);
      if (heroTargets.length) gsap.set(heroTargets, { clearProps: 'all' });
      document.documentElement.classList.remove('js-hinga');
    };
  }, []);

  return null;
}
