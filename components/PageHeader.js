import Reveal from '@/components/Reveal';

export default function PageHeader({ title, children, ...rest }) {
  return (
    <Reveal as="section" className="page-header" {...rest}>
      <h1>{title}</h1>
      {children}
    </Reveal>
  );
}
