import Link from 'next/link';
import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
import Placeholder from '@/components/Placeholder';

export default function HomePage() {
  return (
    <div className="page-wrap">
      <PageHeader title="Technology built with communities, for communities">
        <Placeholder className="intro">[Placeholder — pending content]</Placeholder>
        <Link href="/contact" className="button">
          Contact us
        </Link>
      </PageHeader>

      <Reveal as="section" className="section">
        <h2>What we do</h2>
        <Placeholder>[Placeholder — pending content]</Placeholder>
      </Reveal>
    </div>
  );
}
