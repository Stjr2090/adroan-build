import Reveal from '@/components/Reveal';

export default function PageHeader({ title, children }) {
  return (
    <Reveal as="section" className="page-header">
      <h1>{title}</h1>
      {children}
    </Reveal>
  );
}
