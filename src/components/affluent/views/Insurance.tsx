import React, { useState, useRef } from "react";
import { ShieldCheck, Plus, Trash2, Activity, CheckCircle2, XCircle, AlertTriangle, HeartPulse, Minus } from "lucide-react";
import { useStore, uid, Policy, PolicyType } from "../store";
import { useDerived } from "../derive";
import { sgd, sgdShort, pct } from "../format";
import { Field, Slider, Select, Working, Action, Chip } from "../ui";
import { MSL, mslPremium, mslOutOfPocket, wardDeductible, POLICY_BENEFITS, BenefitKey } from "../calc/insurance";

const PTYPES: { value: PolicyType; label: string }[] = [
  { value: "term_life", label: "Term life" }, { value: "whole_life", label: "Whole life" },
  { value: "ci", label: "Critical illness" }, { value: "early_ci", label: "Early CI" }, { value: "tpd", label: "TPD" },
  { value: "hospitalisation", label: "Hospitalisation (IP)" }, { value: "disability_income", label: "Disability income" },
  { value: "personal_accident", label: "Personal accident" }, { value: "mortgage", label: "Mortgage" },
  { value: "endowment", label: "Endowment" }, { value: "ilp", label: "ILP" }, { value: "other", label: "Other" },
];

// the amount field(s) each policy type asks you to enter (besides name + premium)
const BENEFIT_FIELDS: Record<BenefitKey, { key: keyof Policy; label: string; hint?: string; step: number }> = {
  death: { key: "deathBenefit", label: "Death benefit", step: 10000 },
  tpd: { key: "tpdBenefit", label: "TPD benefit", step: 10000 },
  ci: { key: "ciBenefit", label: "CI benefit", step: 10000 },
  monthly: { key: "monthlyBenefit", label: "Monthly benefit", hint: "/mo", step: 500 },
};

// plain-English guidance on what to enter, for the products that aren't obvious
const TYPE_NOTE: Partial<Record<PolicyType, string>> = {
  hospitalisation: "Reimburses your hospital bills up to the plan's limits — pick your ward above. Just record the annual premium.",
  personal_accident: "Pays out for accidents on a per-injury schedule — record the annual premium (payouts vary by plan).",
  disability_income: "Replaces a monthly income (insurers cap around 75% of salary) if illness or injury stops you working.",
  endowment: "A savings plan that also pays a death benefit — enter the sum assured.",
  ilp: "Investment-linked — enter the death benefit; the investment value belongs in the Investments tab.",
  mortgage: "Decreasing-term cover that clears your home loan — enter the outstanding sum assured.",
};

const statusChip = (s: string) =>
  s === "covered" ? <Chip tone="ok"><CheckCircle2 size={12} /> Covered</Chip>
    : s === "short" ? <Chip tone="warn"><AlertTriangle size={12} /> Short</Chip>
      : s === "none" ? <Chip tone="neutral"><Minus size={12} /> No need</Chip>
        : <Chip tone="bad"><XCircle size={12} /> Missing</Chip>;

export default function Insurance() {
  const { state, set } = useStore();
  const d = useDerived();
  const ins = state.insurance;
  const [bill, setBill] = useState(25000);

  const ded = wardDeductible(ins.inputs.ipWard);
  const oop = mslOutOfPocket(bill, ded);
  const premium = mslPremium(d.age + 1);

  const policiesRef = useRef<HTMLElement>(null);
  const polRef = useRef(ins.policies);
  polRef.current = ins.policies;   // always the latest list, for post-render focus lookups
  const blankPolicy = (id: string, name: string, type: PolicyType): Policy =>
    ({ id, name, insurer: "—", type, deathBenefit: 0, tpdBenefit: 0, ciBenefit: 0, monthlyBenefit: 0, annualPremium: 0 });
  const setPolicy = (id: string, patch: Partial<Policy>) =>
    set("insurance", (p) => ({ ...p, policies: p.policies.map((x) => x.id === id ? { ...x, ...patch } : x) }));
  // scroll the row into view and focus its first amount field, so the user lands on what to type
  const focusPolicy = (id: string) => setTimeout(() => {
    const row = policiesRef.current?.querySelector(`[data-pid="${id}"]`) as HTMLElement | null;
    row?.scrollIntoView({ behavior: "smooth", block: "center" });
    (row?.querySelector('input[type="number"]') as HTMLInputElement | null)?.focus();
  }, 80);
  const addPolicy = () => { const id = uid(); set("insurance", (p) => ({ ...p, policies: [...p.policies, blankPolicy(id, "New policy", "term_life")] })); focusPolicy(id); };
  const isBlankPolicy = (p: Policy) => !p.deathBenefit && !p.tpdBenefit && !p.ciBenefit && !p.monthlyBenefit && !p.annualPremium;
  // create a correctly-typed policy straight from a coverage gap, reusing an empty draft of that
  // type if one already exists so repeated clicks can't pile up duplicates. The decision runs
  // inside the updater (against the latest state, race-free); focus resolves after the re-render.
  const addPolicyOfType = (type: PolicyType, name: string) => {
    set("insurance", (p) => p.policies.some((x) => x.type === type && isBlankPolicy(x))
      ? p
      : { ...p, policies: [...p.policies, blankPolicy(uid(), name, type)] });
    setTimeout(() => {
      const target = polRef.current.find((p) => p.type === type && isBlankPolicy(p));
      if (!target) return;
      const row = policiesRef.current?.querySelector(`[data-pid="${target.id}"]`) as HTMLElement | null;
      row?.scrollIntoView({ behavior: "smooth", block: "center" });
      (row?.querySelector('input[type="number"]') as HTMLInputElement | null)?.focus();
    }, 90);
  };
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
      <section className="card span2" ref={policiesRef}>
        <div className="between" style={{ marginBottom: 12 }}>
          <div className="eyebrow" style={{ margin: 0 }}><ShieldCheck size={14} /> Your policies</div>
          <button className="btn sm" onClick={addPolicy}><Plus size={14} /> Add policy</button>
        </div>
        {ins.policies.length === 0 ? (
          <div className="empty" style={{ padding: "20px 0", textAlign: "center" }}>No policies yet — add your cover here or from “Close the gaps” below, and I'll size each one and only ask for the fields that apply.</div>
        ) : (
          <div className="pol-list">
            {ins.policies.map((p) => {
              const benefits = POLICY_BENEFITS[p.type] ?? [];   // tolerate an unknown/corrupt type
              // amounts stored on the policy that its current type doesn't count — surfaced so a
              // type switch never silently drops a number from the coverage totals
              const SHORT: Record<BenefitKey, string> = { death: "death", tpd: "TPD", ci: "CI", monthly: "income" };
              const orphaned = (Object.keys(BENEFIT_FIELDS) as BenefitKey[])
                .filter((b) => !benefits.includes(b) && ((p[BENEFIT_FIELDS[b].key] as number) || 0) > 0)
                .map((b) => SHORT[b]);
              return (
                <div className="pol-card" key={p.id} data-pid={p.id}>
                  <div className="pol-head">
                    <input className="bare pol-name" aria-label="Policy name" maxLength={48} placeholder="Policy name"
                      value={p.name} onChange={(e) => setPolicy(p.id, { name: e.target.value })} />
                    <Select value={p.type} ariaLabel={`Policy type for ${p.name || "this policy"}`} onChange={(v) => setPolicy(p.id, { type: v })} options={PTYPES} />
                    <button className="icon-btn" onClick={() => rmPolicy(p.id)} aria-label="Remove policy"><Trash2 size={14} /></button>
                  </div>
                  <div className="pol-body">
                    {benefits.map((b) => {
                      const f = BENEFIT_FIELDS[b];
                      return (
                        <label className="pol-field" key={b}>
                          <span className="pol-flabel">{f.label}{f.hint && <em> {f.hint}</em>}</span>
                          <PCell value={(p[f.key] as number) || 0} step={f.step} onChange={(n) => setPolicy(p.id, { [f.key]: n })} />
                        </label>
                      );
                    })}
                    <label className="pol-field">
                      <span className="pol-flabel">Premium <em>/yr</em></span>
                      <PCell value={p.annualPremium} step={50} onChange={(n) => setPolicy(p.id, { annualPremium: n })} />
                    </label>
                  </div>
                  {TYPE_NOTE[p.type] && <div className="pol-note muted">{TYPE_NOTE[p.type]}</div>}
                  {orphaned.length > 0 && (
                    <div className="pol-note" style={{ color: "var(--warn)" }}>
                      Holds {orphaned.join(" + ")} cover that this type doesn't count — switch the type back to include {orphaned.length > 1 ? "them" : "it"}.
                    </div>
                  )}
                </div>
              );
            })}
            <div className="pol-totals">
              <span>Coverage totals</span>
              <span>Death <b className="num">{sgdShort(d.cov.life)}</b></span>
              <span>TPD <b className="num">{sgdShort(d.cov.tpd)}</b></span>
              <span>CI <b className="num">{sgdShort(d.cov.ci)}</b></span>
              {d.cov.disabilityMonthly > 0 && <span>Disability <b className="num">{sgdShort(d.cov.disabilityMonthly)}/mo</b></span>}
              <span>Premiums <b className="num">{sgd(d.cov.annualPremium)}/yr</b></span>
            </div>
          </div>
        )}
      </section>

      {/* actions */}
      <section className="card span2">
        <div className="eyebrow"><CheckCircle2 size={14} /> Close the gaps</div>
        <div className="grid g2 gaps-grid" style={{ gap: 10 }}>
          {d.checklist.filter((c) => c.status === "short" || c.status === "missing").map((c) => (
            <Action key={c.key} tone={c.status === "missing" ? "do" : "warn"} icon={<ShieldCheck size={16} />}
              title={c.need == null
                ? `Add ${c.key.toLowerCase()}`
                : c.status === "missing"
                  ? `Add ${c.key.toLowerCase()} — ${sgdShort(c.need)} needed`
                  : `${c.key}: top up by ${sgdShort(c.gap)}`}
              cta={c.status === "missing" ? "Add" : "Top up"}
              onCta={() => addPolicyOfType(c.addType, c.addName)}>
              {c.need == null
                ? c.note
                : `You hold ${sgdShort(c.have)} against a ${sgdShort(c.need)} need. I'll start the policy and jump you to it — just enter the cover amount and premium.`}
            </Action>
          ))}
          {d.protectionGaps === 0 && (d.annualIncomeForCover > 0 || d.cov.annualPremium > 0) &&
            <Action tone="good" icon={<CheckCircle2 size={16} />} title="Every risk line is covered">Review annually and whenever life changes (marriage, child, mortgage). Avoid over-insuring — keep premiums within {sgd(d.needs.premiumBudget)}/yr.</Action>}
          {d.protectionGaps === 0 && d.annualIncomeForCover === 0 && d.cov.annualPremium === 0 &&
            <Action tone="good" icon={<HeartPulse size={16} />} title="Add your income to size your protection">Enter your salary and family situation and I'll work out how much death, TPD and critical-illness cover you actually need.</Action>}
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
    <span className="field-box" style={{ display: "inline-flex", width: "100%" }}>
      <span className="field-pre">S$</span>
      <input type="number" value={Number.isFinite(value) ? value : 0} min={0} step={step} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} />
    </span>
  );
}
