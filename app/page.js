import Link from 'next/link';
import Image from 'next/image';
import HomeStory from '@/components/HomeStory';
import HeroReveal from '@/components/HeroReveal';
import './home.css';

export default function HomePage() {
  return (
    <>
      <HeroReveal />
      <HomeStory />
      <div className="home-wash" aria-hidden="true">
        <div className="wash-layer wash-landing" />
        <div className="wash-layer wash-about" />
        <div className="wash-layer wash-projects" />
        <div className="wash-layer wash-team" />
      </div>

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
              <span className="hero-line">Solutions built with communities,</span>
              <br />
              <span className="hero-line">for communities.</span>
            </h1>
            <p className="hero-sub">
              We believe the people closest to a challenge should help shape the solutions built around it. HINGA puts that idea into practice in agriculture, starting with farmers and the wider value chain.
            </p>
            <Link href="/contact" className="button">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="scene scene-about">
        <div className="scene-inner about-inner">
          <div className="about-copy">
            <h2 className="scene-title">Built around people and context.</h2>
            <p>Adroan is guided by a simple promise: solutions built with communities, for communities.</p>
            <p>We work to understand people's needs and context, then use that understanding to shape useful solutions.</p>
          </div>
          <div className="pillar-grid">
            <div className="pillar-card">
              <h3>Start with context</h3>
              <p>We begin by understanding the people closest to a challenge. Their needs and experience should shape the work from the start.</p>
            </div>
            <div className="pillar-card">
              <h3>Build with communities</h3>
              <p>We want communities to help shape the solutions built around them. That means asking better questions, listening carefully and leaving room for the work to change.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="scene scene-projects">
        <div className="scene-inner projects-inner">
          <h2 className="scene-title">What we are building</h2>
          <div className="hinga-card">
            <div className="hinga-copy">
              <p className="hinga-name">HINGA</p>
              <p>Connecting agriculture, from farmers to markets.</p>
              <p>HINGA's first version helps farmers ask questions about farming. Its next direction is agricultural data that can connect farmers and bring them closer to exporters and buyers.</p>
              <Link href="/hinga" className="hinga-cta">
                Explore HINGA <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="hinga-image" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="team" className="scene scene-team">
        <div className="scene-inner team-inner">
          <h2 className="scene-title">Meet the people behind Adroan.</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-photo"><Image src="/team/VIVI5564-headshot.png" alt="Portrait of Kinaalwa Jeremiah" fill sizes="(min-width: 48rem) 14rem, 100vw" /></div>
              <p className="team-name">Kinaalwa Jeremiah</p>
              <p className="team-role">Head Legal and compliance &amp; Partnerships</p>
            </div>
            <div className="team-card">
              <div className="team-photo"><Image src="/team/VIVI5568-headshot.png" alt="Portrait of Tumusiime Stephen" fill sizes="(min-width: 48rem) 14rem, 100vw" /></div>
              <p className="team-name">Tumusiime Stephen</p>
              <p className="team-role">Team Lead and CTO</p>
            </div>
            <div className="team-card">
              <div className="team-photo"><Image src="/team/IMG_9462-headshot.png" alt="Portrait of Kiyega Erick" fill sizes="(min-width: 48rem) 14rem, 100vw" /></div>
              <p className="team-name">Kiyega Erick</p>
              <p className="team-role">Operations Lead &amp; Business</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
