import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
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

      <Reveal as="section" className="hinga-more">
        <p>Full story coming after market research.</p>
        <a
          className="hinga-link"
          href="https://hingaai.tech"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit hingaai.tech
        </a>
      </Reveal>
    </div>
  );
}
