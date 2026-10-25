import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';

const members = [
  {
    name: 'Tumusiime Stephen',
    role: 'Co-founder and CTO',
  },
  {
    name: 'Kiyega Erick',
    role: 'Co-founder and Head of Business Development',
  },
  {
    name: 'Kinaalwa Jeremiah',
    role: 'Co-founder and Head of Legal and Corporate Affairs',
  },
];

export default function TeamPage() {
  return (
    <div className="page-wrap">
      <PageHeader title="Team">
        <p className="intro">A small team in Kampala</p>
      </PageHeader>

      <Reveal as="section" className="section">
        <div className="team-grid">
          {members.map((member, index) => (
            <div
              key={member.name}
              className={`team-card${index === 0 ? ' team-card-accent' : ''}`}
            >
              <div className="team-photo" aria-hidden="true" />
              <p className="team-name">{member.name}</p>
              <p className="team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
