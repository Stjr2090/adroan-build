import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
import HingaMotionFoundation from '@/components/HingaMotionFoundation';
import HingaStoryScroll from '@/components/HingaStoryScroll';
import './hinga.css';

export default function HingaPage() {
  return (
    <div className="page-wrap hinga-page">
      <HingaMotionFoundation />
      <PageHeader title="HINGA" data-vt="hinga-header">
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

      <HingaStoryScroll />

      <Reveal as="section" className="section" data-vt="hinga-card">
        <p>Full story coming after market research.</p>
      </Reveal>
    </div>
  );
}
