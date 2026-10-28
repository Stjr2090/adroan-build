'use client';

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { lenisRef } from '@/lib/lenis';
import './site-header.css';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
];

const LIGHT_SCENES = ['about', 'team', 'contact'];

// Normalise a pathname to a scene id: '/contact' -> 'contact', '/' -> 'landing'.
const sceneFromPath = (path) =>
  path === '/' ? 'landing' : path.replace(/^\//, '');

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const reducedMotion = useReducedMotion();

  // Scene: which of the four homepage scenes (or separate page) owns the
  // viewport middle. Initial value matches the SSR attributes in layout.js;
  // separate pages get their scene from the pathname on first mount.
  const [scene, setScene] = useState('landing');
  const [scrolled, setScrolled] = useState(false);
  const [wide, setWide] = useState(false);

  const [dotActive, setDotActive] = useState(null);

  // --- Phased pill morph (Phase 4) -----------------------------------
  // Idle dot -> dot stretches into the pill shell -> label wipes in across
  // two pill widths with a short character stagger -> scene colour settles.
  // Widths are measured live and passed to the CSS keyframes as custom
  // properties; the colour cross-fade happens underneath on the same 400 ms
  // timeline so the scene palette never jumps.
  const [exitingId, setExitingId] = useState(null);
  const [pillWidths, setPillWidths] = useState({});
  const exitTimer = useRef(null);
  const prevActive = useRef(null);
  const itemRefs = useRef({});
  const sizerRefs = useRef({});

  const dotsMode = isHome ? !(scene === 'landing' && wide) : true;

  // When the active scene changes, the pill that is leaving retracts to an
  // idle dot for one beat while the incoming dot runs the full morph.
  useLayoutEffect(() => {
    if (reducedMotion) {
      prevActive.current = dotActive;
      return undefined;
    }
    const prev = prevActive.current;
    if (prev && prev !== dotActive) {
      setExitingId(prev);
      clearTimeout(exitTimer.current);
      exitTimer.current = setTimeout(() => setExitingId(null), 220);
    }
    prevActive.current = dotActive;
    return () => clearTimeout(exitTimer.current);
  }, [dotActive, reducedMotion]);

  // Measure the two pill widths for every dot before paint so the keyframes
  // have the right targets from the first frame of a morph.
  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const measure = () => {
      const next = {};
      SECTIONS.forEach((section) => {
        const pill = itemRefs.current[section.id];
        const sizer = sizerRefs.current[section.id];
        const dot = pill && pill.querySelector('.dot');
        // Skip while a dot is hidden (names mode), unstyled, or squeezed by
        // an in-flight width animation: a bad sample poisons the idle width.
        if (
          !pill ||
          !dot ||
          !sizer ||
          sizer.offsetWidth <= 0 ||
          dot.offsetWidth < 9 ||
          getComputedStyle(pill).display === 'none'
        ) {
          return;
        }
        const cs = getComputedStyle(pill);
        const idle =
          parseFloat(cs.paddingLeft) +
          parseFloat(cs.paddingRight) +
          dot.offsetWidth;
        const gap = parseFloat(cs.columnGap) || 0;
        next[section.id] = {
          idle: `${Math.round(idle)}px`,
          early: `${Math.round(idle + (gap + sizer.offsetWidth) * 0.55)}px`,
          final: `${Math.round(idle + gap + sizer.offsetWidth)}px`,
        };
      });
      setPillWidths((prev) => {
        const same =
          Object.keys(next).length === SECTIONS.length &&
          SECTIONS.every(
            (s) =>
              prev[s.id] &&
              prev[s.id].idle === next[s.id].idle &&
              prev[s.id].early === next[s.id].early &&
              prev[s.id].final === next[s.id].final
          );
        return same ? prev : next;
      });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts.ready.then(measure).catch(() => {});
    return () => window.removeEventListener('resize', measure);
  }, [dotsMode, scene, reducedMotion]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 48rem)');
    setWide(mq.matches);
    const onMq = (event) => setWide(event.matches);
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      // Separate pages: fixed scene, no active section.
      setScene(sceneFromPath(pathname));
      setDotActive(null);
      return undefined;
    }
    const ids = ['landing', ...SECTIONS.map((section) => section.id)];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element) => element);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setScene(id);
            setDotActive(id === 'landing' ? null : id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [isHome, pathname]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-scene', scene);
    root.setAttribute('data-theme', LIGHT_SCENES.includes(scene) ? 'light' : 'dark');
    root.setAttribute('data-scrolled', scrolled ? '1' : '0');
    root.setAttribute('data-strip', isHome && scene === 'landing' && wide ? 'names' : 'dots');
  }, [scene, scrolled, isHome, wide, pathname]);

  const scrollToSection = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.1 });
    } else {
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const sectionHref = (id) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          Adroan
        </Link>

        <nav className="nav-strip" aria-label="Main navigation">
          {/* Hidden sizers: the label widths used by the pill morph. They
              sit outside both modes so they stay measurable either way. */}
          {!reducedMotion &&
            SECTIONS.map((section) => (
              <span
                key={`sizer-${section.id}`}
                className="label-sizer"
                aria-hidden="true"
                ref={(node) => {
                  sizerRefs.current[section.id] = node;
                }}
              >
                {section.label}
              </span>
            ))}

          <div className="strip-names">
            {SECTIONS.map((section, index) => (
              <Fragment key={section.id}>
                <Link
                  className="strip-item"
                  href={sectionHref(section.id)}
                  onClick={(event) => isHome && scrollToSection(event, section.id)}
                >
                  {section.label}
                </Link>
                {index < SECTIONS.length - 1 && (
                  <span className="strip-sep" aria-hidden="true">
                    ·
                  </span>
                )}
              </Fragment>
            ))}
          </div>

          <div className="strip-dots">
            {SECTIONS.map((section) => {
              const active = dotActive === section.id;
              const exiting =
                !reducedMotion && exitingId === section.id && !active;
              const classes = [
                'strip-dot',
                active ? 'is-active' : '',
                active && !reducedMotion ? 'morph-in' : '',
                exiting ? 'is-exiting' : '',
              ]
                .filter(Boolean)
                .join(' ');
              const widths = pillWidths[section.id];
              return (
                <Link
                  key={section.id}
                  ref={(node) => {
                    itemRefs.current[section.id] = node;
                  }}
                  className={classes}
                  style={
                    widths
                      ? {
                          '--w-idle': widths.idle,
                          '--w-early': widths.early,
                          '--w-final': widths.final,
                        }
                      : undefined
                  }
                  aria-label={section.label}
                  aria-current={active ? 'location' : undefined}
                  href={sectionHref(section.id)}
                  onClick={(event) =>
                    isHome && scrollToSection(event, section.id)
                  }
                >
                  <span className="dot" aria-hidden="true" />
                  <span className="dot-label" aria-hidden="true">
                    {reducedMotion
                      ? section.label
                      : section.label.split('').map((character, index) => (
                          <span
                            key={index}
                            className="ch"
                            style={{ '--i': index }}
                          >
                            {character}
                          </span>
                        ))}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <Link href="/contact" className="contact-cta">
          Contact us
        </Link>
      </div>
    </header>
  );
}
