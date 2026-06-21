import React from "react";
import { Wallet, Plus, Trash2, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { useStore, uid, Expense, ExpenseCategory } from "../store";
import { useDerived } from "../derive";
import { useNav } from "../nav";
import { sgd, pct } from "../format";
import { Field, Slider, Segmented, Select, Money, Working, StackBar, Action, Chip } from "../ui";

const CATS: ExpenseCategory[] = ["Housing", "Food", "Transport", "Bills", "Dependents", "Loans", "Healthcare", "Lifestyle", "Other"];
const CAT_COLOR: Record<string, string> = {
  Housing: "#0F3138", Food: "#2F7F66", Transport: "#4E8A93", Bills: "#7AA6A0",
  Dependents: "#C28B4B", Loans: "#9B5644", Healthcare: "#5B7DB1", Lifestyle: "#B7BDB0",
  Other: "#8A9794", Insurance: "#DD5C36", Savings: "#1C4D45",
};

export default function Cashflow() {
  const { state, set } = useStore();
  const d = useDerived();
  const goTo = useNav();
  const b = state.budget;
  const bud = d.bud;

  const setExpense = (id: string, patch: Partial<Expense>) =>
    set("budget", (p) => ({ ...p, expenses: p.expenses.map((e) => e.id === id ? { ...e, ...patch } : e) }));
  const addExpense = () =>
    set("budget", (p) => ({ ...p, expenses: [...p.expenses, { id: uid(), label: "New expense", amount: 100, category: "Other", essential: false }] }));
  const removeExpense = (id: string) =>
    set("budget", (p) => ({ ...p, expenses: p.expenses.filter((e) => e.id !== id) }));

  // what's already leaving take-home each month as savings/contributions
  const cpfTopUpMo = d.cpfEligible ? state.cpf.annualTopUp / 12 : 0;
  const srsMo = state.taxReliefs.srsContribution / 12;
  const familyMo = state.taxReliefs.cashTopUpFamily / 12;
  const investMo = d.investContribMonthly;
  const contribParts = [
    { label: "CPF top-up", v: cpfTopUpMo },
    { label: "SRS", v: srsMo },
    { label: "Family top-up", v: familyMo },
    { label: "Investing", v: investMo },
  ].filter((p) => p.v > 0);
  const contribSeg = Math.max(0, Math.min(bud.contributions, Math.max(0, bud.surplus)));
  const freeSeg = Math.max(0, Math.max(0, bud.surplus) - contribSeg);

  const segs = [
    { label: "Housing & needs", value: bud.essential, color: "#0F3138" },
    { label: "Insurance", value: bud.insurance, color: CAT_COLOR.Insurance },
    { label: "Lifestyle", value: bud.discretionary, color: "#B7BDB0" },
    ...(bud.contributions > 0
      ? [
          { label: "Contributions", value: contribSeg, color: CAT_COLOR.Savings },
          { label: "Free", value: freeSeg, color: "#7AA6A0" },
        ]
      : [{ label: "Surplus to invest", value: Math.max(0, bud.surplus), color: CAT_COLOR.Savings }]),
  ];

  return (
    <div className="grid g2">
      {/* headline */}
      <section className="card deep span2">
        <div className="eyebrow"><Wallet size={14} /> This month — where your money goes</div>
        <div className="between wrap" style={{ alignItems: "flex-end", marginBottom: 16 }}>
          <div>
            <div className="stat-label" style={{ color: "rgba(234,241,237,.7)" }}>Left to invest after everything</div>
            <div className="hero-num num" style={{ color: bud.surplus >= 0 ? "#fff" : "#FFB59B" }}>
              <Money value={bud.surplus} render={sgd} /><span className="per">/mo</span>
            </div>
            <div className="stat-sub" style={{ color: "rgba(234,241,237,.7)" }}>
              take-home {sgd(bud.takeHome)} − spending {sgd(bud.essential + bud.discretionary)} − insurance {sgd(bud.insurance)}
            </div>
            {bud.contributions > 0 && (
              <div className="stat-sub" style={{ color: "rgba(234,241,237,.7)", marginTop: 4 }}>
                of which <b style={{ color: "#fff" }}>{sgd(bud.contributions)}/mo</b> is already going to {contribParts.map((p) => `${p.label} ${sgd(p.v)}`).join(" · ")} — leaving <b style={{ color: bud.freeSurplus >= 0 ? "#8FD3B6" : "#FFB59B" }}>{sgd(bud.freeSurplus)}/mo</b> free.
              </div>
            )}
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            {bud.checks.map((c) => (
              <div key={c.key} className="card tight" style={{ minWidth: 104, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)" }}>
                <div className="stat-mid num" style={{ color: c.ok ? "#8FD3B6" : "#FFB59B" }}>{c.value}</div>
                <div style={{ fontSize: 11, color: "rgba(234,241,237,.7)" }}>{c.key}<br /><em style={{ fontStyle: "normal", opacity: .8 }}>{c.guide}</em></div>
              </div>
            ))}
          </div>
        </div>
        <StackBar segments={segs} total={bud.takeHome} tall />
        <div className="legend">
          {segs.map((s) => <span key={s.label} style={{ color: "rgba(234,241,237,.8)" }}><i style={{ background: s.color }} />{s.label} {sgd(s.value)}</span>)}
        </div>
      </section>

      {/* income / take-home */}
      <section className="card">
        <div className="eyebrow"><TrendingUp size={14} /> Income & take-home</div>
        <div className="readrow"><span className="muted">Gross monthly salary</span><b className="num">{sgd(state.income.monthlySalary)}</b></div>
        <div className="readrow"><span className="muted">Annual bonus</span><b className="num">{sgd(state.income.annualBonus)}</b></div>
        {state.income.otherMonthly > 0 && <div className="readrow"><span className="muted">Other monthly income</span><b className="num">{sgd(state.income.otherMonthly)}</b></div>}
        <button className="btn sm" style={{ marginTop: 10 }} onClick={() => goTo("settings")}>Edit income in Settings <ArrowRight size={13} /></button>
        <div className="hr" />
        <div className="between" style={{ marginBottom: 10 }}>
          <span className="field-label" style={{ margin: 0 }}>Take-home basis</span>
          <Segmented value={b.takeHomeMode} onChange={(v) => set("budget", (p) => ({ ...p, takeHomeMode: v }))}
            options={[{ value: "auto", label: "Auto" }, { value: "manual", label: "Manual" }]} />
        </div>
        {b.takeHomeMode === "manual"
          ? <Field label="Monthly take-home" value={b.manualTakeHome} onChange={(n) => set("budget", (p) => ({ ...p, manualTakeHome: n }))} step={100} />
          : <div className="note">Computed as salary − your CPF ({sgd(d.employeeCpfMonthly)}/mo) − income tax ({sgd(d.tax.tax / 12)}/mo) + other income = <b className="num">{sgd(d.autoTakeHome)}</b>.</div>}
      </section>

      {/* recommendation */}
      <section className="card">
        <div className="eyebrow"><CheckCircle2 size={14} /> Your plan vs. a healthy split</div>
        <table className="tbl compact">
          <thead><tr><th>Bucket</th><th>You spend</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Needs (housing, food, bills, loans)</td><td className="num">{sgd(bud.essential)}</td><td className="num faint">{sgd(bud.recommend.needs)}</td></tr>
            <tr><td>Wants (lifestyle)</td><td className="num">{sgd(bud.discretionary)}</td><td className="num faint">{sgd(bud.recommend.wants)}</td></tr>
            <tr><td>Future (invest + insure)</td><td className="num">{sgd(Math.max(0, bud.surplus) + bud.insurance)}</td><td className="num faint">{sgd(bud.recommend.future)}</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: 12 }}>
          {bud.savingsRate >= 0.2
            ? <Action tone="good" icon={<CheckCircle2 size={16} />} title={`Saving ${pct(bud.savingsRate, 0)} of take-home`}>Above the 20% mark. Route the {sgd(Math.max(0, bud.surplus))}/mo surplus into your retirement ETFs — see the Retirement tab.</Action>
            : <Action tone="do" icon={<AlertTriangle size={16} />} title={`Savings rate is ${pct(bud.savingsRate, 0)} — aim for 20%`}>
                Trim lifestyle by {sgd(Math.max(0, bud.takeHome * 0.2 - bud.surplus))}/mo to hit a 20% rate, or grow income. Every dollar freed compounds in the Retirement plan.
              </Action>}
        </div>
        <Working>
          Surplus is simply take-home − spending − insurance. The three gauges use the MoneySense / LIA Basic Financial Planning Guide: save ≥20% (≥10% is the floor), keep protection premiums ≤15% of take-home, and hold 3–6 months of expenses as an emergency fund.
        </Working>
      </section>

      {/* expense editor */}
      <section className="card span2">
        <div className="between" style={{ marginBottom: 12 }}>
          <div className="eyebrow" style={{ margin: 0 }}><Wallet size={14} /> Monthly expenses</div>
          <button className="btn sm" onClick={addExpense}><Plus size={14} /> Add</button>
        </div>
        <div className="tbl-wrap">
          <table className="tbl compact" style={{ minWidth: 560 }}>
            <thead><tr><th>Item</th><th>Category</th><th>Type</th><th>Monthly</th><th></th></tr></thead>
            <tbody>
              {b.expenses.map((e) => (
                <tr key={e.id}>
                  <td style={{ textAlign: "left" }}>
                    <input className="bare" maxLength={56} style={{ width: "100%", minWidth: 200, padding: "6px 8px", fontFamily: "inherit" }}
                      value={e.label} onChange={(ev) => setExpense(e.id, { label: ev.target.value })} />
                  </td>
                  <td style={{ textAlign: "left" }}>
                    <span className="row" style={{ gap: 6 }}>
                      <i className="dot" style={{ background: CAT_COLOR[e.category] }} />
                      <Select value={e.category} onChange={(v) => setExpense(e.id, { category: v })}
                        options={CATS.map((c) => ({ value: c, label: c }))} />
                    </span>
                  </td>
                  <td style={{ textAlign: "left" }}>
                    <button className="chip" onClick={() => setExpense(e.id, { essential: !e.essential })}>
                      {e.essential ? "Need" : "Want"}
                    </button>
                  </td>
                  <td>
                    <span className="field-box" style={{ display: "inline-flex", width: 120 }}>
                      <span className="field-pre">S$</span>
                      <input type="number" value={e.amount} min={0} step={50}
                        onChange={(ev) => setExpense(e.id, { amount: Math.max(0, Number(ev.target.value)) })} />
                    </span>
                  </td>
                  <td><button className="icon-btn" onClick={() => removeExpense(e.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
              {b.expenses.length === 0 && (
                <tr><td colSpan={5} className="empty" style={{ textAlign: "center" }}>No expenses yet — add your housing, food, transport and the rest to see where your money goes.</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr><td style={{ fontWeight: 700 }}>Total spending</td><td></td><td></td>
                <td className="num" style={{ fontWeight: 700, borderTop: "2px solid var(--line2)" }}>{sgd(bud.essential + bud.discretionary)}</td><td></td></tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
