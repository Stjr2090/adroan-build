'use client';

import { useState } from 'react';

// HINGA sign-up: the short form Stephen approved. Submissions leave through
// the visitor's own email app, addressed to hello@adroan.tech, so the team
// picks them up without any backend on the site. The note under the button
// says exactly that, so the hand-off is never a surprise.
const ROLES = [
  { value: 'Farmer', label: 'Farmer' },
  { value: 'Agent or trader', label: 'Agent or trader' },
  { value: 'Exporter', label: 'Exporter' },
];

export default function HingaSignupForm() {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const subject = `HINGA sign-up: ${role}`;
    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `I am a: ${role}`,
      '',
      about,
    ].join('\n');
    window.location.href = `mailto:hello@adroan.tech?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="hinga-form" onSubmit={submit}>
      <fieldset className="hinga-form-roles">
        <legend>I am a</legend>
        <div className="hinga-role-row">
          {ROLES.map((item) => (
            <label
              key={item.value}
              className={`hinga-role${role === item.value ? ' is-selected' : ''}`}
            >
              <input
                type="radio"
                name="role"
                value={item.value}
                checked={role === item.value}
                onChange={(event) => setRole(event.target.value)}
                required
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="hinga-field">
        <span>Name</span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
        />
      </label>
      <label className="hinga-field">
        <span>Phone</span>
        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          autoComplete="tel"
        />
      </label>
      <label className="hinga-field">
        <span>A line about your farm or business</span>
        <textarea
          name="about"
          rows={3}
          value={about}
          onChange={(event) => setAbout(event.target.value)}
        />
      </label>
      <button className="hinga-button" type="submit">
        Sign up
      </button>
      <p className="hinga-form-note">
        This opens your email app with your details filled in, addressed to our team.
      </p>
    </form>
  );
}
