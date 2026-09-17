import { certifications } from '@/data/certificationsData';

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
              <div
                key={c.title}
                className={`card-surface p-6 group relative transition-opacity ${
                  c.active ? '' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-11 h-11 rounded-lg bg-secondary border border-white/[0.06] flex items-center justify-center transition-[filter] ${c.color} ${
                      c.active ? '' : 'grayscale group-hover:grayscale-0'
                    }`}
                  >
                    <Icon size={26} />
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
