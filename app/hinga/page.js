import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
import HingaStory from '@/components/HingaStory';
import './hinga.css';

export default function HingaPage() {
  return (
    <div className="page-wrap hinga-page">
      <PageHeader title="HINGA">
        <p className="intro">
          Agricultural guidance in farmers&rsquo; languages, designed to
          support safer decisions
        </p>
        <p className="hinga-fact">Adroan&rsquo;s first project</p>
      </PageHeader>

      <Reveal as="section" className="hinga-figure" aria-label="Image placeholder" />

      <HingaStory />

      <Reveal as="section" className="hinga-more">
        <a
          className="hinga-link"
          href="https://hingaai.tech"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit hingaai.tech
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
