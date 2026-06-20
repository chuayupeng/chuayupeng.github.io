import React from "react";
import {
  Target, Plus, Trash2, Home, Heart, GraduationCap, Car, Plane, ShieldAlert,
  CheckCircle2, AlertTriangle, Flag, type LucideIcon,
} from "lucide-react";
import { useStore, uid, Goal, GoalKind } from "../store";
import { useDerived } from "../derive";
import { analyzeGoal } from "../calc/goals";
import { sgd, sgdShort, pct } from "../format";
import { Field, Select, Progress, Action, Chip } from "../ui";

const KINDS: { value: GoalKind; label: string; icon: LucideIcon; color: string }[] = [
  { value: "house", label: "Home", icon: Home, color: "#2F7F66" },
  { value: "wedding", label: "Wedding", icon: Heart, color: "#DD5C36" },
  { value: "education", label: "Education", icon: GraduationCap, color: "#4E8A93" },
  { value: "car", label: "Car", icon: Car, color: "#C28B4B" },
  { value: "travel", label: "Travel", icon: Plane, color: "#5B7DB1" },
  { value: "emergency", label: "Emergency", icon: ShieldAlert, color: "#C44A2C" },
  { value: "custom", label: "Custom", icon: Target, color: "#0F3138" },
];
const kindOf = (k: GoalKind) => KINDS.find((x) => x.value === k) || KINDS[KINDS.length - 1];
const BASE_YEAR = new Date().getFullYear();

export default function Goals() {
  const { state, set } = useStore();
  const d = useDerived();
  const goals = state.goals;

  const setGoal = (id: string, patch: Partial<Goal>) =>
    set("goals", (gs) => gs.map((g) => g.id === id ? { ...g, ...patch } : g));
  const addGoal = () =>
    set("goals", (gs) => [...gs, { id: uid(), name: "New goal", kind: "custom", target: 20000, current: 0, monthly: 300, targetYears: 3, expectedReturn: 0.03 }]);
  const rmGoal = (id: string) => set("goals", (gs) => gs.filter((g) => g.id !== id));

  const analyses = goals.map((g) => ({ g, a: analyzeGoal(g) }));
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);
  const totalMonthly = goals.reduce((s, g) => s + g.monthly, 0);
  const totalRequired = analyses.reduce((s, x) => s + x.a.required, 0);
  const committed = totalMonthly + d.investContribMonthly;   // goals + retirement investing

  return (
    <div className="grid g2">
      {/* summary */}
      <section className="card deep span2">
        <div className="eyebrow"><Flag size={14} /> Saving toward {goals.length} goal{goals.length !== 1 ? "s" : ""}</div>
        <div className="between wrap" style={{ alignItems: "flex-end", gap: 18 }}>
          <div>
            <div className="stat-label" style={{ color: "rgba(234,241,237,.7)" }}>Set aside for goals each month</div>
            <div className="hero-num num">{sgd(totalMonthly)}<span className="per">/mo</span></div>
            <div className="stat-sub" style={{ color: "rgba(234,241,237,.7)" }}>
              {sgd(totalCurrent)} saved of {sgd(totalTarget)} target · {totalRequired > totalMonthly ? <>need <b style={{ color: "#FFB59B" }}>{sgd(totalRequired)}/mo</b> to hit every deadline</> : "every deadline funded at this pace"}
            </div>
          </div>
          <div style={{ minWidth: 220 }}>
            <div className="between" style={{ marginBottom: 6, fontSize: 12.5, color: "rgba(234,241,237,.85)" }}>
              <span>Goals + retirement</span><span className="num">{sgd(committed)}/mo</span>
            </div>
            {(() => {
              const cover = committed > 0 ? Math.min(100, (Math.max(0, d.bud.surplus) / committed) * 100) : 100;
              return <>
                <Progress value={cover} tone={cover >= 99 ? "jade" : cover >= 70 ? "gold" : "coral"} />
                <div className="stat-sub" style={{ color: "rgba(234,241,237,.7)", marginTop: 6 }}>
                  {sgd(Math.max(0, d.bud.surplus))}/mo surplus covers {Math.round(cover)}% of it
                </div>
              </>;
            })()}
          </div>
        </div>
      </section>

      {/* goal cards */}
      {analyses.map(({ g, a }) => {
        const k = kindOf(g.kind);
        const reachYear = a.monthsToTarget != null ? BASE_YEAR + Math.ceil(a.monthsToTarget / 12) : null;
        const deadlineYear = BASE_YEAR + Math.round(g.targetYears);
        return (
          <section key={g.id} className="card">
            <div className="between" style={{ marginBottom: 12, gap: 8 }}>
              <div className="row" style={{ gap: 10, flex: 1, minWidth: 0 }}>
                <span className="action-ico" style={{ background: `${k.color}22`, color: k.color }}><k.icon size={16} /></span>
                <input className="bare" maxLength={48} style={{ fontWeight: 700, fontSize: 15, flex: 1, minWidth: 0, padding: "5px 8px", fontFamily: "inherit" }}
                  value={g.name} onChange={(e) => setGoal(g.id, { name: e.target.value })} />
              </div>
              <button className="icon-btn" onClick={() => rmGoal(g.id)} aria-label="Remove goal"><Trash2 size={14} /></button>
            </div>

            <div className="between" style={{ fontSize: 13, marginBottom: 6 }}>
              <span className="num" style={{ fontWeight: 600 }}>{sgd(g.current)} <span className="muted">of</span> {sgd(g.target)}</span>
              <span className="num muted">{pct(a.fundedNow, 0)}</span>
            </div>
            <Progress value={a.fundedNow * 100} tone={a.onTrack ? "jade" : "gold"} />

            <div className="between wrap" style={{ marginTop: 12, gap: 8 }}>
              {a.onTrack
                ? <Chip tone="ok"><CheckCircle2 size={12} /> On track for {deadlineYear}</Chip>
                : <Chip tone="warn"><AlertTriangle size={12} /> +{sgd(a.shortfall)}/mo to hit {deadlineYear}</Chip>}
              <span className="stat-sub" style={{ margin: 0 }}>
                {reachYear ? <>at {sgd(g.monthly)}/mo → <b>{reachYear}</b></> : "not progressing"}
              </span>
            </div>

            <div className="hr" />
            <div className="grid g2" style={{ gap: "0 14px" }}>
              <Field label="Target" value={g.target} onChange={(n) => setGoal(g.id, { target: n })} step={5000} />
              <Field label="Saved so far" value={g.current} onChange={(n) => setGoal(g.id, { current: n })} step={1000} />
              <Field label="Saving / month" value={g.monthly} onChange={(n) => setGoal(g.id, { monthly: n })} step={100} />
              <label className="field">
                <span className="field-label">Deadline</span>
                <span className="field-box"><input type="number" step={0.5} min={0.5} value={g.targetYears}
                  onChange={(e) => setGoal(g.id, { targetYears: Math.max(0.5, Number(e.target.value)) })} /><span className="field-pre" style={{ padding: "0 11px 0 0" }}>yrs</span></span>
              </label>
            </div>
            <div className="between" style={{ marginTop: 2 }}>
              <span className="field-label" style={{ margin: 0 }}>Held in</span>
              <Select value={g.expectedReturn >= 0.05 ? "invest" : g.expectedReturn >= 0.025 ? "hysa" : "cash"}
                onChange={(v) => setGoal(g.id, { expectedReturn: v === "invest" ? 0.06 : v === "hysa" ? 0.03 : 0.005 })}
                options={[{ value: "cash", label: "Cash 0.5%" }, { value: "hysa", label: "T-bills/HYSA 3%" }, { value: "invest", label: "Invested 6%" }]} />
            </div>
          </section>
        );
      })}

      {/* add */}
      <section className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 120, borderStyle: "dashed" }}>
        <button className="btn" onClick={addGoal}><Plus size={15} /> Add a goal</button>
      </section>

      {/* affordability check */}
      <section className="card span2">
        <div className="eyebrow"><Target size={14} /> Can you afford it all?</div>
        {(() => {
          const room = d.bud.surplus - totalMonthly;
          const anyBehind = analyses.some((x) => !x.a.onTrack);
          if (goals.length === 0) return <Action tone="good" icon={<Flag size={16} />} title="Add your first goal">Track a house downpayment, wedding, car or anything else — I'll tell you the exact monthly amount to set aside and when you'll get there.</Action>;
          if (totalRequired > d.bud.surplus) return <Action tone="warn" icon={<AlertTriangle size={16} />} title={`Your goals need ${sgd(totalRequired)}/mo but your surplus is ${sgd(Math.max(0, d.bud.surplus))}/mo`}>Stretch the deadlines, trim a target, or free up cashflow. Prioritise the emergency fund and time-critical goals (a BTO completion date won't move).</Action>;
          if (room < 0) return <Action tone="warn" icon={<AlertTriangle size={16} />} title="You're committing more than your surplus">Goals take {sgd(totalMonthly)}/mo vs {sgd(Math.max(0, d.bud.surplus))}/mo surplus. You're dipping into reserves — sustainable only short-term.</Action>;
          if (anyBehind) return <Action tone="good" icon={<CheckCircle2 size={16} />} title={`Affordable — ${sgd(room)}/mo to spare, and you can hit every deadline`}>Some goals are behind at their current monthly, but you have the cashflow to top them up to {sgd(totalRequired)}/mo and still stay within surplus.</Action>;
          return <Action tone="good" icon={<CheckCircle2 size={16} />} title={`Comfortable — ${sgd(room)}/mo of surplus to spare`}>Every goal is on track and you still have headroom. Consider routing the spare into your retirement ETFs to compound for longer.</Action>;
        })()}
      </section>
    </div>
  );
}
