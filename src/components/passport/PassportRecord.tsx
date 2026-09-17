import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { certifications, holder, type Domain } from '@/data/certificationsData';
import { StampMark } from './stamps';

/**
 * The readable half of the passport page, built as a first-class boarding pass:
 * ticket stock and ink rather than the site's dark surfaces, so it reads as a
 * printed document sitting on the page. The certs are struck across the coupon
 * below it as loose stamps rather than sitting in tidy boxes.
 */

const STOCK = '#e9eef1';       // cool ticket stock, distinct from the passport's cream
const STOCK_EDGE = '#d6dee3';
const BAND = '#18233a';        // printed header band
const TICKET_INK = '#1d2733';
const TICKET_FAINT = '#63727f';
const ACCENT = '#0e7f8c';

const pad = (s: string, n: number) => (s + '<'.repeat(n)).slice(0, n);

/**
 * Machine-readable strip, chevron-filled the way a travel document is. The
 * filler prints lighter than the data so the real characters stand out.
 */
const Mrz = ({ lines, size = 12 }: { lines: string[]; size?: number }) => (
  <div
    className="font-mono select-none"
    style={{ fontSize: size, letterSpacing: '0.14em', lineHeight: 1.65, whiteSpace: 'pre' }}
  >
    {lines.map((ln, i) => (
      <div key={i}>
        {[...ln].map((ch, j) => (
          <span key={j} style={{ color: ch === '<' ? TICKET_FAINT : TICKET_INK, opacity: ch === '<' ? 0.5 : 1 }}>
            {ch}
          </span>
        ))}
      </div>
    ))}
  </div>
);

const Cell = ({
  label, value, accent = false, wide = false,
}: { label: string; value: string; accent?: boolean; wide?: boolean }) => (
  <div className={wide ? 'col-span-2' : ''}>
    <div
      className="font-mono"
      style={{ fontSize: 10, letterSpacing: '0.16em', color: TICKET_FAINT }}
    >
      {label}
    </div>
    <div
      className="font-mono"
      style={{
        fontSize: accent ? 20 : 15,
        lineHeight: 1.2,
        fontWeight: 700,
        color: accent ? ACCENT : TICKET_INK,
        letterSpacing: '0.02em',
      }}
    >
      {value}
    </div>
  </div>
);

const BoardingPass = () => {
  const held = certifications.filter((c) => c.active).length;
  const years = certifications.map((c) => parseInt(c.year, 10)).filter(Boolean);
  const from = Math.min(...years);
  const to = Math.max(...years);

  return (
    <div
      className="relative rounded-lg overflow-hidden mb-8"
      style={{ background: STOCK, color: TICKET_INK, boxShadow: '0 18px 40px -20px rgba(0,0,0,.8)' }}
    >
      {/* printed header band */}
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{ background: BAND, color: STOCK }}
      >
        <span className="font-mono" style={{ fontSize: 11, letterSpacing: '0.3em', fontWeight: 700 }}>
          BOARDING PASS
        </span>
        <span className="font-mono" style={{ fontSize: 11, letterSpacing: '0.22em', opacity: 0.75 }}>
          {holder.alias.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* main coupon */}
        <div className="flex-1 p-5">
          <div className="flex gap-4 flex-wrap sm:flex-nowrap">
            <img
              src="/mugshot.png"
              alt=""
              className="shrink-0 rounded-sm"
              style={{
                width: 84,
                border: `2px solid ${STOCK_EDGE}`,
                imageRendering: 'pixelated',
              }}
            />
            <div className="grid grid-cols-2 gap-x-5 gap-y-3 flex-1 min-w-0">
              <Cell label="PASSENGER" value={`${holder.surname} / ${holder.givenNames}`} wide />
              <Cell label="CLASS" value="FIRST" />
              <Cell label="SEQ" value={String(certifications.length).padStart(3, '0')} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mt-5">
            <Cell label="FROM" value={String(from)} accent />
            <Cell label="TO" value={String(to)} accent />
            <Cell label="GATE" value={holder.nationalityCode} />
            <Cell label="BOARDING" value="ANYTIME" />
            <Cell label="PROFESSION" value={holder.role.toUpperCase()} wide />
            <Cell label="STATUS" value={`${held} CURRENT · ${certifications.length - held} LAPSED`} wide />
          </div>

          {/* machine-readable strip */}
          <div className="mt-5 pt-4 overflow-x-auto" style={{ borderTop: `1px solid ${STOCK_EDGE}` }}>
            <Mrz
              lines={[
                pad(`M1${holder.surname}/${holder.givenNames.replace(/ /g, '<')}`, 44),
                pad(`${holder.nationalityCode}${from}<${to}<FIRST<SEQ${String(certifications.length).padStart(3, '0')}`, 44),
              ]}
            />
          </div>
        </div>

        {/* perforation + stub */}
        <div
          className="relative shrink-0 p-5 sm:w-[190px]"
          style={{
            borderTop: `2px dashed ${STOCK_EDGE}`,
            background: '#e0e7ec',
          }}
        >
          <div
            className="hidden sm:block absolute left-0 top-0 h-full"
            style={{ borderLeft: `2px dashed ${STOCK_EDGE}` }}
          />
          <div className="flex flex-col gap-3">
            <Cell label="PASSENGER" value={holder.surname} />
            <Cell label="CLASS" value="FIRST" />
            <Cell label="ORIGIN" value={holder.nationality.toUpperCase()} />
            <div className="overflow-x-auto">
              <Mrz size={10} lines={[pad(holder.surname, 14), pad(`${holder.nationalityCode}${from}`, 14)]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ROUTE: Domain[] = [
  'Offensive Security', 'Web Security', 'AI Security', 'Security Assessment', 'Food Safety',
];

const yearOf = (y: string) => parseInt(y, 10) || 0;

/**
 * The credentials as a route map: one lane per discipline, each stop a sitting,
 * in the order they were earned. Reads as an itinerary, which suits the ticket.
 */
const SkillPathway = ({
  selected, onSelect,
}: { selected: number; onSelect: (i: number) => void }) => (
  <div className="card-surface p-5">
    <div className="flex flex-col gap-6">
      {ROUTE.map((domain) => {
        const stops = certifications
          .map((c, i) => ({ c, i }))
          .filter(({ c }) => c.domain === domain)
          .sort((a, b) => yearOf(a.c.year) - yearOf(b.c.year));
        if (!stops.length) return null;
        return (
          <div key={domain}>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyber-cyan/70 mb-3">
              {domain}
            </div>
            <div
              /* overflow-x also clips vertically, so the hover scale and the
                 selected halo need room inside the scroll box */
              className="flex items-start overflow-x-auto px-1 py-2 -my-1"
            >
              {stops.map(({ c, i }, k) => (
                <div key={c.title} className="flex items-start shrink-0">
                  {k > 0 && (
                    <div
                      className="h-px bg-white/15 shrink-0"
                      style={{ width: 42, marginTop: 7 }}
                    />
                  )}
                  <button
                    onClick={() => onSelect(i)}
                    className="flex flex-col items-center gap-1.5 px-2 group shrink-0"
                    aria-label={`${c.title} — ${c.description}`}
                  >
                    <span
                      className={`block rounded-full transition-transform group-hover:scale-125 ${c.color}`}
                      style={{
                        width: 14,
                        height: 14,
                        background: c.active ? 'currentColor' : 'transparent',
                        border: c.active ? 'none' : '2px solid currentColor',
                        opacity: c.active ? 1 : 0.5,
                        boxShadow: i === selected ? '0 0 0 4px rgba(255,255,255,.14)' : undefined,
                      }}
                    />
                    <span
                      className={`font-mono text-[11px] font-semibold whitespace-nowrap ${
                        i === selected ? 'text-foreground' : 'text-foreground/70'
                      } ${c.active ? '' : 'line-through opacity-60'}`}
                    >
                      {c.title}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground whitespace-nowrap">
                      {c.year}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/** Loose angles and offsets so the strikes look hand-stamped, not laid out. */
const PLACEMENT = [
  { rot: -8, dx: 0, dy: 6 },
  { rot: 5, dx: -14, dy: -10 },
  { rot: -3, dx: -8, dy: 14 },
  { rot: 9, dx: -18, dy: -4 },
  { rot: -6, dx: -6, dy: 10 },
  { rot: 12, dx: -12, dy: -12 },
  { rot: -11, dx: -4, dy: 4 },
  { rot: 4, dx: -16, dy: 12 },
  { rot: -5, dx: -10, dy: -6 },
];

const PassportRecord = () => {
  const [selected, setSelected] = useState(3); // OSAI — the newest
  const cert = certifications[selected];
  const Icon = cert.icon;

  return (
    <div>
      <BoardingPass />

      {/* ---- stamps, struck loosely across the coupon ---- */}
      <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
        Stamps · select to inspect
      </h2>
      <div
        className="rounded-lg p-5 mb-8 relative overflow-hidden"
        style={{ background: STOCK, boxShadow: '0 18px 40px -22px rgba(0,0,0,.8)' }}
      >
        <div
          className="flex flex-wrap justify-center items-center"
          style={{ fontSize: 'clamp(8px, 1.15vw, 12px)' }}
        >
          {certifications.map((c, i) => {
            const p = PLACEMENT[i % PLACEMENT.length];
            const isSel = i === selected;
            return (
              <button
                key={c.title}
                onClick={() => setSelected(i)}
                aria-label={`${c.title} — ${c.description}`}
                className="relative focus:outline-none transition-[filter,opacity] duration-200"
                style={{
                  transform: `rotate(${p.rot}deg)`,
                  marginLeft: p.dx,
                  marginTop: p.dy,
                  marginBottom: -p.dy,
                  zIndex: isSel ? 10 : 1,
                  opacity: isSel ? 1 : c.active ? 0.8 : 0.42,
                  filter: isSel ? 'saturate(1.4) brightness(0.9)' : undefined,
                }}
              >
                <StampMark cert={c} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- record for the selected stamp ---- */}
      <div className="card-surface p-5 md:p-6 mb-10">
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-12 h-12 rounded-lg bg-secondary border border-white/[0.06]
                           flex items-center justify-center shrink-0
                           ${cert.color} ${cert.active ? '' : 'grayscale'}`}>
            <Icon size={28} />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h3 className="text-xl font-bold tracking-tight">{cert.title}</h3>
              <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border ${
                cert.active
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                  : 'border-white/10 text-muted-foreground bg-secondary'
              }`}>
                {cert.active ? 'Valid' : 'Lapsed'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{cert.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-4 pt-5 border-t border-white/[0.06]">
          {([
            ['Issuing authority', cert.org],
            ['Course', cert.code ?? '—'],
            ['Issued', cert.issued ?? '—'],
            ['Expires', cert.expires ?? '—'],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k}>
              <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground/60 font-mono">{k}</div>
              <div className="font-mono text-sm text-foreground/90 tracking-wide">{v}</div>
            </div>
          ))}
          <div className="col-span-2">
            <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground/60 font-mono">Examination</div>
            <div className="font-mono text-sm text-foreground/90 tracking-wide">{cert.exam ?? '—'}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground/60 font-mono">Verification</div>
            {cert.verifyUrl ? (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-cyber-cyan hover:underline underline-offset-4 inline-flex items-center gap-1.5"
              >
                Verify credential <ExternalLink size={13} />
              </a>
            ) : (
              <div className="font-mono text-sm text-muted-foreground">On request</div>
            )}
          </div>
        </div>
      </div>

      {/* ---- pathway ---- */}
      <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5">
        Skill pathway
      </h2>
      <SkillPathway selected={selected} onSelect={setSelected} />
    </div>
  );
};

export default PassportRecord;
