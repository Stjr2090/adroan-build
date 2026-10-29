'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';

// Hero load reveal (plan #1268 Phase 2): on first load the two headline
// lines rise in one at a time, then the coral CTA draws in. Transform and
// opacity only, so there is no layout shift; the whole timeline is < 0.9s.
// Plays once per document: the module-level flag stops the reveal from
// replaying on client-side back/forward navigation within the same
// document (a full reload plays it once again, which is intended).
// The hidden start state lives in home.css under html.js-hero, a class an
// inline script in page.js adds synchronously during HTML parsing — before
// first paint — so there is no flash of the SSR-painted final state.
// No-JS users (no class) and reduced-motion users (media override) always
// see the final state. GSAP animates from the same 24px/16px from-states,
// and onComplete removes js-hero so the settled hero is plain markup/CSS:
// back/forward navigation shows the final state without replaying.
let heroPlayed = false;

export default function HeroReveal() {
  useLayoutEffect(() => {
    if (heroPlayed) {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Nothing to replay: under reduced motion the final state stands.
      return undefined;
    }

    const lines = [
      document.querySelector('.hero-line'),
      document.querySelectorAll('.hero-line')[1],
    ];
    const button = document.querySelector('.hero-copy .button');
    if (!lines[0] || !lines[1] || !button) {
      return undefined;
    }

    // Set the from-states synchronously before building the timeline so
    // there is no flash of the final state (useLayoutEffect: pre-paint).
    gsap.set(lines[0], { y: 24, opacity: 0 });
    gsap.set(lines[1], { y: 24, opacity: 0 });
    gsap.set(button, { y: 16, opacity: 0 });

    const timeline = gsap.timeline({ paused: false });

    timeline.to(lines[0], {
      y: 0,
      opacity: 1,
      duration: 0.42,
      ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
    });
    // Line 2 starts at 0.1, while line 1 is still finishing (stagger).
    timeline.to(
      lines[1],
      {
        y: 0,
        opacity: 1,
        duration: 0.42,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      0.1
    );
    timeline.to(
      button,
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      0.38
    );

    // When the reveal finishes, drop the hidden-state class so the final
    // state lives in plain CSS/markup for the rest of the document's life
    // (back/forward navigation then shows the settled hero without replay).
    timeline.eventCallback('onComplete', () => {
      document.documentElement.classList.remove('js-hero');
    });

    heroPlayed = true;

    return () => {
      timeline.kill();
      // Guard the reset with a live-node check: on client-side navigation
      // the old page's nodes are already gone when this runs, and
      // re-selecting by class would only log a "target not found" warning.
      const targets = [...lines, button].filter(
        (el) => el && el.isConnected
      );
      if (targets.length) {
        gsap.set(targets, { clearProps: 'all' });
      }
      // Cover a mid-animation unmount (e.g. navigating away during the
      // 0.78s reveal): never leave the hidden-state class behind.
      document.documentElement.classList.remove('js-hero');
    };
  }, []);

  return null;
}
