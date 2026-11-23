'use client';

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { lenisRef } from '@/lib/lenis';
import BrandLockup from './BrandLockup';
import './site-header.css';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
];

const PAGE_SECTIONS = {
  '/hinga': [
    { id: 'hinga-what', label: 'What it does' },
    { id: 'hinga-trace', label: 'Traceability' },
    { id: 'hinga-signup', label: 'Sign up' },
  ],
};

const LIGHT_SCENES = ['about', 'team', 'contact', 'hinga-what', 'hinga-signup'];

// Header-backdrop special cases per scene id: light scenes share the
// About/Team hysteresis, the HINGA dark scenes share the Projects one.
const LIGHT_HEADER_SCENES = ['about', 'team', 'hinga-what', 'hinga-signup'];
const DARK_HEADER_SCENES = ['projects', 'hinga-hero', 'hinga-trace'];

// Each scene's pill palette is fixed by its own theme (About/Team are light,
// Projects dark). Marking that on the dot itself keeps the pill colours
// stable when html[data-theme] is mid-cross-fade at a scene boundary.
const sceneTheme = (id) => (LIGHT_SCENES.includes(id) ? 'light' : 'dark');

// Normalise a pathname to a scene id: '/contact' -> 'contact', '/' -> 'landing'.
// '/hinga' resolves to its first scene so the parse-time attributes, the
// initial React state and the first wash all agree.
const sceneFromPath = (path) => {
  if (path === '/') return 'landing';
  const base = path.replace(/^\/+/, '');
  return base === 'hinga' ? 'hinga-hero' : base;
};

// Header art follows the backdrop under the fixed header, not the scene theme.
// Motion mode crossfades one full-viewport wash layer, so the scene theme is
// the backdrop there. Static/reduced motion keeps each scene's own gradient,
// so the scene's 22% top band decides; the 8px hysteresis keeps the lockup
// from oscillating on the ramp.
function syncHeaderBackdrop() {
  const root = document.documentElement;
  const scenes = document.querySelectorAll('.scene');
  let next;
  if (!scenes.length || root.classList.contains('home-story-motion')) {
    next = root.dataset.theme === 'light' ? 'light' : 'dark';
  } else {
    const y = window.scrollY + 28;
    let current = scenes[0];
    for (const scene of scenes) {
      if (scene.getBoundingClientRect().top + window.scrollY <= y) current = scene;
    }
    const top = current.getBoundingClientRect().top + window.scrollY;
    const edge = top + (current.offsetHeight || window.innerHeight) * 0.22;
    const state = root.dataset.headerBackdrop;
    if (DARK_HEADER_SCENES.includes(current.id)) {
      next = state === 'light' ? (y > edge + 4 ? 'dark' : 'light')
        : state === 'dark' ? (y < edge - 4 ? 'light' : 'dark')
          : (y < edge ? 'light' : 'dark');
    } else if (LIGHT_HEADER_SCENES.includes(current.id)) {
      next = state === 'dark' ? (y > edge + 4 ? 'light' : 'dark')
        : state === 'light' ? (y < edge - 4 ? 'dark' : 'light')
          : (y < edge ? 'dark' : 'light');
    } else {
      next = 'dark';
    }
  }
  if (next !== root.dataset.headerBackdrop) root.setAttribute('data-header-backdrop', next);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const reducedMotion = useReducedMotion();

  // Scene: which of the four homepage scenes (or separate page) owns the
  // viewport middle. Initial value follows the route, matching the parse-time
  // script in layout.js, so hydration never flips a sub-page's theme.
  const [scene, setScene] = useState(() => sceneFromPath(pathname));
  const [scrolled, setScrolled] = useState(false);
  // Read synchronously (not via effect) so the very first client commit
  // already knows the strip mode; the data-strip attribute is written
  // pre-paint and must not depend on a later effect for that.
  const [wide, setWide] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 48rem)').matches
  );

  const [dotActive, setDotActive] = useState(null);

  // --- Phased pill morph (Phase 4) -----------------------------------
  // Idle dot -> dot stretches into the pill shell -> label wipes in across
  // two pill widths with a short character stagger -> scene colour settles.
  // Widths are measured live and passed to the CSS keyframes as custom
  // properties; the colour cross-fade happens underneath on the same 400 ms
  // timeline so the scene palette never jumps.
  const [exitingId, setExitingId] = useState(null);
  const [pillWidths, setPillWidths] = useState({});
  // The strip's visible background colour at the moment a morph starts;
  // the colour set-off crosses from this pinned value so a mid-scroll
  // theme flip can't re-point the running keyframes.
  const [morphFromBg, setMorphFromBg] = useState(null);
  const exitTimer = useRef(null);
  const prevActive = useRef(null);
  const itemRefs = useRef({});
  const sizerRefs = useRef({});
  const navStripRef = useRef(null);

  const dotsMode = isHome ? !(scene === 'landing' && wide) : true;

  // Sub-pages can own the strip: /hinga's dots track its own scenes.
  const sections = PAGE_SECTIONS[pathname] || SECTIONS;
  const hasPageSections = Boolean(PAGE_SECTIONS[pathname]);

  // Scene attributes commit pre-paint (useLayoutEffect, declared before the
  // measurement effect) so a morph's first painted frame already carries the
  // new data-theme / data-strip and the theme attributes can never lead or
  // lag the pill timeline.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-scene', scene);
    root.setAttribute('data-theme', sceneTheme(scene));
    root.setAttribute('data-scrolled', scrolled ? '1' : '0');
    root.setAttribute('data-strip', isHome && scene === 'landing' && wide ? 'names' : 'dots');
    syncHeaderBackdrop();
  }, [scene, scrolled, isHome, wide, pathname]);

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
    // Pin the morph's colour-settle start to the strip's visible colour.
    // data-theme has already flipped this commit, so read the computed
    // value now (its background transition is at t=0, i.e. the colour that
    // is actually on screen) instead of letting the keyframes resolve the
    // theme vars live mid-animation.
    if (dotActive && dotActive !== prev && navStripRef.current) {
      const stripBg = getComputedStyle(navStripRef.current).backgroundColor;
      if (stripBg && stripBg !== 'rgba(0, 0, 0, 0)') {
        setMorphFromBg(stripBg);
      }
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
      sections.forEach((section) => {
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
          Object.keys(next).length === sections.length &&
          sections.every(
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
  }, [dotsMode, scene, reducedMotion, pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 48rem)');
    setWide(mq.matches);
    const onMq = (event) => setWide(event.matches);
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      syncHeaderBackdrop();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      // Separate pages: fixed scene until the page's own story publishes one
      // (HINGA's scenes do), then track it so theme, backdrop and dots move
      // together with the page's washes.
      const onScene = (event) => {
        const id = event.detail;
        const root = document.documentElement;
        root.setAttribute('data-scene', id);
        root.setAttribute('data-theme', sceneTheme(id));
        root.setAttribute('data-strip', 'dots');
        syncHeaderBackdrop();
        setScene(id);
        setDotActive(id);
      };
      window.addEventListener('adroan:scene', onScene);
      setScene(sceneFromPath(pathname));
      setDotActive(null);
      return () => window.removeEventListener('adroan:scene', onScene);
    }
    // Motion mode: HomeStory publishes the scene on the wash frame, so the
    // header, strip and backdrop change together with the gradient landing.
    // Write the three attributes in this tick; React below only drives the
    // pill/dot UI, whose render can land on the next paint.
    const onScene = (event) => {
      const id = event.detail;
      const root = document.documentElement;
      root.setAttribute('data-scene', id);
      root.setAttribute('data-theme', sceneTheme(id));
      root.setAttribute(
        'data-strip',
        isHome && id === 'landing' && window.matchMedia('(min-width: 48rem)').matches
          ? 'names'
          : 'dots'
      );
      syncHeaderBackdrop();
      setScene(id);
      setDotActive(id === 'landing' ? null : id);
    };
    window.addEventListener('adroan:scene', onScene);
    // Reduced motion has no wash: keep the intersection observer fallback.
    const ids = ['landing', ...SECTIONS.map((section) => section.id)];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element) => element);
    const observer = new IntersectionObserver(
      (entries) => {
        if (document.documentElement.classList.contains('home-story-motion')) return;
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
    return () => {
      window.removeEventListener('adroan:scene', onScene);
      observer.disconnect();
    };
  }, [isHome, pathname]);

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

  const sectionHref = (id) => (isHome || hasPageSections ? `#${id}` : `/#${id}`);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="Adroan home">
          <BrandLockup />
        </Link>

        <nav ref={navStripRef} className="nav-strip" aria-label="Main navigation">
          {/* Hidden sizers: the label widths used by the pill morph. They
              sit outside both modes so they stay measurable either way.
              Always rendered (even under reduced motion) so the SSR markup
              and every client first render stay structurally identical — a
              motion-dependent structure caused hydration #418/#423 for
              reduced-motion clients. */}
          {sections.map((section) => (
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
            {sections.map((section, index) => (
              <Fragment key={section.id}>
                <Link
                  className="strip-item"
                  href={sectionHref(section.id)}
                  onClick={(event) => (isHome || hasPageSections) && scrollToSection(event, section.id)}
                >
                  {section.label}
                </Link>
                {index < sections.length - 1 && (
                  <span className="strip-sep" aria-hidden="true">
                    ·
                  </span>
                )}
              </Fragment>
            ))}
          </div>

          <div className="strip-dots">
            {sections.map((section) => {
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
                  data-scene-theme={sceneTheme(section.id)}
                  style={
                    widths
                      ? {
                          '--w-idle': widths.idle,
                          '--w-early': widths.early,
                          '--w-final': widths.final,
                          // Colour-settle start, pinned at morph start (see
                          // the exit/morph layout effect above).
                          ...(morphFromBg
                            ? { '--m-from-bg': morphFromBg }
                            : {}),
                        }
                      : undefined
                  }
                  aria-label={section.label}
                  aria-current={active ? 'location' : undefined}
                  href={sectionHref(section.id)}
                  onClick={(event) =>
                    (isHome || hasPageSections) && scrollToSection(event, section.id)
                  }
                >
                  <span className="dot" aria-hidden="true" />
                  <span className="dot-label" aria-hidden="true">
                    {section.label.split('').map((character, index) => (
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

        <Link href="/contact" className="contact-cta" aria-label="Contact us">
          <span className="contact-label">Contact us</span>
          <svg
            className="contact-phone"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a1 1 0 0 1 1 .9l.6 3a1 1 0 0 1-.3 1l-1.6 1.6a16 16 0 0 0 6.7 6.7l1.6-1.6a1 1 0 0 1 1-.3l3 .6a1 1 0 0 1 .9 1z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
