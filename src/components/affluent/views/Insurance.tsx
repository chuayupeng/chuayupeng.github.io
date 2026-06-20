import React, { useState } from "react";
import { ShieldCheck, Plus, Trash2, Activity, CheckCircle2, XCircle, AlertTriangle, HeartPulse } from "lucide-react";
import { useStore, uid, Policy, PolicyType } from "../store";
import { useDerived } from "../derive";
import { sgd, sgdShort, pct } from "../format";
import { Field, Slider, Select, Working, Action, Chip } from "../ui";
import { MSL, mslPremium, mslOutOfPocket, wardDeductible } from "../calc/insurance";

const PTYPES: { value: PolicyType; label: string }[] = [
  { value: "term_life", label: "Term life" }, { value: "whole_life", label: "Whole life" },
  { value: "ci", label: "Critical illness" }, { value: "early_ci", label: "Early CI" }, { value: "tpd", label: "TPD" },
  { value: "hospitalisation", label: "Hospitalisation (IP)" }, { value: "disability_income", label: "Disability income" },
  { value: "personal_accident", label: "Personal accident" }, { value: "mortgage", label: "Mortgage" },
  { value: "endowment", label: "Endowment" }, { value: "ilp", label: "ILP" }, { value: "other", label: "Other" },
];

const statusChip = (s: string) =>
  s === "covered" ? <Chip tone="ok"><CheckCircle2 size={12} /> Covered</Chip>
    : s === "short" ? <Chip tone="warn"><AlertTriangle size={12} /> Short</Chip>
      : <Chip tone="bad"><XCircle size={12} /> Missing</Chip>;

export default function Insurance() {
  const { state, set } = useStore();
  const d = useDerived();
  const ins = state.insurance;
  const [bill, setBill] = useState(25000);

  const ded = wardDeductible(ins.inputs.ipWard);
  const oop = mslOutOfPocket(bill, ded);
  const premium = mslPremium(d.age + 1);

  const setPolicy = (id: string, patch: Partial<Policy>) =>
    set("insurance", (p) => ({ ...p, policies: p.policies.map((x) => x.id === id ? { ...x, ...patch } : x) }));
  const addPolicy = () =>
    set("insurance", (p) => ({ ...p, policies: [...p.policies, { id: uid(), name: "New policy", insurer: "—", type: "term_life", deathBenefit: 0, tpdBenefit: 0, ciBenefit: 0, annualPremium: 0 }] }));
  const rmPolicy = (id: string) =>
    set("insurance", (p) => ({ ...p, policies: p.policies.filter((x) => x.id !== id) }));
  const setInput = (patch: Partial<typeof ins.inputs>) =>
    set("insurance", (p) => ({ ...p, inputs: { ...p.inputs, ...patch } }));

  const premiumOverBudget = d.cov.annualPremium > d.needs.premiumBudget;

  return (
    <div className="grid g2">
      {/* coverage checklist */}
      <section className="card span2">
        <div className="eyebrow"><ShieldCheck size={14} /> Is everything covered?</div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Risk</th><th>You need</th><th>You have</th><th>Gap</th><th style={{ textAlign: "right" }}>Status</th></tr></thead>
            <tbody>
              {d.checklist.map((c) => (
                <tr key={c.key}>
                  <td style={{ textAlign: "left" }}>
                    <div className="lr-name">{c.key}</div>
                    <div className="lr-sub">{c.note}</div>
                  </td>
                  <td className="num">{c.need == null ? "—" : sgdShort(c.need)}</td>
                  <td className="num">{c.need == null ? (c.have ? "Yes" : "No") : sgdShort(c.have)}</td>
                  <td className="num" style={{ color: c.gap > 0 ? "var(--coral)" : "var(--muted)" }}>{c.gap > 0 ? sgdShort(c.gap) : "—"}</td>
                  <td style={{ textAlign: "right" }}>{statusChip(c.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="note" style={{ marginTop: 10 }}>
          Sized on your numbers via DIME (debts + income replacement + mortgage + dependants' education). The 9× income rule of thumb suggests ≈ {sgdShort(d.needs.benchmark9x)} of death cover as a cross-check.
        </div>
      </section>

      {/* needs inputs */}
      <section className="card">
        <div className="eyebrow"><HeartPulse size={14} /> Your situation</div>
        <Slider label="Dependants" value={ins.inputs.dependents} onChange={(n) => setInput({ dependents: n })} min={0} max={6} step={1} fmt={(v) => `${v}`} />
        <Slider label="Years of income to replace" value={ins.inputs.incomeYearsToReplace} onChange={(n) => setInput({ incomeYearsToReplace: n })} min={0} max={25} step={1} fmt={(v) => `${v} yrs`} />
        <Field label="Education cost / child" value={ins.inputs.eduPerChild} onChange={(n) => setInput({ eduPerChild: n })} step={10000} />
        <Field label="Final expenses buffer" value={ins.inputs.finalExpenses} onChange={(n) => setInput({ finalExpenses: n })} step={5000} />
        <div className="hr" />
        <div className="between" style={{ marginBottom: 6 }}>
          <span className="field-label" style={{ margin: 0 }}>Preferred hospital ward</span>
          <Select value={ins.inputs.ipWard} onChange={(v) => setInput({ ipWard: v })}
            options={[{ value: "C", label: "Class C" }, { value: "B2", label: "Class B2/B1" }, { value: "A", label: "Class A / private" }]} />
        </div>
        <div className="card tight" style={{ marginTop: 10 }}>
          <div className="between"><span className="muted" style={{ fontSize: 12.5 }}>Premium budget (15% take-home)</span><span className="num" style={{ fontWeight: 600 }}>{sgd(d.needs.premiumBudget)}/yr</span></div>
          <div className="between" style={{ marginTop: 6 }}><span className="muted" style={{ fontSize: 12.5 }}>You pay now</span>
            <span className="num" style={{ fontWeight: 600, color: premiumOverBudget ? "var(--coral)" : "var(--jade)" }}>{sgd(d.cov.annualPremium)}/yr</span></div>
        </div>
      </section>

      {/* MediShield Life scenario */}
      <section className="card">
        <div className="eyebrow"><Activity size={14} /> Hospitalisation — what MediShield Life covers</div>
        <div className="between" style={{ alignItems: "flex-end", marginBottom: 10 }}>
          <div>
            <div className="stat-mid num">{sgd(premium)}<span className="per">/yr</span></div>
            <div className="stat-sub">MediShield Life premium (age {d.age + 1}) — paid from MediSave</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12 }}>
            <div className="muted">Deductible ({ins.inputs.ipWard}) <b className="num" style={{ color: "var(--ink)" }}>{sgd(ded)}</b></div>
            <div className="muted">Claim limit <b className="num" style={{ color: "var(--ink)" }}>{sgdShort(MSL.annualLimit)}</b></div>
          </div>
        </div>
        <Slider label="On a hospital bill of" value={bill} onChange={setBill} min={2000} max={150000} step={1000} fmt={sgd} />
        <div className="bar tall">
          <div className="bar-seg" style={{ width: `${Math.min(100, (oop.oop / bill) * 100)}%`, background: "var(--coral)" }}>you {sgdShort(oop.oop)}</div>
          <div className="bar-seg" style={{ width: `${Math.max(0, 100 - (oop.oop / bill) * 100)}%`, background: "var(--jade)" }}>MediShield {sgdShort(oop.covered)}</div>
        </div>
        <div className="note" style={{ marginTop: 8 }}>
          deductible {sgd(oop.dedPart)} + co-insurance {sgd(oop.coins)} = <b>{sgd(oop.oop)}</b> out of pocket.
          {ins.inputs.ipWard === "A" ? " An Integrated Shield Plan covers private wards beyond this." : ""}
        </div>
      </section>

      {/* policies */}
      <section className="card span2">
        <div className="between" style={{ marginBottom: 12 }}>
          <div className="eyebrow" style={{ margin: 0 }}><ShieldCheck size={14} /> Your policies</div>
          <button className="btn sm" onClick={addPolicy}><Plus size={14} /> Add policy</button>
        </div>
        <div className="tbl-wrap">
          <table className="tbl compact" style={{ minWidth: 760 }}>
            <thead><tr><th>Policy</th><th>Type</th><th>Death</th><th>TPD</th><th>CI</th><th>Premium/yr</th><th></th></tr></thead>
            <tbody>
              {ins.policies.map((p) => (
                <tr key={p.id}>
                  <td style={{ textAlign: "left" }}>
                    <input className="bare" maxLength={48} style={{ width: "100%", minWidth: 180, padding: "6px 8px", fontFamily: "inherit" }}
                      value={p.name} onChange={(e) => setPolicy(p.id, { name: e.target.value })} />
                  </td>
                  <td style={{ textAlign: "left" }}><Select value={p.type} onChange={(v) => setPolicy(p.id, { type: v })} options={PTYPES} /></td>
                  <td><PCell value={p.deathBenefit} onChange={(n) => setPolicy(p.id, { deathBenefit: n })} /></td>
                  <td><PCell value={p.tpdBenefit} onChange={(n) => setPolicy(p.id, { tpdBenefit: n })} /></td>
                  <td><PCell value={p.ciBenefit} onChange={(n) => setPolicy(p.id, { ciBenefit: n })} /></td>
                  <td><PCell value={p.annualPremium} onChange={(n) => setPolicy(p.id, { annualPremium: n })} step={50} /></td>
                  <td><button className="icon-btn" onClick={() => rmPolicy(p.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
              {ins.policies.length === 0 && (
                <tr><td colSpan={7} className="empty" style={{ textAlign: "center" }}>No policies yet — add your life, CI, hospitalisation and other cover to see your gaps.</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 700 }}>
                <td>Totals</td><td></td>
                <td className="num" style={{ borderTop: "2px solid var(--line2)" }}>{sgdShort(d.cov.life)}</td>
                <td className="num" style={{ borderTop: "2px solid var(--line2)" }}>{sgdShort(d.cov.tpd)}</td>
                <td className="num" style={{ borderTop: "2px solid var(--line2)" }}>{sgdShort(d.cov.ci)}</td>
                <td className="num" style={{ borderTop: "2px solid var(--line2)" }}>{sgd(d.cov.annualPremium)}</td><td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* actions */}
      <section className="card span2">
        <div className="eyebrow"><CheckCircle2 size={14} /> Close the gaps</div>
        <div className="grid g2" style={{ gap: 10 }}>
          {d.checklist.filter((c) => c.status !== "covered").map((c) => (
            <Action key={c.key} tone={c.status === "missing" ? "do" : "warn"} icon={<ShieldCheck size={16} />}
              title={c.need == null ? `Add ${c.key.toLowerCase()}` : `${c.key}: top up by ${sgdShort(c.gap)}`}>
              {c.need == null
                ? c.note
                : `You hold ${sgdShort(c.have)} against a ${sgdShort(c.need)} need. Term cover is the cheapest way to close a death/TPD gap; standalone CI plans cover critical illness.`}
            </Action>
          ))}
          {d.checklist.every((c) => c.status === "covered") &&
            <Action tone="good" icon={<CheckCircle2 size={16} />} title="Every risk line is covered">Review annually and whenever life changes (marriage, child, mortgage). Avoid over-insuring — keep premiums within {sgd(d.needs.premiumBudget)}/yr.</Action>}
          {premiumOverBudget && <Action tone="warn" icon={<AlertTriangle size={16} />} title={`Premiums are ${pct(d.cov.annualPremium / Math.max(1, d.takeHome * 12), 0)} of take-home`}>You're paying {sgd(d.cov.annualPremium)}/yr vs a {sgd(d.needs.premiumBudget)}/yr ceiling. If much of this is bundled (whole life / ILP), term cover frees cash to invest.</Action>}
        </div>
        <Working>
          MediShield Life is automatic and lifelong for citizens and PRs, sized for subsidised B2/C wards; premiums are paid from MediSave. An Integrated Shield Plan tops up to your preferred ward. Death &amp; TPD are sized by DIME on your inputs; the BFPG rules of thumb (9× income for death/TPD, 4× for CI, premiums ≤15% of take-home) sit alongside as sanity checks. Co-insurance bands shown are illustrative — verify against the official MediShield Life calculator.
        </Working>
      </section>
    </div>
  );
}

function PCell({ value, onChange, step = 10000 }: { value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <span className="field-box" style={{ display: "inline-flex", width: 104 }}>
      <span className="field-pre">S$</span>
      <input type="number" value={value} min={0} step={step} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} />
    </span>
  );
}
