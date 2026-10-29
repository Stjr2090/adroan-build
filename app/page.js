import Link from 'next/link';
import Reveal from '@/components/Reveal';
import HomeStory from '@/components/HomeStory';
import HeroReveal from '@/components/HeroReveal';
import './home.css';

export default function HomePage() {
  return (
    <>
      <HeroReveal />
      <HomeStory />

      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){document.documentElement.classList.add('js-hero');})();",
        }}
      />

      <section id="landing" className="scene scene-landing">
        <div className="hero-media" aria-hidden="true">
          <img
            className="hero-photo"
            src="/images/landing-kampala.jpg"
            alt=""
            width="1600"
            height="1067"
          />
          <div className="hero-shade" />
        </div>
        <div className="scene-inner">
          <div className="hero-copy">
            <h1 className="hero-title">
              <span className="hero-line">Technology built with communities,</span>
              <br />
              <span className="hero-line">for communities</span>
            </h1>
            <p className="hero-sub">
              Adroan is a technology company in Kampala, Uganda.
            </p>
            <Link href="/contact" className="button">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="scene scene-about">
        <div className="scene-inner about-inner">
          <Reveal as="div" className="about-copy">
            <h2 className="scene-title">About Adroan</h2>
            <div className="skeleton" aria-hidden="true" />
            <div className="skeleton" aria-hidden="true" />
            <div className="skeleton" aria-hidden="true" />
            <div className="skeleton s-narrow" aria-hidden="true" />
          </Reveal>
          <div className="pillar-grid">
            <div className="pillar-card">
              <span>value / pillar</span>
            </div>
            <div className="pillar-card">
              <span>value / pillar</span>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="scene scene-projects">
        <div className="scene-inner projects-inner">
          <h2 className="scene-title">Projects</h2>
          <div className="hinga-card">
            <div className="hinga-copy">
              <p className="hinga-name">HINGA</p>
              <div className="skeleton" aria-hidden="true" />
              <div className="skeleton s-short" aria-hidden="true" />
              <div className="skeleton s-narrow" aria-hidden="true" />
              <Link href="/hinga" className="hinga-cta">
                Explore HINGA <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="hinga-image" role="img" aria-label="HINGA image placeholder">
              HINGA image
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="scene scene-team">
        <div className="scene-inner team-inner">
          <h2 className="scene-title">Team</h2>
          <Reveal as="div" className="team-grid">
            <div className="team-card">
              <div className="team-photo" aria-hidden="true">
                portrait
              </div>
              <p className="team-name">Name</p>
              <p className="team-role">Role</p>
            </div>
            <div className="team-card">
              <div className="team-photo" aria-hidden="true">
                portrait
              </div>
              <p className="team-name">Name</p>
              <p className="team-role">Role</p>
            </div>
            <div className="team-card">
              <div className="team-photo" aria-hidden="true">
                portrait
              </div>
              <p className="team-name">Name</p>
              <p className="team-role">Role</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
