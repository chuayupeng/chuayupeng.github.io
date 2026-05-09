import { Swords, Radar, Bug, ChefHat, ShieldCheck } from 'lucide-react';

interface Certification {
  title: string;
  org: string;
  description: string;
  year: string;
  icon: any;
  color: string;
  active: boolean;
}

const certifications: Certification[] = [
  { title: 'OSCP',     org: 'Offensive Security',         description: 'Offensive Security Certified Professional', year: '2019',      icon: Swords,      color: 'text-red-400',    active: true  },
  { title: 'OSWE',     org: 'Offensive Security',         description: 'Offensive Security Web Expert',             year: '2020',      icon: Bug,         color: 'text-purple-400', active: true  },
  { title: 'CRTO',     org: 'Zero-Point Security',        description: 'Certified Red Team Operator',               year: '2021',      icon: Radar,       color: 'text-rose-400',   active: true  },
  { title: 'CPSA',     org: 'CREST',                      description: 'Practitioner Security Analyst',             year: '2019–2022', icon: ShieldCheck, color: 'text-blue-400',   active: false },
  { title: 'CRT',      org: 'CREST',                      description: 'Registered Penetration Tester',             year: '2019–2022', icon: Bug,         color: 'text-sky-400',    active: false },
  { title: 'WSQ FSC L3', org: 'SkillsFuture Singapore',   description: 'Food Safety & Hygiene Officer',             year: '2024',      icon: ChefHat,     color: 'text-amber-400',  active: true  },
];

const CertificationsSection = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <div className="section-eyebrow">Credentials</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Certifications &amp; training
          </h2>
          <p className="text-muted-foreground">
            A trail of formal credentials across offensive security and adjacent disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="card-surface p-6 group relative">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-lg bg-secondary border border-white/[0.06] flex items-center justify-center ${c.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border ${
                    c.active
                      ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                      : 'border-white/10 text-muted-foreground bg-secondary'
                  }`}>
                    {c.active ? 'Active' : 'Expired'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-lg font-semibold tracking-tight">{c.title}</h3>
                  <span className="font-mono text-xs text-muted-foreground">{c.year}</span>
                </div>
                <p className="text-sm text-muted-foreground">{c.description}</p>
                <p className="text-xs text-muted-foreground/70 mt-3 font-mono">{c.org}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
