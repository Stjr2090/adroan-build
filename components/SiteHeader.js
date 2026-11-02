'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { lenisRef } from '@/lib/lenis';
import './site-header.css';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
];

const LIGHT_SCENES = ['about', 'team', 'contact'];

// Normalize a pathname to a scene id: '/contact' -> 'contact', '/' -> 'landing'.
const sceneFromPath = (path) =>
  path === '/' ? 'landing' : path.replace(/^\//, '');

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const reducedMotion = useReducedMotion();

  // Scene: which of the four homepage scenes (or separate page) owns the
  // viewport middle. Initial value follows the route, matching the parse-time
  // script in layout.js, so hydration never flips a sub-page's theme.
  const [scene, setScene] = useState(() => sceneFromPath(pathname));
  const [scrolled, setScrolled] = useState(false);
  const [wide, setWide] = useState(() =>
    typeof window === 'undefined'
      ? true
      : window.matchMedia('(min-width: 48rem)').matches
  );

  const [dotActive, setDotActive] = useState(null);

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
              return (
                <Link
                  key={section.id}
                  className={`strip-dot${active ? ' is-active' : ''}`}
                  aria-label={section.label}
                  aria-current={active ? 'location' : undefined}
                  href={sectionHref(section.id)}
                  onClick={(event) => isHome && scrollToSection(event, section.id)}
                >
                  <span className="dot" aria-hidden="true" />
                  {active &&
                    (reducedMotion ? (
                      <span className="dot-label">{section.label}</span>
                    ) : (
                      <AnimatePresence initial={false}>
                        <motion.span
                          className="dot-label"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {section.label}
                        </motion.span>
                      </AnimatePresence>
                    ))}
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
