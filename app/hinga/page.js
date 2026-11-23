import Image from 'next/image';
import HingaScenes from '@/components/HingaScenes';
import HingaSignupForm from '@/components/HingaSignupForm';
import './hinga.css';

export default function HingaPage() {
  return (
    <>
      <HingaScenes />

      {/* Motion-mode backdrop: one fixed layer per scene, crossfaded by
          HingaScenes at the scene boundaries (same pattern as home-wash). */}
      <div className="hinga-wash" aria-hidden="true">
        <div className="wash-layer wash-hero" />
        <div className="wash-layer wash-what" />
        <div className="wash-layer wash-trace" />
        <div className="wash-layer wash-signup" />
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){document.documentElement.classList.add('js-hinga');})();",
        }}
      />

      {/* 1 — Hero: full-bleed drying-beds photograph, deep green base. */}
      <section id="hinga-hero" className="hinga-scene hinga-scene-hero">
        <div className="hinga-hero-media" aria-hidden="true">
          <Image
            className="hinga-hero-photo"
            src="/images/hinga-drying-beds.jpg"
            alt=""
            width={1600}
            height={965}
            priority
          />
          <div className="hinga-hero-shade" />
        </div>
        <div className="hinga-scene-inner">
          <div className="hinga-hero-copy">
            <h1 className="hinga-hero-title">
              <span className="hinga-hero-line">Connecting agriculture,</span>
              <br />
              <span className="hinga-hero-line">from farmers to markets.</span>
            </h1>
            <p className="hinga-hero-sub">HINGA is Adroan&rsquo;s agriculture project.</p>
            <a
              className="hinga-button"
              href="https://hingaai.tech"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try HINGA
            </a>
          </div>
        </div>
      </section>

      {/* 2 — What HINGA does: light scene. */}
      <section id="hinga-what" className="hinga-scene hinga-scene-what">
        <div className="hinga-scene-inner hinga-what-inner">
          <h2 className="hinga-scene-title">Farmers ask HINGA questions about farming.</h2>
          <div className="hinga-copy">
            <p>
              Planting, disease, weather, markets. The answers come back in English, Luganda and
              Runyankole, in the language the question was asked in.
            </p>
            <p>
              Live at{' '}
              <a href="https://hingaai.tech" target="_blank" rel="noopener noreferrer">
                hingaai.tech
              </a>
              .
            </p>
          </div>
          <div className="hinga-panel">
            <h3>Built with communities</h3>
            <p>
              We believe the people closest to a challenge should help shape the solutions built
              around it. HINGA is built in Kampala, starting with farmers and the wider value chain.
            </p>
          </div>
        </div>
      </section>

      {/* 3 — Traceability: dark scene, the branch photograph beside the copy. */}
      <section id="hinga-trace" className="hinga-scene hinga-scene-trace">
        <div className="hinga-scene-inner hinga-trace-inner">
          <div>
            <h2 className="hinga-scene-title">Two layers. The record follows the crop.</h2>
            <div className="hinga-copy">
              <p>
                Layer one is advice: every farmer with a question gets an answer. Layer two is the
                data: the record that follows the crop.
              </p>
              <p>
                Every farmer on HINGA builds a record: the plot, where it sits, what it grows.
                Collection logs where produce enters the chain. The record follows the crop from the
                farm gate through collection to the exporter&rsquo;s hands.
              </p>
              <p>
                That is traceability, built into the chain. Buyers can see who grew their coffee and
                where, and farmers hold proof of their work, because the same record serves both
                ends.
              </p>
            </div>
          </div>
          <figure className="hinga-trace-photo">
            <Image
              src="/images/hinga-coffee-branch.jpg"
              alt="Green coffee cherries growing on the branch"
              width={1600}
              height={1067}
            />
          </figure>
        </div>
      </section>

      {/* 4 — Sign up: light scene, two ways in. */}
      <section id="hinga-signup" className="hinga-scene hinga-scene-signup">
        <div className="hinga-scene-inner hinga-signup-inner">
          <h2 className="hinga-scene-title">Two ways in.</h2>
          <div className="hinga-cta-row">
            <a
              className="hinga-button"
              href="https://hingaai.tech"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try HINGA
            </a>
            <p className="hinga-cta-note">Have a question about farming? Ask HINGA now.</p>
          </div>
          <div className="hinga-signup-card">
            <h3>Sign up</h3>
            <p>
              Joining HINGA is simple. Tell us who you are, and our team reaches out to complete
              your onboarding.
            </p>
            <HingaSignupForm />
          </div>
        </div>
      </section>
    </>
  );
}
