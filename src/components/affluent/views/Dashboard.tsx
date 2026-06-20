import React, { useMemo } from "react";
import {
  Wallet, PiggyBank, ShieldCheck, TrendingUp, ArrowRight, Landmark,
  CheckCircle2, AlertTriangle, Target, Sparkles, Flag,
} from "lucide-react";
import { useStore } from "../store";
import { useDerived } from "../derive";
import { sgd, sgdShort, pct, clamp } from "../format";
import { Money, Action, Progress } from "../ui";
import { StackedArea } from "../charts";

/* A simple, transparent financial-health score out of 100. */
function healthScore(d: ReturnType<typeof useDerived>) {
  const save = clamp(d.bud.savingsRate / 0.2, 0, 1);              // 20% = full
  const emerg = clamp(d.bud.emergencyMonths / 6, 0, 1);          // 6 mo = full
  const retire = d.retire.onTrack ? 1 : clamp(d.retire.current.monthly / Math.max(1, d.retire.required.monthly), 0, 1);
  const protect = d.checklist.length ? d.checklist.filter((c) => c.status === "covered").length / d.checklist.length : 1;
  const insLoad = d.bud.insuranceRate <= 0.15 ? 1 : clamp(1 - (d.bud.insuranceRate - 0.15) / 0.15, 0, 1);
  const score = Math.round((save * 25 + emerg * 15 + retire * 30 + protect * 22 + insLoad * 8));
  return { score, parts: { save, emerg, retire, protect, insLoad } };
}

function ScoreRing({ score }: { score: number }) {
  const R = 52, C = 2 * Math.PI * R;
  const tone = score >= 75 ? "var(--jade)" : score >= 50 ? "var(--gold)" : "var(--coral)";
  return (
    <svg viewBox="0 0 128 128" style={{ width: 128, height: 128, flexShrink: 0 }}>
      <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="11" />
      <circle cx="64" cy="64" r={R} fill="none" stroke={tone} strokeWidth="11" strokeLinecap="round"
        strokeDasharray={`${(score / 100) * C} ${C}`} transform="rotate(-90 64 64)"
        style={{ transition: "stroke-dasharray .8s cubic-bezier(.2,.7,.2,1)" }} />
      <text x="64" y="60" textAnchor="middle" fontFamily="'IBM Plex Mono',monospace" fontWeight="600" fontSize="30" fill="#fff">{score}</text>
      <text x="64" y="80" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="rgba(255,255,255,.7)">/ 100</text>
    </svg>
  );
}

export default function Dashboard({ go }: { go: (v: string) => void }) {
  const { state } = useStore();
  const d = useDerived();
  const { score } = healthScore(d);
  const onTrack = d.retire.onTrack;

  // prioritized actions across modules
  const actions: { tone: "do" | "warn" | "good"; icon: React.ReactNode; title: string; body: React.ReactNode; to: string; cta: string }[] = [];
  if (!onTrack) actions.push({ tone: "do", icon: <Target size={16} />, title: `Invest ${sgd(d.retire.gapMonthly)}/mo more for retirement`, body: <>Raise ETF investing to <b>{sgd(d.retire.required.monthly)}/mo</b> to fund {sgd(state.retirement.desiredMonthlyIncome)}/mo in retirement.</>, to: "retirement", cta: "Open plan" });
  if (d.bud.emergencyMonths < 6) actions.push({ tone: "warn", icon: <Wallet size={16} />, title: `Build emergency fund to 6 months`, body: <>You hold <b>{d.bud.emergencyMonths.toFixed(1)}×</b> expenses. Park {sgdShort(Math.max(0, (6 - d.bud.emergencyMonths) * (d.bud.outflow)))} more in cash.</>, to: "cashflow", cta: "Cashflow" });
  d.checklist.filter((c) => c.status !== "covered").slice(0, 2).forEach((c) =>
    actions.push({ tone: "do", icon: <ShieldCheck size={16} />, title: c.need == null ? `Add ${c.key.toLowerCase()}` : `${c.key} short by ${sgdShort(c.gap)}`, body: c.note, to: "insurance", cta: "Protection" }));
  if (d.goalsOffTrack > 0) actions.push({ tone: "warn", icon: <Flag size={16} />, title: `${d.goalsOffTrack} goal${d.goalsOffTrack > 1 ? "s" : ""} behind schedule`, body: <>At your current pace {d.goalsOffTrack === 1 ? "one goal won't" : "some goals won't"} hit the deadline. Bump the monthly amount or stretch the date.</>, to: "goals", cta: "Goals" });
  if (d.bud.savingsRate < 0.2) actions.push({ tone: "warn", icon: <PiggyBank size={16} />, title: `Lift savings rate to 20%`, body: <>Currently <b>{pct(d.bud.savingsRate, 0)}</b>. Trim lifestyle or grow income to free up cash to invest.</>, to: "cashflow", cta: "Cashflow" });
  if (d.tax.marginal >= 0.115 && d.tax.srsHeadroom > 0) actions.push({ tone: "good", icon: <Landmark size={16} />, title: `Cut tax with SRS`, body: <>In the {pct(d.tax.marginal, 1)} bracket with {sgd(d.tax.srsHeadroom)} SRS headroom — contributing saves roughly {sgd(d.tax.srsHeadroom * d.tax.marginal)} in tax.</>, to: "retirement", cta: "Retirement" });
  if (!actions.length) actions.push({ tone: "good", icon: <CheckCircle2 size={16} />, title: "You're in great shape", body: "Savings, protection and retirement are all on track. Keep contributions automatic and review quarterly.", to: "investments", cta: "Investments" });

  // combined wealth trajectory: CPF + investment portfolio + cash/property/other − debt, now → retirement.
  // "other" folds in everything else so the t0 total reconciles with the Net worth tile.
  const wealth = useMemo(() => {
    const retireAge = state.profile.retireAge;
    const cpfAt = (a: number) => { const p = d.cpfProj.pts.find((q) => q.age === a); return p ? p.OA + p.SA + p.RA + p.MA : d.cpfTotalNow; };
    const investAt = (a: number) => { const p = d.retire.current.sim.points.find((q) => q.age === a); return p ? p.balance : d.liquidInvest; };
    const other = d.cashHoldings + d.propertyEquity + d.otherHoldings - d.liabilities;
    const pts: Record<string, number>[] = [];
    for (let a = d.age; a <= retireAge; a++) pts.push({ x: a, cpf: cpfAt(a), invest: investAt(a), other: Math.max(0, other) });
    const end = pts[pts.length - 1];
    return { pts, atRetire: end ? end.cpf + end.invest + end.other : d.netWorth, retireAge, degenerate: pts.length < 2 };
  }, [d, state.profile.retireAge]);

  const tiles = [
    { key: "cashflow", icon: <Wallet size={15} />, label: "Net worth", value: sgd(d.netWorth), sub: `${sgdShort(d.liquidInvest)} invested · ${sgdShort(d.cpfTotalNow)} CPF`, tone: "" },
    { key: "cashflow", icon: <PiggyBank size={15} />, label: "Monthly surplus", value: sgd(d.bud.surplus), sub: `${pct(d.bud.savingsRate, 0)} savings rate`, tone: d.bud.surplus >= 0 ? "" : "neg" },
    { key: "retirement", icon: <Target size={15} />, label: "Invest for retirement", value: `${sgd(onTrack ? d.retire.current.monthly : d.retire.required.monthly)}/mo`, sub: onTrack ? "on track" : `${sgd(d.retire.gapMonthly)}/mo short`, tone: onTrack ? "pos" : "neg" },
    { key: "insurance", icon: <ShieldCheck size={15} />, label: "Protection", value: `${d.checklist.filter((c) => c.status === "covered").length}/${d.checklist.length} covered`, sub: d.protectionGaps ? `${d.protectionGaps} gap${d.protectionGaps > 1 ? "s" : ""}` : "fully covered", tone: d.protectionGaps ? "neg" : "pos" },
  ];

  return (
    <div className="grid g2">
      {/* hero: health score */}
      <section className="card deep span2">
        <div className="between wrap" style={{ gap: 18, alignItems: "center" }}>
          <div className="row" style={{ gap: 20 }}>
            <ScoreRing score={score} />
            <div>
              <div className="eyebrow"><Sparkles size={14} /> Financial health</div>
              <div style={{ fontSize: 20, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>
                {score >= 75 ? "Strong and on course" : score >= 50 ? "Solid, a few gaps to close" : "Needs attention"}
              </div>
              <p className="muted" style={{ margin: "6px 0 0", maxWidth: "46ch", fontSize: 12.5 }}>
                A blend of your savings rate, emergency fund, retirement funding, protection and premium load. Work the actions below to lift it.
              </p>
            </div>
          </div>
          <div style={{ minWidth: 200, fontSize: 12 }}>
            {[
              { l: "Retirement funding", v: onTrack ? 1 : clamp(d.retire.current.monthly / Math.max(1, d.retire.required.monthly), 0, 1) },
              { l: "Savings rate", v: clamp(d.bud.savingsRate / 0.2, 0, 1) },
              { l: "Protection", v: d.checklist.filter((c) => c.status === "covered").length / Math.max(1, d.checklist.length) },
              { l: "Emergency fund", v: clamp(d.bud.emergencyMonths / 6, 0, 1) },
            ].map((x) => (
              <div key={x.l} style={{ marginBottom: 9 }}>
                <div className="between" style={{ marginBottom: 4, color: "rgba(234,241,237,.85)" }}><span>{x.l}</span><span className="num">{pct(x.v, 0)}</span></div>
                <Progress value={x.v * 100} tone={x.v >= 0.75 ? "jade" : x.v >= 0.5 ? "gold" : "coral"} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* metric tiles */}
      <section className="grid g4 span2" style={{ gap: 12 }}>
        {tiles.map((t, i) => (
          <button key={i} className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => go(t.key)}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{t.icon} {t.label}</div>
            <div className="stat-mid num">{t.value}</div>
            <div className={`stat-sub ${t.tone}`}>{t.sub}</div>
          </button>
        ))}
      </section>

      {/* wealth projection */}
      <section className="card span2">
        <div className="between wrap" style={{ alignItems: "flex-start", marginBottom: 4 }}>
          <div className="eyebrow" style={{ margin: 0 }}><TrendingUp size={14} /> Projected net worth to retirement</div>
          <div style={{ textAlign: "right" }}>
            <div className="stat-mid num" style={{ color: "var(--deep)" }}><Money value={wealth.atRetire} render={sgdShort} /></div>
            <div className="stat-sub" style={{ margin: 0 }}>at age {wealth.retireAge}</div>
          </div>
        </div>
        {wealth.degenerate ? (
          <div className="empty">You're at or past your planned retirement age — set a later age in Settings to see a projection.</div>
        ) : (
          <>
            <StackedArea points={wealth.pts}
              series={[{ key: "other", color: "#C28B4B", label: "Cash & other" }, { key: "cpf", color: "#4E8A93", label: "CPF" }, { key: "invest", color: "#2F7F66", label: "Investments" }]}
              W={760} H={170} />
            <div className="axis"><span>age {d.age}</span><span>age {wealth.retireAge}</span></div>
            <div className="legend">
              <span><i style={{ background: "#2F7F66" }} /> Investments</span>
              <span><i style={{ background: "#4E8A93" }} /> CPF</span>
              <span><i style={{ background: "#C28B4B" }} /> Cash &amp; other</span>
            </div>
          </>
        )}
      </section>

      {/* priority actions */}
      <section className="card span2">
        <div className="eyebrow"><Target size={14} /> Your next moves, in order</div>
        <div className="grid" style={{ gap: 10 }}>
          {actions.slice(0, 5).map((a, i) => (
            <div key={i} className="action" style={{ borderLeftColor: a.tone === "do" ? "var(--coral)" : a.tone === "warn" ? "var(--warn)" : "var(--jade)" }}>
              <div className="action-ico" style={{ background: a.tone === "good" ? "rgba(47,127,102,.12)" : a.tone === "warn" ? "rgba(200,134,31,.12)" : "rgba(221,92,54,.12)", color: a.tone === "good" ? "var(--jade)" : a.tone === "warn" ? "var(--warn)" : "var(--coral)" }}>{a.icon}</div>
              <div className="grow"><h4>{a.title}</h4><p>{a.body}</p></div>
              <button className="btn sm" onClick={() => go(a.to)} style={{ alignSelf: "center" }}>{a.cta} <ArrowRight size={13} /></button>
            </div>
          ))}
        </div>
      </section>

      {/* this month + retirement snapshot */}
      <section className="card">
        <div className="eyebrow"><Wallet size={14} /> This month</div>
        <div className="bar tall" style={{ marginBottom: 10 }}>
          <div className="bar-seg" style={{ width: `${pctOf(d.bud.essential, d.bud.takeHome)}%`, background: "#0F3138" }}>needs</div>
          <div className="bar-seg" style={{ width: `${pctOf(d.bud.insurance, d.bud.takeHome)}%`, background: "#DD5C36" }}>ins</div>
          <div className="bar-seg" style={{ width: `${pctOf(d.bud.discretionary, d.bud.takeHome)}%`, background: "#B7BDB0" }}>wants</div>
          <div className="bar-seg" style={{ width: `${pctOf(Math.max(0, d.bud.surplus), d.bud.takeHome)}%`, background: "#1C4D45" }}>save</div>
        </div>
        <div className="between" style={{ fontSize: 13 }}><span className="muted">Take-home</span><b className="num">{sgd(d.bud.takeHome)}</b></div>
        <div className="between" style={{ fontSize: 13, marginTop: 4 }}><span className="muted">Surplus to invest</span><b className="num pos">{sgd(d.bud.surplus)}</b></div>
        <button className="btn sm" style={{ marginTop: 12 }} onClick={() => go("cashflow")}>Open cashflow <ArrowRight size={13} /></button>
      </section>

      <section className="card">
        <div className="eyebrow"><TrendingUp size={14} /> Retirement at a glance</div>
        <div className="between" style={{ fontSize: 13, marginBottom: 6 }}><span className="muted">Nest egg at {state.profile.retireAge}</span>
          <b className="num"><Money value={(onTrack ? d.retire.current.sim : d.retire.required.sim).nestEgg} render={sgdShort} /></b></div>
        <div className="between" style={{ fontSize: 13, marginBottom: 6 }}><span className="muted">CPF LIFE from 65</span><b className="num">{sgd(d.cpfProj.lifeMonthly)}/mo</b></div>
        <div className="between" style={{ fontSize: 13 }}><span className="muted">Money lasts to</span>
          <b className="num">{(onTrack ? d.retire.current.sim : d.retire.required.sim).depletionAge ? `age ${Math.floor((onTrack ? d.retire.current.sim : d.retire.required.sim).depletionAge!)}` : `${state.profile.lifeExpectancy}+`}</b></div>
        <button className="btn sm" style={{ marginTop: 12 }} onClick={() => go("retirement")}>Open retirement plan <ArrowRight size={13} /></button>
      </section>
    </div>
  );
}

const pctOf = (v: number, total: number) => total > 0 ? Math.max(0, Math.min(100, (v / total) * 100)) : 0;
