import { useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Fingerprint, Maximize2, Minimize2, X } from 'lucide-react';
import { certifications, holder, mrzLines, type Certification, type Domain } from '@/data/certificationsData';
import { INK, PAPER, SHORT_ORG, StampMark, stampDate } from './stamps';

/* Page palette. The stamp inks live in ./stamps alongside the marks. */
const PAPER_EDGE = '#ded5c0';
const INK_TEXT = '#2b2721';
const INK_FAINT = '#6f6558';
const COVER = '#1a2133';
const FOIL = '#c9ab63';

/** Where a stamp sits on a page, as a percentage, plus its fixed angle. */
interface Placed {
  cert: Certification;
  x: number;
  y: number;
  rot: number;
  scale: number;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * One hypotrochoid — the curve a spirograph traces. A rosette closes after
 * r/gcd(R,r) turns and shows R/gcd(R,r) lobes, so the ratio picks the shape.
 */
const rosette = (
  cx: number, cy: number, R: number, r: number, d: number, steps: number,
) => {
  const turns = r / gcd(R, r);
  const k = (R - r) / r;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns;
    const x = cx + (R - r) * Math.cos(t) + d * Math.cos(k * t);
    const y = cy + (R - r) * Math.sin(t) - d * Math.sin(k * t);
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `M${pts.join(' L')}`;
};

/**
 * The security print under each page. Real guilloche is a family of spirograph
 * curves laid over each other with the pen offset stepped a little each pass,
 * which is what braids them — so this draws nested rosette families rather
 * than loose ellipses.
 */
const Guilloche = ({
  seed = 0, color = INK_TEXT, opacity = 0.26,
}: { seed?: number; color?: string; opacity?: number }) => {
  const id = useId().replace(/:/g, '');

  // seed only nudges the geometry, so every page is a variation on one motif
  const lobesA = 5 + (seed % 3);
  const lobesB = 7 + ((seed + 1) % 4);
  const spin = (seed * 13) % 360;

  const familyA = Array.from({ length: 7 }, (_, i) =>
    rosette(100, 70, lobesA * 9, 9, 15 + i * 2.6, 420));
  const familyB = Array.from({ length: 5 }, (_, i) =>
    rosette(100, 70, lobesB * 5, 5, 26 + i * 2.2, 420));

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 200 140"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`fade${id}`}>
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`m${id}`}>
          <rect width="200" height="140" fill={`url(#fade${id})`} />
        </mask>
      </defs>

      <g mask={`url(#m${id})`} stroke={color} fill="none" opacity={opacity}>
        <g transform={`rotate(${spin} 100 70)`}>
          {familyA.map((d, i) => (
            <path key={`a${i}`} d={d} strokeWidth="0.22" />
          ))}
        </g>
        <g transform={`rotate(${-spin / 2} 100 70)`}>
          {familyB.map((d, i) => (
            <path key={`b${i}`} d={d} strokeWidth="0.18" opacity="0.8" />
          ))}
        </g>
        {/* fine lathe rings tying the families together */}
        {[18, 30, 44].map((rr) => (
          <circle key={rr} cx="100" cy="70" r={rr} strokeWidth="0.14" opacity="0.55" />
        ))}
      </g>
    </svg>
  );
};

/**
 * A credentials passport you can actually leaf through.
 *
 * The book is a stack of leaves rotated about their inner edge in 3D. Real
 * passport pages are cream, not dark, so the book deliberately breaks from the
 * site's palette — it reads as a physical object sitting on the page.
 *
 * Everything inside the book is sized in `em` against a root font-size that
 * scales with the viewport, so the whole spread grows and shrinks as one piece
 * rather than needing breakpoints per element.
 */

const Stamp = ({
  placed, onClick, isOpen,
}: { placed: Placed; onClick: () => void; isOpen: boolean }) => {
  const { cert, x, y, rot, scale } = placed;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label={`${cert.title} — ${cert.description}`}
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
        opacity: cert.active ? 0.84 : 0.45,
        filter: isOpen ? 'saturate(1.35) brightness(0.92)' : undefined,
        transition: 'opacity .25s, filter .25s',
      }}
    >
      <StampMark cert={cert} />
    </button>
  );
};

/** Detail card that opens against a stamp. */
const StampDetail = ({ cert, onClose }: { cert: Certification; onClose: () => void }) => (
  <div
    className="absolute z-30 left-1/2 bottom-[6%] -translate-x-1/2 w-[86%] shadow-2xl"
    style={{ background: '#fbf8f1', border: `0.12em solid ${INK_TEXT}`, color: INK_TEXT }}
    onClick={(e) => e.stopPropagation()}
  >
    <div
      className="flex items-center justify-between px-[0.9em] py-[0.45em]"
      style={{ background: INK_TEXT, color: PAPER }}
    >
      <span style={{ fontSize: '0.95em', fontWeight: 700, letterSpacing: '0.16em' }}>
        {cert.title}
      </span>
      <button type="button" onClick={onClose} aria-label="Close" className="hover:opacity-70">
        <X size={13} />
      </button>
    </div>

    <div className="px-[0.9em] py-[0.7em]">
      <div style={{ fontSize: '0.95em', marginBottom: '0.5em' }}>{cert.description}</div>
      <dl className="grid grid-cols-2 gap-x-[0.9em] gap-y-[0.3em]" style={{ fontSize: '0.82em' }}>
        {[
          ['AUTHORITY', cert.org],
          ['COURSE', cert.code ?? '—'],
          ['ISSUED', cert.issued ?? '—'],
          ['EXPIRES', cert.expires ?? '—'],
        ].map(([k, v]) => (
          <div key={k}>
            <dt style={{ color: INK_FAINT, letterSpacing: '0.12em', fontSize: '0.85em' }}>{k}</dt>
            <dd style={{ fontWeight: 600 }}>{v}</dd>
          </div>
        ))}
        {cert.exam && (
          <div className="col-span-2">
            <dt style={{ color: INK_FAINT, letterSpacing: '0.12em', fontSize: '0.85em' }}>EXAMINATION</dt>
            <dd style={{ fontWeight: 600 }}>{cert.exam}</dd>
          </div>
        )}
      </dl>
      {cert.verifyUrl && (
        <a
          href={cert.verifyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-[0.35em] mt-[0.6em] underline underline-offset-2"
          style={{ fontSize: '0.85em', color: INK[cert.title] ?? INK_TEXT, fontWeight: 700 }}
        >
          VERIFY CREDENTIAL <ExternalLink size={11} />
        </a>
      )}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* pages                                                               */
/* ------------------------------------------------------------------ */

const PageShell = ({
  children, side, folio, seed = 0,
}: { children: React.ReactNode; side: 'left' | 'right'; folio?: string; seed?: number }) => (
  <div
    className="w-full h-full relative overflow-hidden"
    style={{
      background: `linear-gradient(${side === 'right' ? '90deg' : '270deg'}, ${PAPER_EDGE} 0%, ${PAPER} 7%, ${PAPER} 100%)`,
      color: INK_TEXT,
    }}
  >
    <Guilloche seed={seed} />
    <div className="relative w-full h-full p-[1.15em]">{children}</div>
    {folio && (
      <div
        className={`absolute bottom-[0.7em] ${side === 'right' ? 'right-[1.2em]' : 'left-[1.2em]'}`}
        style={{ fontSize: '0.75em', color: INK_FAINT, letterSpacing: '0.1em' }}
      >
        {folio}
      </div>
    )}
  </div>
);

const CoverPage = ({ back = false }: { back?: boolean }) => {
  const id = useId().replace(/:/g, '');
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 30% 10%, #242d44 0%, ${COVER} 55%, #131827 100%)`,
        color: FOIL,
      }}
    >
      {/* foil rule just inside the trim, as on a real cover */}
      <div
        className="absolute inset-[0.5em] pointer-events-none"
        style={{ border: `0.09em solid ${FOIL}`, opacity: 0.4 }}
      />
      <div
        className="absolute inset-[0.7em] pointer-events-none"
        style={{ border: `0.04em solid ${FOIL}`, opacity: 0.22 }}
      />

      {/* engine-turned rosette behind the emblem, in foil */}
      <Guilloche seed={4} color={FOIL} opacity={0.4} />

      {!back ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-[0.8em] px-[1.4em] text-center">
          <div style={{ fontSize: '1.15em', letterSpacing: '0.3em', fontWeight: 700, lineHeight: 1.3 }}>
            SKILLS
          </div>
          <div style={{ fontSize: '1.15em', letterSpacing: '0.3em', fontWeight: 700, lineHeight: 1.3 }}>
            PASSPORT
          </div>

          <span
            className="relative flex items-center justify-center my-[0.5em]"
            style={{ width: '4.2em', height: '4.2em' }}
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              <circle cx="50" cy="50" r="46" fill="none" stroke={FOIL} strokeWidth="1.1" opacity="0.8" />
              <circle cx="50" cy="50" r="39" fill="none" stroke={FOIL} strokeWidth="0.5" opacity="0.5" />
              {Array.from({ length: 36 }, (_, i) => {
                const a = (i / 36) * Math.PI * 2;
                return (
                  <line
                    key={i}
                    x1={50 + Math.cos(a) * 40.5} y1={50 + Math.sin(a) * 40.5}
                    x2={50 + Math.cos(a) * 44} y2={50 + Math.sin(a) * 44}
                    stroke={FOIL} strokeWidth="0.6" opacity="0.55"
                  />
                );
              })}
            </svg>
            <Fingerprint size={33} strokeWidth={0.9} style={{ color: FOIL }} />
          </span>

          <div style={{ fontSize: '0.66em', letterSpacing: '0.3em', opacity: 0.8 }}>
            {holder.alias.toUpperCase()}
          </div>
          <div style={{ fontSize: '0.56em', letterSpacing: '0.24em', opacity: 0.5 }}>
            CREDENTIAL RECORD
          </div>

          {/* biometric passport symbol */}
          <div className="absolute bottom-[1.5em]" style={{ fontSize: '1.4em', opacity: 0.75 }}>⌖</div>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-end justify-center pb-[2em]">
          <div style={{ fontSize: '0.6em', letterSpacing: '0.3em', opacity: 0.45 }}>
            {holder.alias.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};

const NotePage = () => (
  <PageShell side="left" folio="i" seed={1}>
    <div className="h-full flex flex-col" style={{ fontSize: '0.95em' }}>
      <div
        className="pb-[0.4em] mb-[0.9em]"
        style={{ borderBottom: `0.1em solid ${INK_TEXT}`, letterSpacing: '0.22em', fontWeight: 700 }}
      >
        NOTICE
      </div>

      <p style={{ lineHeight: 1.75, marginBottom: '0.8em' }}>
        This passport records credentials earned through examination. Each stamp marks a
        sitting: the authority that issued it, and the date it was granted.
      </p>

      <ol
        className="flex flex-col gap-[0.55em] mb-[1em]"
        style={{ fontSize: '0.92em', lineHeight: 1.6, paddingLeft: '1.1em', listStyle: 'decimal' }}
      >
        <li>Stamps struck <strong>EXPIRED</strong> are no longer current. The holder remains rather proud of them regardless.</li>
        <li>Credentials marked with a verification link may be confirmed with the issuing authority.</li>
        <li>This document confers no right of entry, except to a shell.</li>
      </ol>

      <div className="mt-auto">
        <div className="pt-[0.7em]" style={{ borderTop: `0.08em solid ${INK_FAINT}55` }}>
          <div style={{ fontSize: '0.78em', color: INK_FAINT, letterSpacing: '0.14em' }}>
            SIGNATURE OF BEARER
          </div>
          <div style={{ fontFamily: 'cursive', fontSize: '1.7em', marginTop: '0.05em' }}>
            {holder.alias}
          </div>
        </div>

        <div className="flex items-end justify-between mt-[0.9em]">
          <div
            className="flex flex-col items-center justify-center"
            style={{
              border: `0.1em dashed ${INK_FAINT}88`,
              color: INK_FAINT,
              padding: '0.4em 0.7em',
              transform: 'rotate(-3deg)',
            }}
          >
            <span style={{ fontSize: '0.62em', letterSpacing: '0.2em', fontWeight: 700 }}>ISSUING OFFICE</span>
            <span style={{ fontSize: '0.72em', letterSpacing: '0.1em' }}>{holder.nationality.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: '0.62em', color: INK_FAINT, letterSpacing: '0.12em', textAlign: 'right' }}>
            THIS PASSPORT<br />CONTAINS 8 PAGES
          </div>
        </div>
      </div>
    </div>
  </PageShell>
);

const DataPage = () => {
  const [mrz1, mrz2] = mrzLines();
  const held = certifications.filter((c) => c.active).length;
  const rows: [string, string][] = [
    ['TYPE', 'P'],
    ['CODE', holder.nationalityCode],
    ['PASSPORT No.', `OS${holder.since}${held}`],
    ['SURNAME', holder.surname],
    ['GIVEN NAMES', holder.givenNames],
    ['NATIONALITY', holder.nationality.toUpperCase()],
    ['PROFESSION', holder.role.toUpperCase()],
    ['PRACTISING SINCE', String(holder.since)],
    ['DATE OF ISSUE', String(holder.since)],
    ['PLACE OF ISSUE', holder.nationality.toUpperCase()],
    ['CREDENTIALS', `${held} CURRENT · ${certifications.length - held} LAPSED`],
    ['AUTHORITY', holder.authority.toUpperCase()],
  ];

  return (
    <PageShell side="right" folio="1" seed={2}>
      <div className="h-full flex flex-col">
        <div
          className="flex items-baseline justify-between pb-[0.45em] mb-[0.9em]"
          style={{ borderBottom: `0.1em solid ${INK_TEXT}`, fontSize: '0.9em', letterSpacing: '0.2em', fontWeight: 700 }}
        >
          <span>PASSPORT</span>
          <span>{holder.nationalityCode}</span>
        </div>

        <div className="flex gap-[1.1em]">
          <div className="shrink-0" style={{ width: '6.4em' }}>
            <img
              src="/mugshot.png"
              alt=""
              className="w-full"
              style={{
                imageRendering: 'pixelated',
                border: `0.08em solid ${INK_FAINT}`,
                borderRadius: '0.35em',
                // a thin highlight inside the rule reads as a bevelled lamination
                boxShadow: 'inset 0 0 0 0.07em rgba(255,255,255,.45), 0 0.12em 0.3em rgba(0,0,0,.2)',
                filter: 'grayscale(0.55) contrast(1.15) sepia(0.15)',
              }}
            />
            <div
              className="mt-[0.35em] text-center"
              style={{ fontSize: '0.66em', letterSpacing: '0.12em', color: INK_FAINT }}
            >
              {holder.surname}
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-[0.9em] gap-y-[0.62em] content-start flex-1 min-w-0">
            {rows.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt
                  style={{
                    fontSize: '0.64em',
                    letterSpacing: '0.1em',
                    color: INK_FAINT,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {k}
                </dt>
                <dd
                  style={{
                    fontSize: '0.95em',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    lineHeight: 1.25,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ghost portrait and signature strip fill the gap above the MRZ,
            the way the real thing does */}
        <div className="relative flex-1 min-h-0 mt-[0.7em]">
          <img
            src="/mugshot.png"
            alt=""
            className="absolute right-0 bottom-0"
            style={{
              width: '4em',
              imageRendering: 'pixelated',
              opacity: 0.22,
              borderRadius: '50%',
              filter: 'grayscale(1) contrast(1.3)',
            }}
          />
          <div className="absolute left-0 bottom-0" style={{ width: '58%' }}>
            <div style={{ fontSize: '0.62em', letterSpacing: '0.14em', color: INK_FAINT }}>
              HOLDER'S SIGNATURE
            </div>
            <div
              style={{ fontFamily: 'cursive', fontSize: '1.45em', lineHeight: 1.1 }}
            >
              {holder.alias}
            </div>
            <div style={{ borderTop: `0.07em solid ${INK_FAINT}77`, marginTop: '0.15em' }} />
          </div>
        </div>

        <pre
          className="mt-[0.6em] pt-[0.5em] whitespace-pre overflow-hidden"
          style={{
            borderTop: `0.08em solid ${INK_FAINT}55`,
            fontSize: '0.66em',
            letterSpacing: '0.14em',
            lineHeight: 1.6,
            color: INK_TEXT,
          }}
        >{mrz1}{'\n'}{mrz2}</pre>
      </div>
    </PageShell>
  );
};

const StampPage = ({
  title, folio, side, seed, placed, openTitle, setOpenTitle,
}: {
  title: string; folio: string; side: 'left' | 'right'; seed: number;
  placed: Placed[]; openTitle: string | null; setOpenTitle: (t: string | null) => void;
}) => {
  const open = placed.find((p) => p.cert.title === openTitle);
  return (
    <PageShell side={side} folio={folio} seed={seed}>
      <div
        className="flex items-baseline justify-between"
        style={{ fontSize: '0.68em', letterSpacing: '0.24em', color: INK_FAINT }}
      >
        <span>VISAS / ENDORSEMENTS</span>
        <span>{title}</span>
      </div>
      <div className="absolute inset-0" onClick={() => setOpenTitle(null)}>
        {placed.map((p) => (
          <Stamp
            key={p.cert.title}
            placed={p}
            isOpen={p.cert.title === openTitle}
            onClick={() => setOpenTitle(openTitle === p.cert.title ? null : p.cert.title)}
          />
        ))}
        {open && <StampDetail cert={open.cert} onClose={() => setOpenTitle(null)} />}
      </div>
    </PageShell>
  );
};

/**
 * The route travelled, printed in the back of the book: one lane per
 * discipline, each sitting a stop down the line. Runs vertically because the
 * page is tall and narrow.
 */
const PathwayPage = () => {
  const ROUTE: Domain[] = [
    'Offensive Security', 'Web Security', 'AI Security', 'Security Assessment', 'Food Safety',
  ];
  const yearOf = (y: string) => parseInt(y, 10) || 0;

  return (
    <PageShell side="left" folio="8" seed={5}>
      <div
        className="pb-[0.45em] mb-[0.8em]"
        style={{ borderBottom: `0.1em solid ${INK_TEXT}`, fontSize: '0.9em', letterSpacing: '0.2em', fontWeight: 700 }}
      >
        ROUTE TRAVELLED
      </div>

      <div className="flex flex-col gap-[0.8em]">
        {ROUTE.map((domain) => {
          const stops = certifications
            .filter((c) => c.domain === domain)
            .sort((x, y) => yearOf(x.year) - yearOf(y.year));
          if (!stops.length) return null;
          return (
            <div key={domain}>
              <div
                style={{ fontSize: '0.6em', letterSpacing: '0.2em', color: INK_FAINT, marginBottom: '0.35em' }}
              >
                {domain.toUpperCase()}
              </div>
              {stops.map((c, i) => {
                const ink = INK[c.title] ?? INK_TEXT;
                return (
                  <div key={c.title} className="flex items-center" style={{ gap: '0.5em' }}>
                    {/* dot, with the line running on to the next stop */}
                    <span className="relative flex flex-col items-center" style={{ width: '0.8em' }}>
                      <span
                        style={{
                          width: '0.46em',
                          height: '0.46em',
                          borderRadius: '50%',
                          background: c.active ? ink : 'transparent',
                          border: `0.12em solid ${ink}`,
                          opacity: c.active ? 1 : 0.55,
                        }}
                      />
                      {i < stops.length - 1 && (
                        <span
                          className="absolute"
                          style={{
                            top: '0.46em',
                            width: '0.09em',
                            height: '1.1em',
                            background: ink,
                            opacity: 0.35,
                          }}
                        />
                      )}
                    </span>

                    <span
                      style={{
                        fontSize: '0.8em',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textDecoration: c.active ? 'none' : 'line-through',
                        opacity: c.active ? 1 : 0.6,
                      }}
                    >
                      {c.title}
                    </span>
                    <span
                      className="ml-auto"
                      style={{ fontSize: '0.68em', color: INK_FAINT, letterSpacing: '0.06em' }}
                    >
                      {c.year}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
};

/* ------------------------------------------------------------------ */
/* book                                                                */
/* ------------------------------------------------------------------ */

/** Stamps are hand-placed per page so they overlap the way a real book's do. */
const byTitle = (t: string) => certifications.find((c) => c.title === t)!;

const PAGE_A: Placed[] = [
  { cert: byTitle('OSCP'), x: 32, y: 34, rot: -9, scale: 1 },
  { cert: byTitle('CPSA'), x: 68, y: 40, rot: 7, scale: 0.86 },
  { cert: byTitle('CRT'), x: 38, y: 68, rot: 14, scale: 0.86 },
  { cert: byTitle('OSWE'), x: 72, y: 74, rot: -5, scale: 0.97 },
];
const PAGE_B: Placed[] = [
  { cert: byTitle('CRTO'), x: 38, y: 40, rot: -12, scale: 1 },
  { cert: byTitle('WSQ FSC L3'), x: 64, y: 70, rot: 8, scale: 0.88 },
];
const PAGE_C: Placed[] = [
  { cert: byTitle('OSEP'), x: 34, y: 36, rot: 6, scale: 0.98 },
  { cert: byTitle('OSAI'), x: 68, y: 46, rot: -8, scale: 1.04 },
  { cert: byTitle('OSAI+'), x: 46, y: 73, rot: 12, scale: 0.92 },
];

const PassportBook = ({ compact = false }: { compact?: boolean } = {}) => {
  const [flipped, setFlipped] = useState(0);
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  /**
   * The book is sized in `em` off one root font-size, so its text and its
   * footprint scale together — at sidebar size the type is too small to read.
   * Expanding lifts the same book (flip state and all) into an overlay where
   * the root font is big enough to actually read.
   */
  const [expanded, setExpanded] = useState(false);
  const timer = useRef<number | null>(null);

  const leaves = [
    { front: <CoverPage />, back: <NotePage /> },
    {
      front: <DataPage />,
      back: (
        <StampPage title="2019 — 2020" folio="2" side="left" seed={3}
          placed={PAGE_A} openTitle={openTitle} setOpenTitle={setOpenTitle} />
      ),
    },
    {
      front: (
        <StampPage title="2021 — 2024" folio="3" side="right" seed={4}
          placed={PAGE_B} openTitle={openTitle} setOpenTitle={setOpenTitle} />
      ),
      back: (
        <StampPage title="2026" folio="4" side="left" seed={6}
          placed={PAGE_C} openTitle={openTitle} setOpenTitle={setOpenTitle} />
      ),
    },
    { front: <PathwayPage />, back: <CoverPage back /> },
  ];

  const total = leaves.length;

  const go = (next: number) => {
    const target = Math.max(0, Math.min(total, next));
    if (target === flipped) return;
    setOpenTitle(null);
    setBusy(target > flipped ? flipped : target);
    setFlipped(target);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBusy(null), 950);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(flipped + 1);
      if (e.key === 'ArrowLeft') go(flipped - 1);
      if (e.key === 'Escape') { if (openTitle) setOpenTitle(null); else setExpanded(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const small = compact && !expanded;

  return (
    <div
      className={
        expanded
          ? 'fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 p-4 md:p-8 bg-background/95 backdrop-blur-sm'
          : 'w-full'
      }
      onClick={expanded ? (e) => { if (e.target === e.currentTarget) setExpanded(false); } : undefined}
    >
      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: '46em',
          fontSize: small ? 'clamp(5px, 1.28vw, 9.7px)' : 'clamp(10px, 2.3vmin, 20px)',
          aspectRatio: '1.42 / 1',
          perspective: '2600px',
        }}
      >
        {/* Only draw a board where a page actually sits: closed, the left half is
            empty air; fully open, the right half is. */}
        <div className="absolute inset-0 pointer-events-none">
          {flipped > 0 && (
            <div
              className="absolute left-0 top-0 w-1/2 h-full"
              style={{
                background: COVER,
                borderRadius: '0.6em 0 0 0.6em',
                boxShadow: '0 2.2em 4.5em -1.8em rgba(0,0,0,.8)',
              }}
            />
          )}
          {flipped < total && (
            <div
              className="absolute right-0 top-0 w-1/2 h-full"
              style={{
                background: COVER,
                borderRadius: '0 0.6em 0.6em 0',
                boxShadow: '0 2.2em 4.5em -1.8em rgba(0,0,0,.8)',
              }}
            />
          )}
          {flipped > 0 && flipped < total && (
            <div
              className="absolute left-1/2 top-0 h-full -translate-x-1/2 z-20"
              style={{
                width: '4%',
                background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.30) 45%, rgba(0,0,0,.30) 55%, rgba(0,0,0,0) 100%)',
              }}
            />
          )}
        </div>

        {leaves.map((leaf, i) => {
          const isFlipped = i < flipped;
          const z = busy === i ? total + 2 : isFlipped ? i : total - i;
          return (
            <div
              key={i}
              className="absolute top-0 left-1/2 w-1/2 h-full"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                transform: `rotateY(${isFlipped ? -180 : 0}deg)`,
                transition: 'transform .9s cubic-bezier(.36,.06,.24,1)',
                zIndex: z,
              }}
            >
              <div
                className="absolute inset-0 overflow-hidden"
                // front face shows as the right-hand page: trim its right corners
                style={{ backfaceVisibility: 'hidden', borderRadius: '0 0.6em 0.6em 0' }}
              >
                {leaf.front}
              </div>
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  // The leaf spins about the spine while the face spins about its
                  // own centre, so a back-face point at u lands at u - W: its LEFT
                  // edge becomes the book's left outer edge, its right the spine.
                  borderRadius: '0.6em 0 0 0.6em',
                }}
              >
                {leaf.back}
              </div>
            </div>
          );
        })}
      </div>

      {/* controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => go(flipped - 1)}
          disabled={flipped === 0}
          className="card-surface px-4 py-2 flex items-center gap-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} /> Back
        </button>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {flipped} / {total}
        </span>
        <button
          onClick={() => go(flipped + 1)}
          disabled={flipped === total}
          className="card-surface px-4 py-2 flex items-center gap-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next <ChevronRight size={15} />
        </button>
        {compact && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="card-surface px-3 py-2 flex items-center gap-2 text-sm"
            aria-label={expanded ? 'Shrink the passport' : 'Open the passport larger'}
          >
            {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        )}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-3 font-mono">
        {expanded
          ? '← → to turn pages · click a stamp for details · esc to close'
          : '← → to turn pages · ⤢ to enlarge'}
      </p>
    </div>
  );
};

export default PassportBook;
