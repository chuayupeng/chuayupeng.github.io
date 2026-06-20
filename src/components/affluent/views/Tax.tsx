import React from "react";
import { Receipt, Landmark, PiggyBank, TrendingDown, CheckCircle2, Info, Users, Heart } from "lucide-react";
import { useStore, TaxReliefs } from "../store";
import { useDerived } from "../derive";
import { estimateTax, RESIDENT_BRACKETS, SRS_CAP, RSTU_SELF_CAP, RELIEF_CAP } from "../calc/tax";
import { sgd, sgdShort, pct, clamp } from "../format";
import { Field, Select, Working, Action } from "../ui";

/* small helpers ----------------------------------------------------------- */
function Count({ label, value, onChange, max = 12 }: { label: string; value: number; onChange: (n: number) => void; max?: number }) {
  return <Field label={label} value={value} prefix="" step={1} max={max} onChange={(n) => onChange(clamp(Math.round(n), 0, max))} />;
}
function Toggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <button className={`chip toggle ${on ? "ok" : ""}`} onClick={onToggle} type="button">{on ? "Yes" : "No"}</button>
    </label>
  );
}

export default function Tax() {
  const { state, set } = useStore();
  const d = useDerived();
  const { profile } = state;
  const t = d.tax;
  const srsCap = SRS_CAP[profile.residency];

  const setR = (patch: Partial<TaxReliefs>) => set("taxReliefs", (r) => ({ ...r, ...patch }));

  // "tax saved by your voluntary top-ups" — compare against contributing nothing voluntary
  const baseline = estimateTax({
    age: d.age, totalIncome: d.annualEmployment, earnedIncome: state.income.monthlySalary * 12 + state.income.annualBonus,
    employeeCpf: d.cpfNow.employee, cashTopUpSelf: 0, residency: profile.residency,
    reliefs: { ...state.taxReliefs, srsContribution: 0, cashTopUpFamily: 0 },
  });
  const voluntarySaved = Math.max(0, baseline.tax - t.tax);

  const brackets = RESIDENT_BRACKETS
    .map((b) => ({ ...b, inBand: clamp(t.chargeable - b.lower, 0, b.upper - b.lower) }))
    .filter((b) => b.inBand > 0);

  return (
    <div className="grid g2">
      {/* hero */}
      <section className="card deep span2">
        <div className="eyebrow"><Receipt size={14} /> Income tax · YA{new Date().getFullYear()}</div>
        <div className="between wrap" style={{ alignItems: "flex-end", gap: 18 }}>
          <div>
            <div className="stat-label" style={{ color: "rgba(234,241,237,.7)" }}>Estimated tax this year</div>
            <div className="hero-num num">{sgd(t.tax)}</div>
            <div className="stat-sub" style={{ color: "rgba(234,241,237,.7)" }}>{sgd(t.tax / 12)}/mo · {pct(t.effectiveRate, 1)} of income</div>
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            {[
              { l: "Marginal rate", v: pct(t.marginal, 1) },
              { l: "Chargeable income", v: sgdShort(t.chargeable) },
              { l: "Reliefs claimed", v: sgdShort(t.reliefsUsed) },
            ].map((x) => (
              <div key={x.l} className="card tight" style={{ minWidth: 116, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)" }}>
                <div className="stat-label" style={{ color: "rgba(234,241,237,.7)" }}>{x.l}</div>
                <div className="stat-mid num" style={{ color: "#fff" }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* waterfall */}
      <section className="card">
        <div className="eyebrow"><TrendingDown size={14} /> From income to tax</div>
        <table className="tbl compact">
          <tbody>
            <tr><td style={{ textAlign: "left" }}>Total income</td><td className="num">{sgd(t.totalIncome)}</td></tr>
            {t.donationDeduction > 0 && <tr><td style={{ textAlign: "left", color: "var(--muted)" }}>− Donations (2.5×)</td><td className="num" style={{ color: "var(--jade)" }}>−{sgd(t.donationDeduction)}</td></tr>}
            <tr><td style={{ textAlign: "left", fontWeight: 600, borderTop: "1px solid var(--line2)" }}>Assessable income</td><td className="num" style={{ fontWeight: 600, borderTop: "1px solid var(--line2)" }}>{sgd(t.assessable)}</td></tr>
            {t.reliefItems.map((it) => (
              <tr key={it.label}><td style={{ textAlign: "left", color: "var(--muted)" }}>− {it.label}</td><td className="num" style={{ color: "var(--jade)" }}>−{sgd(it.amount)}</td></tr>
            ))}
            {t.reliefCapped && <tr><td style={{ textAlign: "left", color: "var(--warn)" }}>reliefs capped at {sgdShort(RELIEF_CAP)}</td><td className="num" style={{ color: "var(--warn)" }}>+{sgd(t.reliefsTotal - RELIEF_CAP)}</td></tr>}
            <tr><td style={{ textAlign: "left", fontWeight: 700, borderTop: "2px solid var(--line2)" }}>Chargeable income</td><td className="num" style={{ fontWeight: 700, borderTop: "2px solid var(--line2)" }}>{sgd(t.chargeable)}</td></tr>
            <tr><td style={{ textAlign: "left", fontWeight: 700 }}>Tax payable</td><td className="num" style={{ fontWeight: 700, color: "var(--coral)" }}>{sgd(t.tax)}</td></tr>
          </tbody>
        </table>
        {voluntarySaved > 0 && <div className="note" style={{ marginTop: 10, color: "var(--jade)" }}>Your SRS &amp; CPF top-ups save you {sgd(voluntarySaved)} in tax this year.</div>}
      </section>

      {/* bracket breakdown */}
      <section className="card">
        <div className="eyebrow"><Receipt size={14} /> How your tax stacks up by bracket</div>
        <div className="tbl-wrap">
          <table className="tbl compact">
            <thead><tr><th>Band</th><th>Rate</th><th>Your income</th><th>Tax</th></tr></thead>
            <tbody>
              {brackets.length === 0 && <tr><td colSpan={4} className="empty" style={{ textAlign: "center" }}>No tax — your chargeable income is within the tax-free band.</td></tr>}
              {brackets.map((b) => {
                const isMarginal = b.rate === t.marginal;
                return (
                  <tr key={b.lower} style={isMarginal ? { background: "var(--tint)" } : undefined}>
                    <td style={{ textAlign: "left" }}>{b.upper === Infinity ? `> ${sgdShort(b.lower)}` : `${sgdShort(b.lower)}–${sgdShort(b.upper)}`}{isMarginal ? <em className="faint" style={{ fontStyle: "normal" }}> · marginal</em> : ""}</td>
                    <td className="num">{pct(b.rate, b.rate === 0 ? 0 : 1)}</td>
                    <td className="num">{sgdShort(b.inBand)}</td>
                    <td className="num" style={{ color: "var(--deep)", fontWeight: 600 }}>{sgd(b.inBand * b.rate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="note" style={{ marginTop: 8 }}>Each dollar is taxed only at its band's rate — your {pct(t.marginal, 1)} marginal rate applies only to the top band you've reached.</div>
      </section>

      {/* reliefs editor */}
      <section className="card span2">
        <div className="eyebrow"><PiggyBank size={14} /> Reliefs &amp; deductions — lower your assessable income</div>
        <p className="note" style={{ marginTop: -6, marginBottom: 14 }}>
          Earned-income and CPF reliefs are applied automatically from your profile. Add the rest below — we compute the dollar amounts and apply the $80,000 relief cap. Figures are YA2026 (income year 2025).
        </p>

        <div className="relief-group"><Landmark size={13} /> Retirement & self</div>
        <div className="grid g3" style={{ gap: "0 18px" }}>
          <Field label="SRS contribution this year" value={state.taxReliefs.srsContribution} onChange={(n) => setR({ srsContribution: n })} step={500} max={srsCap} hint={`cap ${sgdShort(srsCap)}`} />
          {d.cpfEligible &&
            <Field label="CPF cash top-up — self (RSTU)" value={state.cpf.annualTopUp} onChange={(n) => set("cpf", (c) => ({ ...c, annualTopUp: n }))} step={500} max={RSTU_SELF_CAP} hint={`cap ${sgdShort(RSTU_SELF_CAP)}`} />}
          <Field label="CPF cash top-up — family" value={state.taxReliefs.cashTopUpFamily} onChange={(n) => setR({ cashTopUpFamily: n })} step={500} max={RSTU_SELF_CAP} hint={`cap ${sgdShort(RSTU_SELF_CAP)}`} />
          <Field label="Course fees paid" value={state.taxReliefs.courseFees} onChange={(n) => setR({ courseFees: n })} step={500} max={5500} hint="cap S$5.5K" />
          {d.cpfNow.employee < 5000 &&
            <Field label="Life insurance premiums" value={state.taxReliefs.lifeInsurancePremium} onChange={(n) => setR({ lifeInsurancePremium: n })} step={100} hint="only if CPF < S$5K" />}
          <Toggle label="Permanently handicapped (you)" on={state.taxReliefs.handicapped} onToggle={() => setR({ handicapped: !state.taxReliefs.handicapped })} />
        </div>

        <div className="relief-group" style={{ marginTop: 8 }}><Users size={13} /> Family &amp; dependants</div>
        <div className="grid g3" style={{ gap: "0 18px" }}>
          <label className="field">
            <span className="field-label">Spouse</span>
            <Select value={state.taxReliefs.spouse} onChange={(v) => setR({ spouse: v })}
              options={[{ value: "none", label: "Not claiming" }, { value: "supported", label: "Supported · S$2,000" }, { value: "handicapped", label: "Handicapped · S$5,500" }]} />
          </label>
          <Count label="Children (qualifying)" value={state.taxReliefs.children} onChange={(n) => setR({ children: n })} />
          <Count label="Handicapped children" value={state.taxReliefs.handicappedChildren} onChange={(n) => setR({ handicappedChildren: n })} />
          <Field label="Working mother's child relief" value={state.taxReliefs.wmcr} onChange={(n) => setR({ wmcr: n })} step={1000} hint="see note" />
          <Count label="Parents living with you" value={state.taxReliefs.parentsLiveWith} onChange={(n) => setR({ parentsLiveWith: n })} max={4} />
          <Count label="Parents not living with you" value={state.taxReliefs.parentsApart} onChange={(n) => setR({ parentsApart: n })} max={4} />
          <Count label="Handicapped parents (with you)" value={state.taxReliefs.handicappedParents} onChange={(n) => setR({ handicappedParents: n })} max={4} />
          <Count label="Handicapped siblings" value={state.taxReliefs.handicappedSiblings} onChange={(n) => setR({ handicappedSiblings: n })} max={6} />
          <Toggle label="Grandparent caregiver (working mums)" on={state.taxReliefs.grandparentCaregiver} onToggle={() => setR({ grandparentCaregiver: !state.taxReliefs.grandparentCaregiver })} />
        </div>

        <div className="relief-group" style={{ marginTop: 8 }}><Heart size={13} /> NS, donations & other</div>
        <div className="grid g3" style={{ gap: "0 18px" }}>
          <label className="field">
            <span className="field-label">NSman (self)</span>
            <Select value={state.taxReliefs.nsman} onChange={(v) => setR({ nsman: v })}
              options={[{ value: "none", label: "Not an NSman" }, { value: "nsman", label: "NSman · S$3,000" }, { value: "key", label: "Key appointment · S$5,000" }]} />
          </label>
          <Toggle label="NSman wife relief" on={state.taxReliefs.nsmanWife} onToggle={() => setR({ nsmanWife: !state.taxReliefs.nsmanWife })} />
          <Count label="NSman parent relief (parents)" value={state.taxReliefs.nsmanParents} onChange={(n) => setR({ nsmanParents: n })} max={2} />
          <Field label="Donations to approved IPCs" value={state.taxReliefs.donations} onChange={(n) => setR({ donations: n })} step={100} hint="2.5× deduction" />
          <Field label="Other reliefs" value={state.taxReliefs.otherReliefs} onChange={(n) => setR({ otherReliefs: n })} step={500} hint="anything not listed" />
        </div>

        <Working>
          <b>Earned income relief</b> is auto: {state.taxReliefs.handicapped ? "handicapped band" : "$1,000 (&lt;55), $6,000 (55–59), $8,000 (60+)"}. <b>CPF relief</b> equals your compulsory employee CPF (zero for foreigners). <b>Parent relief</b> is $9,000 (living with you) / $5,500 (apart), or $14,000 for a handicapped parent living with you; dependants must earn ≤ $8,000. <b>Working Mother's Child Relief</b> is a fixed $8,000 / $10,000 / $12,000 for a 1st/2nd/3rd child born on/after 1 Jan 2024, or 15% / 20% / 25% of your earned income for older children (enter the amount). <b>Donations</b> to approved IPCs give a 2.5× deduction that sits outside the $80,000 relief cap. <b>Life insurance relief</b> only applies if your compulsory CPF is under $5,000. This is an estimate — your IRAS assessment is final.
        </Working>
      </section>

      {/* actions */}
      <section className="card span2">
        <div className="eyebrow"><CheckCircle2 size={14} /> Tax moves worth making</div>
        <div className="grid g2" style={{ gap: 10 }}>
          {t.marginal >= 0.07 && t.srsHeadroom > 0
            ? <Action tone="good" icon={<Landmark size={16} />} title={`Top up SRS — you're in the ${pct(t.marginal, 1)} bracket`}>You have {sgd(t.srsHeadroom)} of SRS headroom. The next dollar in saves {pct(t.marginal, 1)} in tax, and the money grows for retirement when you invest it.</Action>
            : <Action tone="good" icon={<CheckCircle2 size={16} />} title={t.marginal < 0.07 ? "Your tax is already low" : "SRS room is used up"}>{t.marginal < 0.07 ? `At a ${pct(t.marginal, 1)} marginal rate there's little to optimise — focus on investing and protection.` : "You've maxed your SRS relief for the year."}</Action>}
          {t.topUpHeadroom > 0 && t.marginal >= 0.07 &&
            <Action tone="good" icon={<PiggyBank size={16} />} title="CPF cash top-up doubles as retirement saving">Topping up your SA/RA earns relief now ({sgd(t.topUpHeadroom)} of room) and compounds risk-free at 4%, lifting your CPF LIFE payout.</Action>}
          {t.reliefCapped && <Action tone="warn" icon={<Info size={16} />} title="You've hit the $80,000 relief cap">Reliefs above {sgdShort(RELIEF_CAP)} are disregarded — further SRS/top-ups won't cut your tax. Donations still help (they're outside the cap).</Action>}
          {t.donationDeduction === 0 && t.marginal >= 0.115 &&
            <Action tone="good" icon={<Heart size={16} />} title="Donations give a 2.5× deduction">Cash gifts to approved IPCs reduce assessable income by 2.5× — and unlike reliefs they sit outside the $80k cap.</Action>}
        </div>
      </section>
    </div>
  );
}
