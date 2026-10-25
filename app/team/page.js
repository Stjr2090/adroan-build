import Reveal from '@/components/Reveal';

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
      <Reveal as="section" className="page-header">
        <h1>Team</h1>
      </Reveal>

      <Reveal as="section" className="section">
        <div className="team-grid">
          {members.map((member) => (
            <div key={member.name} className="team-card">
              <p className="team-name">{member.name}</p>
              <p className="team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
