import Reveal from '@/components/Reveal';

export default function AboutPage() {
  return (
    <div className="page-wrap">
      <Reveal as="section" className="about-split">
        <div className="about-text">
          <h1>About Adroan</h1>
          <p>
            Adroan is a technology company in Kampala, Uganda. We build
            technology with communities, for communities.
          </p>
          <p>
            Three co-founders lead the company: Tumusiime Stephen
            (Co-founder and CTO), Kiyega Erick (Co-founder and Head of
            Business Development), and Kinaalwa Jeremiah (Co-founder and Head
            of Legal and Corporate Affairs).
          </p>
        </div>
        <div className="about-media" role="img" aria-label="Image placeholder" />
      </Reveal>

      <Reveal as="section" className="about-row">
        <div className="about-block">
          <h2>What we do</h2>
          <p>
            Our first project is HINGA. Learn more at{' '}
            <a href="https://hingaai.tech" target="_blank" rel="noopener noreferrer">
              hingaai.tech
            </a>
            .
          </p>
        </div>
        <div className="about-block">
          <h2>How we work</h2>
          <p>
            We are a small team in Kampala, working with the communities we
            build for from the start.
          </p>
        </div>
        <div className="about-block">
          <h2>Where we are</h2>
          <p>Kampala, Uganda</p>
        </div>
      </Reveal>
    </div>
  );
}
