/* Reusable SVG charts. Pure render from data; styled via styles.ts. */
import React, { useRef, useState } from "react";
import { sgdShort } from "./format";

const PAD = { l: 18, r: 10, t: 10, b: 10 };

function scale(min: number, max: number, lo: number, hi: number) {
  const span = max - min || 1;
  return (v: number) => lo + ((v - min) / span) * (hi - lo);
}

/** Map a pointer event over an SVG to the nearest data index (evenly spaced x). */
function useHoverIndex(W: number, count: number) {
  const ref = useRef<SVGSVGElement>(null);
  const [idx, setIdx] = useState<number | null>(null);
  const onMove = (e: React.PointerEvent) => {
    const svg = ref.current; if (!svg || count < 2) return;
    const rect = svg.getBoundingClientRect();
    const vx = ((e.clientX - rect.left) / rect.width) * W;
    const frac = (vx - PAD.l) / (W - PAD.l - PAD.r);
    setIdx(Math.max(0, Math.min(count - 1, Math.round(frac * (count - 1)))));
  };
  return { ref, idx, onMove, onLeave: () => setIdx(null) };
}

interface TipRow { label: string; value: number; color?: string; }
function Tooltip({ leftPct, head, rows, total }: { leftPct: number; head: string; rows: TipRow[]; total?: number }) {
  const clamped = Math.max(13, Math.min(87, leftPct));
  return (
    <div className="chart-tip" style={{ left: `${clamped}%` }}>
      <div className="tt-head">{head}</div>
      {rows.map((r) => (
        <div key={r.label} className="tt-row">
          <span>{r.color && <i style={{ background: r.color }} />}{r.label}</span><b>{sgdShort(r.value)}</b>
        </div>
      ))}
      {total != null && <div className="tt-row tt-total"><span>Total</span><b>{sgdShort(total)}</b></div>}
    </div>
  );
}

/* ---- stacked area (CPF accounts / wealth) ---- */
export function StackedArea({
  points, series, markers = [], W = 580, H = 220, xLabel = (x) => `age ${x}`,
}: {
  points: Record<string, number>[];   // each has x + series keys
  series: { key: string; color: string; opacity?: number; label?: string }[];
  markers?: { x: number; label?: string; bold?: boolean }[];
  W?: number; H?: number; xLabel?: (x: number) => string;
}) {
  const hover = useHoverIndex(W, points.length);
  if (points.length < 2) return null;
  const xs = points.map((p) => p.x);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const totals = points.map((p) => series.reduce((s, k) => s + (p[k.key] || 0), 0));
  const maxY = Math.max(...totals, 1) * 1.06;
  const X = scale(minX, maxX, PAD.l, W - PAD.r);
  const Y = scale(0, maxY, H - PAD.b, PAD.t);

  const bands = series.map((s, i) => {
    const lo = (p: Record<string, number>) => series.slice(0, i).reduce((a, k) => a + (p[k.key] || 0), 0);
    const hi = (p: Record<string, number>) => lo(p) + (p[s.key] || 0);
    const top = points.map((p, j) => `${j ? "L" : "M"}${X(p.x).toFixed(1)} ${Y(hi(p)).toFixed(1)}`).join(" ");
    const bot = [...points].reverse().map((p) => `L${X(p.x).toFixed(1)} ${Y(lo(p)).toFixed(1)}`).join(" ");
    return { d: `${top} ${bot} Z`, color: s.color, opacity: s.opacity ?? 0.85 };
  });

  const ticks = [0.25, 0.5, 0.75, 1].map((f) => ({ y: Y(maxY * f), v: maxY * f }));
  const hp = hover.idx != null ? points[hover.idx] : null;

  return (
    <div className="chart-wrap">
      <svg ref={hover.ref} viewBox={`0 0 ${W} ${H}`} className="chart" onPointerMove={hover.onMove} onPointerLeave={hover.onLeave}>
        {ticks.map((t, i) => (
          <line key={i} x1={PAD.l} y1={t.y} x2={W - PAD.r} y2={t.y} className="gridline" />
        ))}
        {bands.map((b, i) => <path key={i} d={b.d} fill={b.color} opacity={b.opacity} />)}
        {markers.map((m, i) => (
          <line key={i} x1={X(m.x)} y1={PAD.t} x2={X(m.x)} y2={H - PAD.b}
            className="marker" style={{ stroke: m.bold ? "rgba(255,255,255,.85)" : undefined }} />
        ))}
        {hp && <line x1={X(hp.x)} y1={PAD.t} x2={X(hp.x)} y2={H - PAD.b} className="hover-line" />}
        {hp && <circle cx={X(hp.x)} cy={Y(series.reduce((s, k) => s + (hp[k.key] || 0), 0))} r={3.5} className="hover-dot" />}
      </svg>
      {ticks.map((t, i) => (
        <span key={i} className="chart-ylabel" style={{ top: `${(t.y / H) * 100}%`, left: `${(PAD.l / W) * 100}%` }}>{sgdShort(t.v)}</span>
      ))}
      {hp && <Tooltip leftPct={(X(hp.x) / W) * 100} head={xLabel(hp.x)}
        rows={[...series].reverse().map((s) => ({ label: s.label || s.key, value: hp[s.key] || 0, color: s.color }))}
        total={series.reduce((s, k) => s + (hp[k.key] || 0), 0)} />}
    </div>
  );
}

/* ---- single balance series with accumulation→drawdown colouring ---- */
export function BalanceChart({
  points, retireAge, depletionAge, W = 580, H = 220,
}: {
  points: { age: number; balance: number; phase: "accum" | "draw" }[];
  retireAge: number; depletionAge?: number | null; W?: number; H?: number;
}) {
  const hover = useHoverIndex(W, points.length);
  if (points.length < 2) return null;
  const ages = points.map((p) => p.age);
  const minX = Math.min(...ages), maxX = Math.max(...ages);
  const maxY = Math.max(...points.map((p) => p.balance), 1) * 1.08;
  const X = scale(minX, maxX, PAD.l, W - PAD.r);
  const Y = scale(0, maxY, H - PAD.b, PAD.t);
  const baseY = H - PAD.b;

  const area = (pts: typeof points) => {
    if (pts.length < 2) return "";
    const top = pts.map((p, j) => `${j ? "L" : "M"}${X(p.age).toFixed(1)} ${Y(p.balance).toFixed(1)}`).join(" ");
    return `${top} L${X(pts[pts.length - 1].age).toFixed(1)} ${baseY} L${X(pts[0].age).toFixed(1)} ${baseY} Z`;
  };
  const accum = points.filter((p) => p.age <= retireAge);
  const drawStart = points.findIndex((p) => p.age >= retireAge);
  const draw = points.slice(Math.max(0, drawStart));
  const ticks = [0.5, 1].map((f) => ({ y: Y(maxY * f), v: maxY * f }));
  const hp = hover.idx != null ? points[hover.idx] : null;

  return (
    <div className="chart-wrap">
      <svg ref={hover.ref} viewBox={`0 0 ${W} ${H}`} className="chart" onPointerMove={hover.onMove} onPointerLeave={hover.onLeave}>
        {ticks.map((t, i) => (
          <line key={i} x1={PAD.l} y1={t.y} x2={W - PAD.r} y2={t.y} className="gridline" />
        ))}
        <path d={area(accum)} fill="var(--jade)" opacity={0.85} />
        <path d={area(draw)} fill="var(--coral)" opacity={0.8} />
        <line x1={X(retireAge)} y1={PAD.t} x2={X(retireAge)} y2={baseY} className="marker" />
        {depletionAge && depletionAge <= maxX && (
          <line x1={X(depletionAge)} y1={PAD.t} x2={X(depletionAge)} y2={baseY}
            style={{ stroke: "var(--bad)", strokeWidth: 1.5, strokeDasharray: "2 2" }} />
        )}
        {hp && <line x1={X(hp.age)} y1={PAD.t} x2={X(hp.age)} y2={baseY} className="hover-line" />}
        {hp && <circle cx={X(hp.age)} cy={Y(hp.balance)} r={3.5} className="hover-dot" />}
      </svg>
      {ticks.map((t, i) => (
        <span key={i} className="chart-ylabel" style={{ top: `${(t.y / H) * 100}%`, left: `${(PAD.l / W) * 100}%` }}>{sgdShort(t.v)}</span>
      ))}
      <span className="chart-note-html" style={{ left: `${(X(retireAge) / W) * 100}%`, top: `${(PAD.t / H) * 100}%` }}>retire {retireAge}</span>
      {hp && <Tooltip leftPct={(X(hp.age) / W) * 100} head={`age ${hp.age}`}
        rows={[{ label: hp.age <= retireAge ? "Building" : "Drawing down", value: hp.balance, color: hp.age <= retireAge ? "var(--jade)" : "var(--coral)" }]} />}
    </div>
  );
}

/* ---- net-worth sparkline ---- */
export function Sparkline({ values, W = 260, H = 56, color = "var(--jade)" }:
  { values: number[]; W?: number; H?: number; color?: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const X = scale(0, values.length - 1, 2, W - 2);
  const Y = scale(min, max, H - 4, 4);
  const d = values.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  const fill = `${d} L${X(values.length - 1).toFixed(1)} ${H} L${X(0).toFixed(1)} ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" preserveAspectRatio="none" style={{ height: H }}>
      <path d={fill} fill={color} opacity={0.12} />
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ---- donut allocation ---- */
export function Donut({ slices, size = 132 }: { slices: { label: string; value: number; color: string }[]; size?: number }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = size / 2, r = R * 0.62, cx = R, cy = R;
  let a0 = -Math.PI / 2;
  const arcs = slices.filter((s) => s.value > 0).map((s) => {
    const frac = s.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const p = (ang: number, rad: number) => `${(cx + rad * Math.cos(ang)).toFixed(2)} ${(cy + rad * Math.sin(ang)).toFixed(2)}`;
    const d = `M${p(a0, R)} A${R} ${R} 0 ${large} 1 ${p(a1, R)} L${p(a1, r)} A${r} ${r} 0 ${large} 0 ${p(a0, r)} Z`;
    a0 = a1;
    return { d, color: s.color };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, flexShrink: 0 }}>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} />)}
    </svg>
  );
}
