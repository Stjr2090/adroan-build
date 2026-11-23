import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
import HingaStory from '@/components/HingaStory';
import './hinga.css';

export default function HingaPage() {
  return (
    <div className="page-wrap hinga-page">
      <PageHeader title="HINGA">
        <p className="intro">
          HINGA is Adroan&apos;s agriculture project. Its live first version helps farmers ask farming questions in English, Luganda and Runyankore.
        </p>
      </PageHeader>

      <Reveal as="section" className="hinga-figure" aria-label="Image placeholder" />

      <HingaStory />

      <Reveal as="section" className="hinga-more">
        <h2>What is live</h2>
        <p>Farmers can ask HINGA questions about farming at <a href="https://hingaai.tech" target="_blank" rel="noopener noreferrer">hingaai.tech</a>.</p>
        <h2>What comes next</h2>
        <p>HINGA&apos;s next direction is agricultural data that can connect farmers and bring them closer to exporters and buyers.</p>
        <p>The wider data connection is a direction in development. It is not a live data platform, marketplace, SMS service or dashboard.</p>
        <a
          className="hinga-link"
          href="https://hingaai.tech"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit HINGA
        </a>
      </Reveal>

      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){document.documentElement.classList.add('js-hinga-story');})();",
        }}
      />
    </div>
  );
}
