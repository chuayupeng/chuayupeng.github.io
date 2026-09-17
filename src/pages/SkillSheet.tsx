import { useState } from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  certifications, holder,
  type Certification, type Domain,
} from '@/data/certificationsData';

/**
 * Credentials as a character sheet, extending the ~/character.json motif from
 * the hero: focus areas become attributes and certs become unlocked perks on a
 * branching tree.
 */

/** Rungs that aren't held yet — the rest of the OffSec ladder, shown locked. */
const locked: { title: string; description: string; code: string }[] = [
  { title: 'OSED', description: 'OffSec Exploit Developer',     code: 'EXP-301' },
  { title: 'OSEE', description: 'OffSec Exploitation Expert',   code: 'EXP-401' },
];

const DOMAIN_ORDER: Domain[] = [
  'Offensive Security', 'Web Security', 'AI Security', 'Security Assessment', 'Food Safety',
];

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline gap-3">
    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70 w-28 shrink-0">
      {label}
    </span>
    <span className="font-mono text-sm text-foreground/90">{value}</span>
  </div>
);

const SkillSheet = () => {
  const [selected, setSelected] = useState<Certification>(certifications[3]);
  const Icon = selected.icon;
  const held = certifications.filter((c) => c.active).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="relative pt-36 pb-24 px-4 overflow-hidden">
          <div className="absolute inset-0 grid-bg pointer-events-none" />
          <div className="container mx-auto max-w-5xl relative">
            <div className="section-eyebrow">Credentials</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Skills <span className="gradient-text">passport</span>
            </h1>
            <p className="text-muted-foreground mb-12 max-w-2xl">
              The character sheet behind the CV — every perk unlocked so far, and what's
              still further up the tree.
            </p>

            {/* ---- character header ---- */}
            <div className="rounded-xl border border-white/[0.08] bg-card overflow-hidden mb-10 font-mono">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-black/30">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-muted-foreground">~/skills.json</span>
              </div>

              <div className="p-6 flex flex-col sm:flex-row gap-6 items-start">
                {/* portrait, framed like a character card */}
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <div
                    className="rounded-lg overflow-hidden border border-cyber-cyan/25"
                    style={{ boxShadow: '0 0 40px -8px rgba(139,92,246,.45)' }}
                  >
                    <img
                      src="/mugshot.png"
                      alt=""
                      style={{ width: 132, display: 'block', imageRendering: 'pixelated' }}
                    />
                  </div>
                  <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full
                               border border-cyber-cyan/40 bg-background text-cyber-cyan text-[10px]
                               tracking-[0.18em] whitespace-nowrap"
                  >
                    LVL {new Date().getFullYear() - holder.since}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 flex-1 min-w-0 pt-1">
                  <Row label="name"   value={holder.alias} />
                  <Row label="class"  value={holder.role} />
                  <Row label="origin" value={holder.nationality} />
                  <Row label="level"  value={`${new Date().getFullYear() - holder.since} yrs in the field`} />
                  <Row label="perks"  value={`${held} unlocked · ${certifications.length - held} lapsed`} />
                  <Row label="next"   value={locked.map((l) => l.title).join(', ')} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* ---- the tree carries the page; these sit beside it ---- */}
              <div className="lg:col-span-4 lg:order-2 space-y-6">
                {/* ---- locked ---- */}
                <div className="card-surface p-5">
                  <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
                    Locked
                  </h2>
                  <div className="space-y-3">
                    {locked.map((l) => (
                      <div key={l.title} className="flex items-center gap-3 opacity-50">
                        <div className="w-9 h-9 rounded-lg bg-secondary border border-white/[0.06]
                                        flex items-center justify-center text-muted-foreground shrink-0">
                          <Lock size={15} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono text-sm">{l.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{l.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ---- skill tree ---- */}
              <div className="lg:col-span-8 lg:order-1">
                <div className="card-surface p-5 mb-6">
                  <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5">
                    Unlocked
                  </h2>

                  <div className="space-y-6">
                    {DOMAIN_ORDER.map((domain) => {
                      const inDomain = certifications.filter((c) => c.domain === domain);
                      if (inDomain.length === 0) return null;
                      return (
                        <div key={domain}>
                          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyber-cyan/70 mb-2.5">
                            {domain}
                          </div>
                          <div className="pl-3 border-l border-white/10 space-y-1.5">
                            {inDomain.map((c) => {
                              const CIcon = c.icon;
                              const isSel = c.title === selected.title;
                              return (
                                <button
                                  key={c.title}
                                  onClick={() => setSelected(c)}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left
                                    transition-colors ${
                                    isSel
                                      ? 'border-cyber-cyan/40 bg-cyber-cyan/[0.06]'
                                      : 'border-transparent hover:border-white/10 hover:bg-white/[0.02]'
                                  } ${c.active ? '' : 'opacity-50'}`}
                                >
                                  <span className={`${c.color} ${c.active ? '' : 'grayscale'} shrink-0`}>
                                    <CIcon size={20} />
                                  </span>
                                  <span className="font-mono text-sm font-medium">{c.title}</span>
                                  <span className="text-xs text-muted-foreground truncate hidden sm:block">
                                    {c.description}
                                  </span>
                                  <span className="ml-auto font-mono text-[10px] text-muted-foreground shrink-0">
                                    {c.year}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ---- selected perk ---- */}
                <div className="card-surface p-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-lg bg-secondary border border-white/[0.06]
                                     flex items-center justify-center shrink-0
                                     ${selected.color} ${selected.active ? '' : 'grayscale'}`}>
                      <Icon size={26} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h3 className="text-xl font-bold tracking-tight">{selected.title}</h3>
                        <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border ${
                          selected.active
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                            : 'border-white/10 text-muted-foreground bg-secondary'
                        }`}>
                          {selected.active ? 'Unlocked' : 'Lapsed'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selected.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-5 border-t border-white/[0.06]">
                    <Row label="issuer"  value={selected.org} />
                    <Row label="course"  value={selected.code ?? '—'} />
                    <Row label="issued"  value={selected.issued ?? '—'} />
                    <Row label="expires" value={selected.expires ?? '—'} />
                    <Row label="trial"   value={selected.exam ?? '—'} />
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70 w-28 shrink-0">
                        verify
                      </span>
                      {selected.verifyUrl ? (
                        <a
                          href={selected.verifyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-sm text-cyber-cyan hover:underline underline-offset-4 inline-flex items-center gap-1.5"
                        >
                          credential <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span className="font-mono text-sm text-muted-foreground">on request</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SkillSheet;
