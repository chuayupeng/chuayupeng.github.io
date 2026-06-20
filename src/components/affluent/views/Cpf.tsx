import React, { useMemo } from "react";
import { Landmark, Building2, CheckCircle2, ArrowUpRight, Coins, ArrowRight } from "lucide-react";
import { useStore } from "../store";
import { useDerived } from "../derive";
import { useNav } from "../nav";
import { CPF } from "../calc/cpf";
import { sgd, sgdShort, pct } from "../format";
import { Money, Working, Action } from "../ui";
import { StackedArea } from "../charts";

export default function Cpf() {
  const { state } = useStore();
  const d = useDerived();
  const goTo = useNav();
  const c = state.cpf;
  const now = d.cpfNow;
  const proj = d.cpfProj;
  const age = d.age;

  const chartPts = useMemo(() => proj.pts.map((p) => ({ x: p.age, oa: p.OA, ret: p.SA + p.RA, ma: p.MA })), [proj]);
  const milestones = useMemo(() => {
    const rows = [proj.pts[0]];
    [40, 45, 50, 55, 60, 65, 70].forEach((mAge) => {
      if (mAge > age) { const p = proj.pts.find((q) => q.age === mAge); if (p) rows.push(p); }
    });
    return rows;
  }, [proj, age]);

  const extraBase = Math.min(c.oa, 20000) + c.sa + c.ma + c.ra;   // only first $20k of OA counts
  const extraInt = age < 55 ? 0.01 * Math.min(extraBase, 60000)
    : 0.02 * Math.min(extraBase, 30000) + 0.01 * Math.min(Math.max(0, extraBase - 30000), 30000);
  const interestYr = c.oa * CPF.iOA + (c.sa + c.ma + c.ra) * CPF.iRest + extraInt;
  const frsGap = Math.max(0, CPF.sums.FRS - (proj.ms.ra65 ?? 0));

  return (
    <div className="grid g2">
      {!d.cpfEligible && (
        <section className="card span2" style={{ borderLeft: "3px solid var(--gold)" }}>
          <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
            <span className="action-ico" style={{ background: "rgba(200,134,31,.12)", color: "var(--warn)" }}><Building2 size={16} /></span>
            <div className="grow">
              <h4 style={{ fontSize: 14, marginBottom: 3 }}>CPF doesn't apply to you</h4>
              <p className="note" style={{ margin: 0 }}>
                You're set as a <b>foreigner</b> in Settings. Employment Pass / S Pass holders don't contribute to CPF — so your take-home is higher, you get no CPF relief on your tax, and there's no CPF LIFE floor in retirement (your ETF plan carries the full load). Switch to Citizen or PR in Settings if that's not right.
              </p>
            </div>
          </div>
        </section>
      )}
      {/* contribution now (citizens & PRs — foreigners contribute nothing) */}
      {d.cpfEligible && (
      <section className="card span2">
        <div className="eyebrow"><Coins size={14} /> This year's CPF contribution</div>
        <div className="between wrap" style={{ alignItems: "flex-start", gap: 18 }}>
          <div style={{ minWidth: 220 }}>
            <div className="stat-big num"><Money value={now.total} render={sgd} /></div>
            <div className="stat-sub">into your CPF this year ({pct(now.rate.total, 0)} of {sgd(now.wages)} CPF wages)</div>
            <div className="bar" style={{ marginTop: 12 }}>
              <div className="bar-seg" style={{ width: `${(now.employer / now.total) * 100}%`, background: "var(--deep)" }}>employer {sgdShort(now.employer)}</div>
              <div className="bar-seg" style={{ width: `${(now.employee / now.total) * 100}%`, background: "var(--jade)" }}>you {sgdShort(now.employee)}</div>
            </div>
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            {[
              { l: "Ordinary Account", v: now.oa, c: "var(--deep)", t: "housing / invest" },
              { l: age < 55 ? "Special Account" : "Retirement Account", v: now.sa, c: "var(--jade)", t: "retirement" },
              { l: "MediSave", v: now.ma, c: "var(--gold)", t: `health · cap ${sgdShort(CPF.BHS)}` },
            ].map((x) => (
              <div key={x.l} className="card tight" style={{ minWidth: 130, borderLeft: `3px solid ${x.c}` }}>
                <div className="stat-label">{x.l}</div>
                <div className="stat-mid num">{sgd(x.v)}</div>
                <div className="faint" style={{ fontSize: 11 }}>{x.t}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="note" style={{ marginTop: 12 }}>
          Grows ≈ <b className="num">{sgd(now.total)}</b> contributions + <b className="num">{sgd(interestYr)}</b> interest this year
          {c.oaDrawMonthly > 0 ? <> − <b className="num">{sgd(c.oaDrawMonthly * 12)}</b> OA drawn for housing/invest</> : null}.
        </div>
      </section>
      )}

      {/* trajectory chart */}
      <section className="card deep span2">
        <div className="eyebrow"><Landmark size={14} /> Trajectory to retirement</div>
        <StackedArea points={chartPts}
          series={[{ key: "oa", color: "#1C5560", label: "OA" }, { key: "ret", color: "#3E9A7C", label: "SA / RA" }, { key: "ma", color: "#C28B4B", label: "MediSave" }]}
          markers={[{ x: 55 }, { x: 65, bold: true }]} />
        <div className="axis" style={{ color: "rgba(234,241,237,.6)" }}>
          <span>age {age}</span><span>55 → 65</span><span>{Math.max(70, state.profile.retireAge)}</span>
        </div>
        <div className="legend">
          <span style={{ color: "rgba(234,241,237,.85)" }}><i style={{ background: "#1C5560" }} /> OA (housing/invest)</span>
          <span style={{ color: "rgba(234,241,237,.85)" }}><i style={{ background: "#3E9A7C" }} /> SA / RA (retirement)</span>
          <span style={{ color: "rgba(234,241,237,.85)" }}><i style={{ background: "#C28B4B" }} /> MediSave (capped {sgdShort(CPF.BHS)})</span>
        </div>
        <div className="grid g4" style={{ marginTop: 16, gap: 10 }}>
          {[
            { l: "Total at 55", v: proj.ms.at55 ? sgd(proj.ms.at55) : "—" },
            { l: "Total at 65", v: proj.ms.at65 ? sgd(proj.ms.at65) : "—" },
            { l: "RA at 65 / FRS", v: proj.ms.ra65 ? `${sgdShort(proj.ms.ra65)} / ${sgdShort(CPF.sums.FRS)}` : "—" },
            { l: "CPF LIFE from 65", v: sgd(proj.lifeMonthly) + "/mo" },
          ].map((x) => (
            <div key={x.l} className="card tight" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)" }}>
              <div className="stat-label" style={{ color: "rgba(234,241,237,.7)" }}>{x.l}</div>
              <div className="stat-mid num" style={{ color: "#fff" }}>{x.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* milestone table */}
      <section className="card span2">
        <div className="between" style={{ marginBottom: 12 }}>
          <div className="eyebrow" style={{ margin: 0 }}><ArrowUpRight size={14} /> Balances over time</div>
          <button className="btn sm" onClick={() => goTo("settings")}>Edit salary &amp; CPF balances <ArrowRight size={13} /></button>
        </div>
        <div className="tbl-wrap">
          <table className="tbl compact">
            <thead><tr><th>Age</th><th>OA</th><th>SA/RA</th><th>MA</th><th>Total</th></tr></thead>
            <tbody>
              {milestones.map((p) => (
                <tr key={p.age} style={p.age === 55 || p.age === 65 ? { background: "var(--tint)" } : undefined}>
                  <td style={{ fontWeight: p.age === 55 || p.age === 65 ? 700 : 400 }}>
                    {p.age}{p.age === 55 ? " ·SA→RA" : p.age === 65 ? " ·LIFE" : ""}
                  </td>
                  <td className="num">{sgdShort(p.OA)}</td>
                  <td className="num">{sgdShort(p.SA + p.RA)}</td>
                  <td className="num">{sgdShort(p.MA)}</td>
                  <td className="num" style={{ color: "var(--deep)", fontWeight: 600 }}>{sgdShort(p.OA + p.SA + p.RA + p.MA)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* actions */}
      <section className="card span2">
        <div className="eyebrow"><CheckCircle2 size={14} /> Make CPF work harder</div>
        <div className="grid g2" style={{ gap: 10 }}>
          {frsGap > 0
            ? <Action tone="do" icon={<ArrowUpRight size={16} />} title={`On track to fall ${sgdShort(frsGap)} short of the Full Retirement Sum`}>
                Topping up your SA/RA (RSTU) compounds at the {pct(CPF.iRest, 0)} floor and raises your CPF LIFE payout. It also gives up to $8,000/yr of tax relief.
              </Action>
            : <Action tone="good" icon={<CheckCircle2 size={16} />} title="On track to hit the Full Retirement Sum">Your RA reaches {sgdShort(proj.ms.ra65 ?? 0)} by 65 — at or above the FRS. Consider the Enhanced Retirement Sum for a higher guaranteed payout.</Action>}
          <Action tone="good" icon={<Coins size={16} />} title="The 1M65 effect">CPF's risk-free 2.5%/4% floors are a bond-like anchor. Treat CPF as the safe sleeve of your portfolio and take equity risk with your cash investments instead.</Action>
          {c.oaDrawMonthly > 0 && <Action tone="warn" icon={<Building2 size={16} />} title={`You draw ${sgd(c.oaDrawMonthly)}/mo from OA`}>Money taken from OA for housing stops earning 2.5% and misses the accrued-interest you must refund on sale. Keep the drawdown intentional.</Action>}
        </div>
        <Working>
          2026 rates: 37% under 55, 34% at 55–60, 25% at 60–65 — on Ordinary Wages to {sgd(CPF.owCeilingMonthly)}/mo plus bonus, capped at the {sgd(CPF.annualSalaryCeiling)} annual salary ceiling.
          OA earns {pct(CPF.iOA)}, SA/RA/MA {pct(CPF.iRest)}. On top, you earn +1% extra interest on the first $60,000 of combined balances (under 55) — or +2% on the first $30k and +1% on the next $30k from 55 — but only the first $20,000 of OA counts toward it, so the first $20k of OA effectively earns {pct(CPF.iOA + 0.01)}. MediSave is capped at the Basic Healthcare Sum ({sgd(CPF.BHS)}); excess overflows to SA/RA.
          At 55 the SA closes into the RA up to the Full Retirement Sum ({sgd(CPF.sums.FRS)}); anything above becomes withdrawable. Figures are 1 Jan 2026 tables; the 55+ MA/RA split is modelled — verify against the official allocation table and CPF LIFE Estimator.
        </Working>
      </section>
    </div>
  );
}
