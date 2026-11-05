'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { lenisRef } from '@/lib/lenis';
import { publishHomeScene } from '@/lib/home-scene';
import BrandLockup from './BrandLockup';
import './site-header.css';

const SECTIONS = [{ id: 'about', label: 'About' }, { id: 'projects', label: 'Projects' }, { id: 'team', label: 'Team' }];
const sceneFromPath = path => path === '/' ? 'landing' : path.replace(/^\//, '');

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const reducedMotion = useReducedMotion();
  const [scene, setScene] = useState(() => sceneFromPath(pathname));
  const names = isHome && scene === 'landing';

  useEffect(() => {
    const root = document.documentElement;
    if (!isHome) {
      const next = sceneFromPath(pathname);
      setScene(next);
      root.dataset.scene = next;
      root.dataset.theme = next === 'contact' || next === 'hinga' ? 'light' : 'dark';
      root.dataset.strip = 'dots';
      return;
    }
    const onScene = event => setScene(event.detail);
    window.addEventListener('adroan:scene', onScene);
    setScene(root.dataset.scene || 'landing');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    const sync = () => {
      observer?.disconnect();
      // Preserve the static/reduced-motion scene behavior. Motion mode has
      // no competing observer or timer: HomeStory publishes at wash end.
      if (!reduced.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) publishHomeScene(entry.target.id); });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      document.querySelectorAll('.scene').forEach(scene => observer.observe(scene));
    };
    sync();
    reduced.addEventListener('change', sync);
    return () => {
      observer?.disconnect();
      reduced.removeEventListener('change', sync);
      window.removeEventListener('adroan:scene', onScene);
    };
  }, [isHome, pathname]);

  const scrollToSection = (event, id) => {
    if (!isHome) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: .85 });
    else target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="Adroan home"><BrandLockup /></Link>
        <nav className="nav-strip" aria-label="Main navigation">
          <div className="strip-names" aria-hidden={!names}>
            {SECTIONS.map(section => <Link key={section.id} className="strip-item" tabIndex={names ? 0 : -1}
              href={isHome ? `#${section.id}` : `/#${section.id}`} onClick={event => scrollToSection(event, section.id)}>{section.label}</Link>)}
          </div>
          <div className="strip-dots" aria-hidden={names}>
            {SECTIONS.map(section => {
              const active = isHome && scene === section.id;
              return <Link key={section.id} className={`strip-dot${active ? ' is-active' : ''}`} tabIndex={names ? -1 : 0}
                aria-label={section.label} aria-current={active ? 'location' : undefined}
                href={isHome ? `#${section.id}` : `/#${section.id}`} onClick={event => scrollToSection(event, section.id)}>
                <span className="dot" aria-hidden="true" />
                <span className="dot-label">{active ? section.label : ''}</span>
              </Link>;
            })}
          </div>
        </nav>
        <Link href="/contact" className="contact-cta" aria-label="Contact us">
          <span className="contact-label">Contact us</span>
          <svg className="contact-phone" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a1 1 0 0 1 1 .9l.6 3a1 1 0 0 1-.3 1l-1.6 1.6a16 16 0 0 0 6.7 6.7l1.6-1.6a1 1 0 0 1 1-.3l3 .6a1 1 0 0 1 .9 1z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
