/* Shared presentational primitives. All styling comes from styles.ts. */
import React, { useState } from "react";
import { ChevronDown, Info, Plus } from "lucide-react";
import { useCountUp } from "./format";

export function Field({
  label, value, onChange, prefix = "S$", step = 100, min = 0, max, hint,
}: {
  label: string; value: number; onChange: (n: number) => void;
  prefix?: string; step?: number; min?: number; max?: number; hint?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}{hint && <em>{hint}</em>}</span>
      <span className="field-box">
        {prefix && <span className="field-pre">{prefix}</span>}
        <input
          type="number" value={Number.isFinite(value) ? value : 0} step={step} min={min} max={max}
          onChange={(e) => {
            let n = Number(e.target.value);
            if (!Number.isFinite(n)) n = 0;
            if (min != null) n = Math.max(min, n);
            if (max != null) n = Math.min(max, n);
            onChange(n);
          }}
        />
      </span>
    </label>
  );
}

export function TextField({
  label, value, onChange, placeholder, maxLength = 48,
}: { label?: string; value: string; onChange: (s: string) => void; placeholder?: string; maxLength?: number }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <span className="field-box text">
        <input value={value} placeholder={placeholder} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} />
      </span>
    </label>
  );
}

export function Slider({
  label, value, onChange, min, max, step, fmt,
}: {
  label: string; value: number; onChange: (n: number) => void;
  min: number; max: number; step: number; fmt: (v: number) => string;
}) {
  return (
    <label className="slider">
      <span className="slider-top"><span className="field-label" style={{ margin: 0 }}>{label}</span><span className="v">{fmt(value)}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export function Segmented<T extends string>({
  value, onChange, options,
}: { value: T; onChange: (v: T) => void; options: { value: T; label: React.ReactNode }[] }) {
  return (
    <div className="seg" role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value}
          className={value === o.value ? "on" : ""} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Select<T extends string>({
  value, onChange, options, ariaLabel,
}: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; ariaLabel?: string }) {
  return (
    <select className="bare" aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

/** Animated number. `render` maps the live (tweened) value to a string. */
export function Money({ value, render }: { value: number; render: (v: number) => string }) {
  const d = useCountUp(value);
  return <>{render(d)}</>;
}

export function Working({ children, label = "Show the working" }: { children: React.ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="working">
      <button className="working-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Info size={13} /> {label} <ChevronDown size={14} className={open ? "rot" : ""} />
      </button>
      {open && <div className="working-body">{children}</div>}
    </div>
  );
}

export type Tone = "ok" | "warn" | "bad" | "neutral";
export function Chip({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`chip ${tone === "neutral" ? "" : tone}`}>{children}</span>;
}

export interface BarSeg { label: string; value: number; color: string; }
export function StackBar({ segments, total, tall, showLabels = true }:
  { segments: BarSeg[]; total: number; tall?: boolean; showLabels?: boolean }) {
  const t = total || segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className={`bar${tall ? " tall" : ""}`}>
      {segments.filter((s) => s.value > 0).map((s) => (
        <div key={s.label} className="bar-seg" title={`${s.label}: ${Math.round(s.value).toLocaleString()}`}
          style={{ width: `${(s.value / t) * 100}%`, background: s.color }}>
          {showLabels && (s.value / t) > 0.1 ? s.label : ""}
        </div>
      ))}
    </div>
  );
}

export function Progress({ value, tone = "jade" }: { value: number; tone?: "jade" | "coral" | "gold" }) {
  const cls = tone === "jade" ? "" : tone;
  return <div className="prog"><div className={`prog-fill ${cls}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

export function Action({ tone = "good", icon, title, children, cta, onCta }:
  { tone?: "good" | "do" | "warn"; icon: React.ReactNode; title: React.ReactNode; children?: React.ReactNode; cta?: string; onCta?: () => void }) {
  const cls = tone === "good" ? "" : tone;
  return (
    <div className={`action ${cls}`}>
      <div className="action-ico">{icon}</div>
      <div className="grow">
        <h4>{title}</h4>
        {children && <p>{children}</p>}
      </div>
      {cta && onCta && (
        <button className="btn sm" onClick={onCta} style={{ alignSelf: "center", flexShrink: 0, whiteSpace: "nowrap" }}>
          <Plus size={13} /> {cta}
        </button>
      )}
    </div>
  );
}

export function Stat({ label, children, sub }: { label: string; children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div>
      <div className="stat-label">{label}</div>
      <div className="stat-big num" style={{ marginTop: 4 }}>{children}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
