import PageHeader from '@/components/PageHeader';

export default function ContactPage() {
  return (
    <div className="page-wrap page-contact">
      <PageHeader title="Have a question or an idea to share?">
        <p className="intro">Get in touch.</p>
        <p><a href="mailto:hello@adroan.tech">hello@adroan.tech</a></p>
        <p><a href="tel:+256787728020">+256787728020</a></p>
      </PageHeader>
    </div>
  );
}
