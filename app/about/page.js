import Reveal from '@/components/Reveal';

export default function AboutPage() {
  return (
    <div className="page-wrap">
      <Reveal as="section" className="about-split">
        <div className="about-text">
          <h1>About Adroan</h1>
          <p>[Placeholder — pending content]</p>
          <p>[Placeholder — pending content]</p>
        </div>
        <div className="about-media" role="img" aria-label="Image placeholder" />
      </Reveal>

      <Reveal as="section" className="about-row">
        <div className="about-block">
          <h2>What we do</h2>
          <p>[Placeholder — pending content]</p>
        </div>
        <div className="about-block">
          <h2>How we work</h2>
          <p>[Placeholder — pending content]</p>
        </div>
        <div className="about-block">
          <h2>Where we are</h2>
          <p>Kampala, Uganda</p>
        </div>
      </Reveal>
    </div>
  );
}
