'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Three approved passages; scoped cleanup restores the readable static layout.

const BEATS = [
  {
    label: 'People',
    text: 'Connecting agriculture, from farmers to markets.',
  },
  {
    label: 'Problem',
    text: "HINGA's first version gives farmers a way to ask questions about farming. Its next direction is agricultural data: helping farmers connect with one another and closing the loop between the farm end of the value chain and the exporters and buyers at the other end.",
  },
  {
    label: 'Idea',
    text: 'The aim is to bring people across that chain closer together, starting with the farmers whose work underpins it.',
  },
];

export default function HingaStory() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const beatsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const beats = beatsRef.current.filter(Boolean);
    if (!section || !card || beats.length !== BEATS.length) {
      // Markup anomaly: never leave the hidden-state class behind.
      document.documentElement.classList.remove('js-hinga-story');
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let context = null;

    const teardown = () => {
      if (context) {
        const current = context;
        context = null;
        // Always revert this context, including on route unmount, so its
        // ScrollTrigger cannot survive detached markup.
        current.revert();
      }
      document.documentElement.classList.remove('js-hinga-story');
    };

    const setup = () => {
      document.documentElement.classList.add('js-hinga-story');
      const [first, second, third] = beats;
      context = gsap.context(() => {
        // From-states must match the CSS gate exactly, so first paint
        // and first scrub frame are the same frame.
        gsap.set([second, third], { autoAlpha: 0, y: 16 });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=300%',
            scrub: true,
            pin: card,
            anticipatePin: 1,
          },
        });
        // People out, Problem in (overlapping crossfade).
        timeline.to(
          first,
          { autoAlpha: 0, y: -16, duration: 1, ease: 'none' },
          0.35
        );
        timeline.to(
          second,
          { autoAlpha: 1, y: 0, duration: 1, ease: 'none' },
          0.75
        );
        // Problem out, Idea in.
        timeline.to(
          second,
          { autoAlpha: 0, y: -16, duration: 1, ease: 'none' },
          1.35
        );
        timeline.to(
          third,
          { autoAlpha: 1, y: 0, duration: 1, ease: 'none' },
          1.75
        );
        // Idea holds, fully readable, until the pin releases.
      }, section);
    };

    if (reduceQuery.matches) {
      // Static card; leave no hidden state behind.
      teardown();
    } else {
      setup();
    }

    const onReduceChange = (event) => {
      if (event.matches) {
        // Motion turned off mid-scroll: unpin and settle immediately on
        // the static, fully readable card.
        teardown();
      } else {
        // Motion back on: re-arm the pin. The scrub is a pure function
        // of scroll position, so it settles wherever the user is.
        setup();
      }
    };
    reduceQuery.addEventListener('change', onReduceChange);

    return () => {
      reduceQuery.removeEventListener('change', onReduceChange);
      teardown();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hinga-story" aria-label="The HINGA story">
      <div ref={cardRef} className="hinga-story-card">
        <div className="hinga-beats">
          {BEATS.map((beat, index) => (
            <div
              key={beat.label}
              className={`hinga-beat${index === 0 ? ' hinga-beat--first' : ''}`}
              ref={(node) => {
                beatsRef.current[index] = node;
              }}
            >
              <p className="hinga-beat-label">{beat.label}</p>
              <p className="hinga-beat-text">{beat.text}</p>
            </div>
          ))}
        </div>

        <div className="hinga-story-side">
          <figure
            className="hinga-chart"
            role="img"
            aria-label="Chart placeholder"
          >
            <div className="hinga-chart-bars" aria-hidden="true">
              <span className="hinga-chart-bar" />
              <span className="hinga-chart-bar hinga-chart-bar--mid" />
              <span className="hinga-chart-bar hinga-chart-bar--short" />
            </div>
            <figcaption>chart</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
