import Link from 'next/link';
import HomeHero from '@/components/HomeHero';
import Reveal from '@/components/Reveal';

export default function HomePage() {
  return (
    <div className="page-wrap">
      <HomeHero>
        <p className="intro">Adroan is a technology company in Kampala, Uganda.</p>
        <Link href="/contact" className="button">
          Contact us
        </Link>
      </HomeHero>

      <Reveal as="section" className="home-explore" aria-label="Explore Adroan">
        <h2>Explore</h2>

        <details>
          <summary>About</summary>
          <p>
            We build technology with communities, for communities — a small
            team in Kampala, Uganda.
          </p>
          <Link href="/about">Read about Adroan</Link>
        </details>

        <details>
          <summary>Team</summary>
          <p>
            Three co-founders lead Adroan: engineering, business
            development and legal.
          </p>
          <Link href="/team">Meet the team</Link>
        </details>

        <details>
          <summary>Contact</summary>
          <p>Kampala, Uganda. Contact details to be added.</p>
          <Link href="/contact">Go to Contact</Link>
        </details>

        <details className="home-fact-hinga">
          <summary>HINGA — our first project</summary>
          <p>
            HINGA is technology built with communities, for communities —
            Adroan&apos;s first project.
          </p>
          <a href="https://hingaai.tech" target="_blank" rel="noopener noreferrer">
            Visit hingaai.tech
          </a>
          {' · '}
          <Link href="/hinga">Open the HINGA page</Link>
        </details>
      </Reveal>
    </div>
  );
}
