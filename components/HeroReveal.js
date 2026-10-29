'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';

// Hero load reveal (plan #1268 Phase 2): on first load the two headline
// lines rise in one at a time, then the coral CTA draws in. Transform and
// opacity only, so there is no layout shift; the whole timeline is < 0.9s.
// Plays once per document: the module-level flag stops the reveal from
// replaying on client-side back/forward navigation within the same
// document (a full reload plays it once again, which is intended).
// No hidden state exists in CSS — the from-state is applied by JS via
// gsap.set before paint, so no-JS and reduced-motion users always see
// the final state.
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
    };
  }, []);

  return null;
}
