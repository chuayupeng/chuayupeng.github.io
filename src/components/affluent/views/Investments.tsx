import React from "react";
import { TrendingUp, Plus, Trash2, Camera, PieChart, Landmark } from "lucide-react";
import { useStore, uid, Holding, HoldingType } from "../store";
import { useDerived } from "../derive";
import { sgd, sgdShort, pct } from "../format";
import { Select, Money, Action } from "../ui";
import { Donut, Sparkline } from "../charts";

const TYPES: { value: HoldingType; label: string }[] = [
  { value: "etf", label: "ETF" }, { value: "stocks", label: "Stocks" }, { value: "bonds", label: "Bonds" },
  { value: "cash", label: "Cash" }, { value: "srs", label: "SRS" }, { value: "crypto", label: "Crypto" },
  { value: "property", label: "Property" }, { value: "other", label: "Other" },
];
const TYPE_COLOR: Record<string, string> = {
  etf: "#2F7F66", stocks: "#0F3138", bonds: "#4E8A93", cash: "#B7BDB0",
  srs: "#C28B4B", crypto: "#9B5644", property: "#5B7DB1", other: "#8A9794", cpf: "#DD5C36",
};
const TYPE_LABEL: Record<string, string> = { ...Object.fromEntries(TYPES.map((t) => [t.value, t.label])), cpf: "CPF" };

export default function Investments() {
  const { state, set, snapshotNow } = useStore();
  const d = useDerived();
  const holdings = state.investments.holdings;
  const snaps = state.investments.snapshots;

  const setH = (id: string, patch: Partial<Holding>) =>
    set("investments", (p) => ({ ...p, holdings: p.holdings.map((h) => h.id === id ? { ...h, ...patch } : h) }));
  const addH = () =>
    set("investments", (p) => ({ ...p, holdings: [...p.holdings, { id: uid(), name: "New holding", type: "etf", value: 0, monthlyContribution: 0 }] }));
  const rmH = (id: string) =>
    set("investments", (p) => ({ ...p, holdings: p.holdings.filter((h) => h.id !== id) }));

  const allocEntries = Object.entries(d.allocation).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const allocTotal = allocEntries.reduce((s, [, v]) => s + v, 0) || 1;
  const slices = allocEntries.map(([k, v]) => ({ label: TYPE_LABEL[k] || k, value: v, color: TYPE_COLOR[k] || "#8A9794" }));

  const snapshot = () => snapshotNow({
    invested: d.liquidInvest, cpf: d.cpfTotalNow, cash: d.cashHoldings,
    property: d.propertyEquity, liabilities: d.liabilities, netWorth: d.netWorth,
  });

  return (
    <div className="grid g2">
      {/* net worth + allocation */}
      <section className="card deep span2">
        <div className="between wrap" style={{ alignItems: "flex-start", gap: 18 }}>
          <div>
            <div className="eyebrow"><Landmark size={14} /> Net worth</div>
            <div className="hero-num num"><Money value={d.netWorth} render={sgd} /></div>
            <div className="row wrap" style={{ gap: 14, marginTop: 10, fontSize: 12.5, color: "rgba(234,241,237,.8)" }}>
              <span>Investments <b className="num">{sgdShort(d.liquidInvest)}</b></span>
              <span>Cash <b className="num">{sgdShort(d.cashHoldings)}</b></span>
              <span>CPF <b className="num">{sgdShort(d.cpfTotalNow)}</b></span>
              {d.propertyEquity > 0 && <span>Property eq. <b className="num">{sgdShort(d.propertyEquity)}</b></span>}
              {d.liabilities > 0 && <span>Debt <b className="num">−{sgdShort(d.liabilities)}</b></span>}
            </div>
          </div>
          <div className="row" style={{ gap: 14 }}>
            <Donut slices={slices} />
            <div style={{ fontSize: 11.5 }}>
              {slices.slice(0, 6).map((s) => (
                <div key={s.label} className="row between" style={{ gap: 12, marginBottom: 4, color: "rgba(234,241,237,.85)" }}>
                  <span className="row" style={{ gap: 6 }}><i style={{ width: 9, height: 9, borderRadius: 3, background: s.color, display: "inline-block" }} />{s.label}</span>
                  <span className="num">{pct(s.value / allocTotal, 0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* holdings table */}
      <section className="card span2">
        <div className="between" style={{ marginBottom: 12 }}>
          <div className="eyebrow" style={{ margin: 0 }}><TrendingUp size={14} /> Holdings</div>
          <button className="btn sm" onClick={addH}><Plus size={14} /> Add holding</button>
        </div>
        <div className="tbl-wrap">
          <table className="tbl compact" style={{ minWidth: 680 }}>
            <thead><tr><th>Name</th><th>Type</th><th>Value</th><th>Top-up /mo</th><th>Exp. return</th><th></th></tr></thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.id}>
                  <td style={{ textAlign: "left" }}>
                    <input className="bare" maxLength={48} style={{ width: "100%", minWidth: 180, padding: "6px 8px", fontFamily: "inherit" }}
                      value={h.name} onChange={(e) => setH(h.id, { name: e.target.value })} />
                  </td>
                  <td style={{ textAlign: "left" }}>
                    <span className="row" style={{ gap: 6 }}><i className="dot" style={{ background: TYPE_COLOR[h.type] }} />
                      <Select value={h.type} onChange={(v) => setH(h.id, { type: v })} options={TYPES} /></span>
                  </td>
                  <td><NumCell value={h.value} step={1000} onChange={(n) => setH(h.id, { value: n })} /></td>
                  <td><NumCell value={h.monthlyContribution} step={100} onChange={(n) => setH(h.id, { monthlyContribution: n })} /></td>
                  <td>
                    {h.type === "cash" ? <span className="faint num">—</span> : (
                      <span className="field-box" style={{ display: "inline-flex", width: 78 }}>
                        <input type="number" step={0.5} value={((h.expectedReturn ?? 0.06) * 100)}
                          onChange={(e) => setH(h.id, { expectedReturn: Math.max(0, Number(e.target.value)) / 100 })}
                          style={{ padding: "6px 4px 6px 8px" }} />
                        <span className="field-pre" style={{ padding: "0 8px 0 0" }}>%</span>
                      </span>
                    )}
                  </td>
                  <td><button className="icon-btn" onClick={() => rmH(h.id)} aria-label="Remove"><Trash2 size={14} /></button></td>
                </tr>
              ))}
              {holdings.length === 0 && (
                <tr><td colSpan={6} className="empty" style={{ textAlign: "center" }}>No holdings yet — add your ETFs, cash, SRS or property to start tracking net worth.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="note" style={{ marginTop: 10 }}>
          Investing <b className="num">{sgd(d.investContribMonthly)}/mo</b> across {holdings.filter((h) => ["etf", "stocks", "bonds", "srs", "crypto"].includes(h.type)).length} growth holdings.
          Property is counted at equity (value − loan); CPF is tracked separately in the CPF tab.
        </div>
      </section>

      {/* net worth tracking */}
      <section className="card">
        <div className="between" style={{ marginBottom: 10 }}>
          <div className="eyebrow" style={{ margin: 0 }}><Camera size={14} /> Net-worth history</div>
          <button className="btn sm deep" onClick={snapshot}><Camera size={14} /> Snapshot today</button>
        </div>
        {snaps.length >= 2 ? (
          <>
            <Sparkline values={snaps.map((s) => s.netWorth)} W={320} H={64} />
            <div className="between" style={{ marginTop: 8, fontSize: 12 }}>
              <span className="muted">{snaps[0].date}</span>
              <span className="num">
                {(() => { const f = snaps[0].netWorth, l = snaps[snaps.length - 1].netWorth; const dlt = l - f;
                  return <span className={dlt >= 0 ? "pos" : "neg"}>{dlt >= 0 ? "+" : "−"}{sgdShort(Math.abs(dlt))} since start</span>; })()}
              </span>
              <span className="muted">{snaps[snaps.length - 1].date}</span>
            </div>
          </>
        ) : (
          <div className="empty">Take a snapshot each month to chart your net worth over time. {snaps.length === 1 ? "One captured so far." : ""}</div>
        )}
      </section>

      {/* guidance */}
      <section className="card">
        <div className="eyebrow"><PieChart size={14} /> Read on your mix</div>
        {(() => {
          const cashPct = d.netWorth > 0 ? (d.cashHoldings / d.netWorth) : 0;
          const items: React.ReactNode[] = [];
          if (cashPct > 0.4) items.push(<Action key="cash" tone="warn" icon={<PieChart size={16} />} title={`${pct(cashPct, 0)} of net worth is cash`}>That's a heavy cash drag. Beyond your 6-month emergency fund, idle cash loses to inflation — shift the excess into your ETF plan.</Action>);
          const equity = (d.allocation.etf || 0) + (d.allocation.stocks || 0);
          if (equity > 0) items.push(<Action key="eq" tone="good" icon={<TrendingUp size={16} />} title="Globally diversified equity is your growth engine">Low-cost, broad ETFs (e.g. an S&P 500 + world mix) are the standard core. Keep costs low and contributions automatic.</Action>);
          if (!items.length) items.push(<Action key="ok" tone="good" icon={<TrendingUp size={16} />} title="Add holdings to see tailored reads">Enter your accounts above and I'll flag cash drag, concentration, and contribution gaps.</Action>);
          return <div className="grid" style={{ gap: 10 }}>{items}</div>;
        })()}
      </section>
    </div>
  );
}

function NumCell({ value, onChange, step }: { value: number; onChange: (n: number) => void; step: number }) {
  return (
    <span className="field-box" style={{ display: "inline-flex", width: 116 }}>
      <span className="field-pre">S$</span>
      <input type="number" value={value} min={0} step={step} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} />
    </span>
  );
}
