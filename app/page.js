import Link from 'next/link';
import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';

export default function HomePage() {
  return (
    <div className="page-wrap">
      <PageHeader title="Technology built with communities, for communities">
        <p className="intro">[Placeholder — pending content]</p>
        <Link href="/contact" className="button">
          Contact us
        </Link>
      </PageHeader>

      <Reveal as="section" className="section">
        <h2>What we do</h2>
        <p>[Placeholder — pending content]</p>
      </Reveal>
    </div>
  );
}
