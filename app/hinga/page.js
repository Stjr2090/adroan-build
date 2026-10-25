import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
import './hinga.css';

export default function HingaPage() {
  return (
    <div className="page-wrap hinga-page">
      <PageHeader title="HINGA">
        <p className="intro">
          Agricultural guidance in farmers' languages, designed to support
          safer decisions
        </p>
        <p className="hinga-fact">Adroan's first project</p>
        <a
          className="hinga-link"
          href="https://hingaai.tech"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit hingaai.tech
        </a>
      </PageHeader>

      <Reveal as="section" className="section">
        <p>Full story coming after market research.</p>
      </Reveal>
    </div>
  );
}
