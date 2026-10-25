import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

export default function HomePage() {
  return (
    <div className="page-wrap">
      <PageHeader title="Technology built with communities, for communities">
        <p className="intro">Adroan is a technology company in Kampala, Uganda.</p>
        <Link href="/contact" className="button">
          Contact us
        </Link>
      </PageHeader>

      <Reveal as="section" className="section">
        <h2>What we do</h2>
        <p>
          Our first project is HINGA — technology built with communities, for
          communities. See it at{' '}
          <a href="https://hingaai.tech" target="_blank" rel="noopener noreferrer">
            hingaai.tech
          </a>
          .
        </p>
      </Reveal>
    </div>
  );
}
