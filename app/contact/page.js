'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-wrap page-contact">
      <PageHeader title="Contact">
        <p className="intro">Adroan is based in Kampala, Uganda.</p>
      </PageHeader>

      <Reveal as="section" className="contact-section">
        <form className="contact-form" onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            aria-label="Name"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            required
          />
          <textarea
            name="message"
            placeholder="Message"
            aria-label="Message"
            required
          />
          <button type="submit" className="button contact-send">
            Send
          </button>
        </form>
        {submitted && (
          <p className="contact-note">Contact details to be added.</p>
        )}
      </Reveal>
    </div>
  );
}
