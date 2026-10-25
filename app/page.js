import Link from 'next/link';
import Reveal from '@/components/Reveal';

export default function HomePage() {
  return (
    <div className="page-wrap">
      <Reveal as="section" className="page-header">
        <h1>Technology built with communities, for communities</h1>
        <p className="intro">[Placeholder — pending content]</p>
        <Link href="/contact" className="button">
          Contact us
        </Link>
      </Reveal>

      <Reveal as="section" className="section">
        <h2>What we do</h2>
        <p>[Placeholder — pending content]</p>
      </Reveal>
    </div>
  );
}
