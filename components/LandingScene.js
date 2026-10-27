'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

/**
 * Landing scene (brief #1319): dark scene, full-bleed photo whose opacity is
 * scrubbed by scroll progress. Reduced motion keeps the photo still, and
 * switching the preference mid-session tears the scrub down.
 */
export default function LandingScene({ title, intro, children }) {
  const sectionRef = useRef(null);
  const photoRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    if (!section || !photo || reducedMotion) return undefined;

    let cancelled = false;
    let revert = () => {};

    const setup = async () => {
      const [gsapModule, triggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled) return;

      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.fromTo(
        photo,
        { opacity: 1 },
        {
          opacity: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom 60%',
            scrub: true,
          },
        }
      );

      revert = () => {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(photo, { clearProps: 'opacity' });
      };
    };

    setup();

    return () => {
      cancelled = true;
      revert();
    };
  }, [reducedMotion]);

  return (
    <section className="landing" ref={sectionRef} aria-labelledby="landing-title">
      <div className="landing-photo" ref={photoRef} aria-hidden="true">
        <Image
          src="/landing/kampala-golden-hour.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="landing-photo-img"
        />
      </div>

      <div className="landing-inner container">
        <h1 className="landing-title" id="landing-title">
          {title}
        </h1>
        <p className="landing-intro">{intro}</p>
        {children}
      </div>
    </section>
  );
}
