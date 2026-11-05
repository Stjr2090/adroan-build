import Link from 'next/link';
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
              <span className="hero-line">Technology built with communities,</span>
              <br />
              <span className="hero-line">for communities.</span>
            </h1>
            <p className="hero-sub">
              We believe the people closest to a challenge should help shape the technology built around it. HINGA explores that idea in agriculture, starting with farmers and the wider value chain.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="scene scene-about">
        <div className="scene-inner about-inner">
          <div className="about-copy">
            <h2 className="scene-title">About Adroan</h2>
            <p>Adroan is guided by a simple promise: technology built with communities, for communities.</p>
            <p>We want to understand people's needs and context, and use that understanding to shape useful technology.</p>
          </div>
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
              <p>Connecting agriculture, from farmers to markets.</p>
              <p>HINGA's first version gives farmers a way to ask questions about farming. Its next direction is agricultural data: helping farmers connect with one another and closing the loop between the farm end of the value chain and the exporters and buyers at the other end.</p>
              <p>The aim is to bring people across that chain closer together, starting with the farmers whose work underpins it.</p>
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
          <h2 className="scene-title">Meet the people behind Adroan.</h2>
          <div className="team-grid">
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
          </div>
        </div>
      </section>
    </>
  );
}
