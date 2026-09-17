import { useId } from 'react';
import { type Certification } from '@/data/certificationsData';

/**
 * The stamp marks themselves, shared by the passport book and the flat record
 * so both pages strike the same ink.
 */

export const PAPER = '#ece5d5';

/* Stamp inks, picked to sit on cream rather than on the site's dark surfaces. */
export const INK: Record<string, string> = {
  OSCP: '#9b2c2c',
  OSWE: '#53307f',
  OSEP: '#96551c',
  OSAI: '#a3123c',
  'OSAI+': '#a3123c',
  CRTO: '#8d2b4a',
  CPSA: '#26496f',
  CRT: '#1d5a63',
  'WSQ FSC L3': '#6d5a1c',
};

/** Authority names shortened to fit the arc of a stamp. */
export const SHORT_ORG: Record<string, string> = {
  'SkillsFuture Singapore': 'SKILLSFUTURE SG',
  'Zero-Point Security': 'ZERO-POINT SEC',
};

const PAPER_EDGE = '#ded5c0';
const INK_TEXT = '#2b2721';
const INK_FAINT = '#6f6558';
const COVER = '#1a2133';
const FOIL = '#c9ab63';

/* ------------------------------------------------------------------ */
/* security background                                                 */
/* ------------------------------------------------------------------ */

/** Guilloche-ish rosette lines, the fine engraving printed under passport pages. */
const Guilloche = ({ seed = 0 }: { seed?: number }) => {
  const id = useId().replace(/:/g, '');
  const rings = Array.from({ length: 26 }, (_, i) => i);
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 200 140"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`fade${id}`}>
          <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`m${id}`}>
          <rect width="200" height="140" fill={`url(#fade${id})`} />
        </mask>
      </defs>
      <g mask={`url(#m${id})`} stroke={INK_TEXT} fill="none" strokeWidth="0.18" opacity="0.2">
        {rings.map((i) => (
          <ellipse
            key={i}
            cx={100 + Math.sin(i * 0.7 + seed) * 16}
            cy={70 + Math.cos(i * 0.9 + seed) * 10}
            rx={12 + i * 3.1}
            ry={9 + i * 2.2}
            transform={`rotate(${i * 7 + seed * 20} 100 70)`}
          />
        ))}
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* stamps                                                              */
/* ------------------------------------------------------------------ */

interface Placed {
  cert: Certification;
  /** percentage position within the page, plus a fixed rotation */
  x: number;
  y: number;
  rot: number;
  scale: number;
}

/** Passport-style date: "04 SEP 2026" when we know the day, else the year. */
export const stampDate = (c: Certification) => {
  const m = c.issued?.match(/^(\d{1,2}) (\w+) (\d{4})$/);
  return m ? `${m[1].padStart(2, '0')} ${m[2].slice(0, 3).toUpperCase()} ${m[3]}` : c.year;
};

/** Rubber stamps never print cleanly — this roughens the edges a little. */
const RoughFilter = ({ id }: { id: string }) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n" />
    <feDisplacementMap in="SourceGraphic" in2="n" scale="1.1" xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

/** Round postmark — used for the OffSec sittings. */
export const CircleStamp = ({ cert, ink }: { cert: Certification; ink: string }) => {
  const id = useId().replace(/:/g, '');
  const Icon = cert.icon;
  const teeth = Array.from({ length: 48 }, (_, i) => i);
  return (
    <span className="block relative" style={{ width: '7.7em', height: '7.7em', color: ink }}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <defs>
          <RoughFilter id={`r${id}`} />
          <path id={`top${id}`} d="M50,50 m-38,0 a38,38 0 0,1 76,0" fill="none" />
          <path id={`bot${id}`} d="M50,50 m-33,0 a33,33 0 0,0 66,0" fill="none" />
        </defs>
        <g filter={`url(#r${id})`} stroke="currentColor" fill="none">
          {/* serrated outer edge */}
          {teeth.map((i) => {
            const a = (i / teeth.length) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 47.5} y1={50 + Math.sin(a) * 47.5}
                x2={50 + Math.cos(a) * 49.6} y2={50 + Math.sin(a) * 49.6}
                strokeWidth="0.8"
              />
            );
          })}
          <circle cx="50" cy="50" r="46.5" strokeWidth="2.4" />
          <circle cx="50" cy="50" r="42" strokeWidth="0.7" />
          <circle cx="50" cy="50" r="27" strokeWidth="0.7" strokeDasharray="1.4 2.2" />
          <line x1="14" y1="50" x2="21" y2="50" strokeWidth="1.4" />
          <line x1="79" y1="50" x2="86" y2="50" strokeWidth="1.4" />
          {/* flanking stars */}
          {[18.5, 81.5].map((cx) => (
            <path
              key={cx}
              d={`M${cx} 61 l1.1 2.7 2.9.2-2.2 1.9.7 2.8-2.5-1.5-2.5 1.5.7-2.8-2.2-1.9 2.9-.2z`}
              fill="currentColor" stroke="none"
            />
          ))}
        </g>
        <g filter={`url(#r${id})`} fill="currentColor">
          <text style={{ fontSize: '7.2px', letterSpacing: '0.15em', fontWeight: 700 }}>
            <textPath href={`#top${id}`} startOffset="50%" textAnchor="middle">
              {(SHORT_ORG[cert.org] ?? cert.org).toUpperCase()}
            </textPath>
          </text>
          <text style={{ fontSize: '6.4px', letterSpacing: '0.2em', fontWeight: 700 }}>
            <textPath href={`#bot${id}`} startOffset="50%" textAnchor="middle">
              {stampDate(cert)}
            </textPath>
          </text>
        </g>
      </svg>

      <span
        className="absolute inset-0 flex flex-col items-center justify-center gap-[0.1em]"
        style={{ transform: 'translateY(-0.5em)' }}
      >
        <Icon size={22} />
        <span
          style={{
            fontSize: cert.title.length <= 5 ? '1.15em' : cert.title.length <= 8 ? '0.85em' : '0.64em',
            fontWeight: 800, letterSpacing: '0.05em', lineHeight: 1, whiteSpace: 'nowrap',
          }}
        >
          {cert.title}
        </span>
        {cert.code && (
          <span style={{ fontSize: '0.56em', letterSpacing: '0.16em', opacity: 0.8 }}>
            {cert.code}
          </span>
        )}
      </span>
    </span>
  );
};

/** Boxed entry stamp — the other authorities, so the page isn't all circles. */
export const RectStamp = ({ cert, ink }: { cert: Certification; ink: string }) => {
  const id = useId().replace(/:/g, '');
  const Icon = cert.icon;
  return (
    <span className="block relative" style={{ width: '8.6em', height: '4.9em', color: ink }}>
      <svg viewBox="0 0 116 66" className="absolute inset-0 w-full h-full overflow-visible">
        <defs><RoughFilter id={`r${id}`} /></defs>
        <g filter={`url(#r${id})`} stroke="currentColor" fill="none">
          <rect x="2.5" y="2.5" width="111" height="61" rx="5" strokeWidth="2.2" />
          <rect x="6" y="6" width="104" height="54" rx="3" strokeWidth="0.7" />
          <line x1="40" y1="10" x2="40" y2="56" strokeWidth="0.7" strokeDasharray="1.4 2" />
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={46 + i * 4.6} y1="52" x2={48 + i * 4.6} y2="52" strokeWidth="0.9" />
          ))}
        </g>
      </svg>
      <span className="absolute inset-0 flex items-center" style={{ padding: '0 0.7em' }}>
        <span className="flex flex-col items-center justify-center" style={{ width: '2.5em' }}>
          <Icon size={19} />
        </span>
        <span className="flex flex-col justify-center" style={{ marginLeft: '0.6em' }}>
          <span style={{ fontSize: '0.55em', letterSpacing: '0.18em', fontWeight: 700, opacity: 0.85 }}>
            {(SHORT_ORG[cert.org] ?? cert.org).toUpperCase()}
          </span>
          <span
            style={{
              fontSize: cert.title.length <= 5 ? '1.25em' : '0.86em',
              fontWeight: 800, letterSpacing: '0.04em', lineHeight: 1.1, whiteSpace: 'nowrap',
            }}
          >
            {cert.title}
          </span>
          <span style={{ fontSize: '0.6em', letterSpacing: '0.16em', fontWeight: 700 }}>
            {stampDate(cert)}
          </span>
        </span>
      </span>
    </span>
  );
};

/** One struck stamp: round for OffSec sittings, boxed for everyone else. */
export const StampMark = ({ cert, scale = 1 }: { cert: Certification; scale?: number }) => {
  const ink = INK[cert.title] ?? '#7a2b2b';
  const round = cert.org === 'OffSec';
  return (
    <span className="block relative" style={{ transform: `scale(${scale})` }}>
      {round ? <CircleStamp cert={cert} ink={ink} /> : <RectStamp cert={cert} ink={ink} />}
      {!cert.active && (
        <span
          className="absolute left-1/2 whitespace-nowrap"
          style={{
            top: round ? '70%' : '50%',
            transform: 'translate(-50%, -50%) rotate(-13deg)',
            border: '0.14em solid currentColor',
            color: ink,
            padding: '0.05em 0.35em',
            fontSize: '0.9em',
            fontWeight: 800,
            letterSpacing: '0.18em',
            background: PAPER,
          }}
        >
          EXPIRED
        </span>
      )}
    </span>
  );
};
