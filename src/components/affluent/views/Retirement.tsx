import React from "react";
import { PiggyBank, Target, TrendingUp, CheckCircle2, AlertTriangle, Landmark, Sparkles, Coins, Plus, Trash2 } from "lucide-react";
import { useStore, uid } from "../store";
import { useDerived } from "../derive";
import { sgd, sgdShort, pct } from "../format";
import { Slider, Money, Working, Progress, Action, Chip } from "../ui";
import { BalanceChart } from "../charts";

export default function Retirement() {
  const { state, set } = useStore();
  const d = useDerived();
  const r = state.retirement;
  const a = d.retire;
  const onTrack = a.onTrack;

  // other-retirement-income editors
  const addStream = () => set("retirement", (p) => ({ ...p, otherIncome: [...p.otherIncome, { id: uid(), label: "Income", monthly: 500, fromAge: state.profile.retireAge, toAge: null }] }));
  const setStream = (id: string, patch: Partial<{ label: string; monthly: number; fromAge: number; toAge: number | null }>) =>
    set("retirement", (p) => ({ ...p, otherIncome: p.otherIncome.map((s) => s.id === id ? { ...s, ...patch } : s) }));
  const rmStream = (id: string) => set("retirement", (p) => ({ ...p, otherIncome: p.otherIncome.filter((s) => s.id !== id) }));
  const addLump = () => set("retirement", (p) => ({ ...p, lumpSums: [...p.lumpSums, { id: uid(), label: "Maturity", amount: 50000, atAge: 65 }] }));
  const setLump = (id: string, patch: Partial<{ label: string; amount: number; atAge: number }>) =>
    set("retirement", (p) => ({ ...p, lumpSums: p.lumpSums.map((l) => l.id === id ? { ...l, ...patch } : l) }));
  const rmLump = (id: string) => set("retirement", (p) => ({ ...p, lumpSums: p.lumpSums.filter((l) => l.id !== id) }));

  // The plan we visualise: the recommended path. If already on track, that's the
  // current contribution; otherwise it's the required contribution.
  const recommended = onTrack ? a.current.monthly : a.required.monthly;
  const planSim = onTrack ? a.current.sim : a.required.sim;
  const yearsToRetire = Math.max(0, state.profile.retireAge - d.age);

  // retirement-income floor (nominal at 65)
  const cpfLife = d.cpfProj.lifeMonthly;
  const desiredAt65 = r.desiredMonthlyIncome * Math.pow(1 + r.inflation, Math.max(0, 65 - d.age));
  const otherAt65 = r.otherIncome
    .filter((s) => 65 >= s.fromAge && (s.toAge == null || 65 <= s.toAge))
    .reduce((sum, s) => sum + s.monthly, 0) * Math.pow(1 + r.inflation, Math.max(0, 65 - d.age));
  const cpfPct = Math.min(100, desiredAt65 > 0 ? (cpfLife / desiredAt65) * 100 : 0);
  const otherPct = Math.min(Math.max(0, 100 - cpfPct), desiredAt65 > 0 ? (otherAt65 / desiredAt65) * 100 : 0);
  const etfPct = Math.max(0, 100 - cpfPct - otherPct);

  const currentLasts = a.current.sim.depletionAge === null;

  return (
    <div className="grid g2">
      {/* HERO — the prescription */}
      <section className="card deep span2">
        <div className="eyebrow"><Target size={14} /> Your retirement instruction</div>
        <div className="between wrap" style={{ alignItems: "flex-end", gap: 18 }}>
          <div>
            <div className="stat-label" style={{ color: "rgba(234,241,237,.7)" }}>Invest this much into ETFs, every month</div>
            <div className="hero-num num" style={{ color: "#fff" }}><Money value={recommended} render={sgd} /><span className="per">/mo</span></div>
            <div className="stat-sub" style={{ color: "rgba(234,241,237,.75)", maxWidth: "42ch" }}>
              to fund <b>{sgd(r.desiredMonthlyIncome)}/mo</b> (today's dollars) from age {state.profile.retireAge} to {state.profile.lifeExpectancy},
              on top of your CPF LIFE.
              {onTrack && a.current.monthly > a.required.monthly + 1 &&
                <> You only strictly need <b>{sgd(a.required.monthly)}/mo</b> — you're ahead.</>}
            </div>
          </div>
          <div style={{ minWidth: 220 }}>
            <div className="between" style={{ marginBottom: 6, fontSize: 12.5, color: "rgba(234,241,237,.85)" }}>
              <span>You invest now</span><span className="num">{sgd(a.current.monthly)}/mo</span>
            </div>
            <Progress value={a.current.monthly / Math.max(recommended, a.current.monthly, 1) * 100} tone={onTrack ? "jade" : "coral"} />
            <div style={{ marginTop: 10 }}>
              {onTrack
                ? <Chip tone="ok"><CheckCircle2 size={13} /> On track — keep it up</Chip>
                : <Chip tone="bad"><AlertTriangle size={13} /> Increase by {sgd(a.gapMonthly)}/mo</Chip>}
            </div>
          </div>
        </div>
      </section>

      {/* outcome stats */}
      <section className="card g3 grid span2" style={{ alignItems: "stretch" }}>
        <div>
          <div className="stat-label">Nest egg at {state.profile.retireAge}</div>
          <div className="stat-big num"><Money value={planSim.nestEgg} render={sgdShort} /></div>
          <div className="stat-sub">≈ {sgdShort(planSim.nestEggReal)} in today's dollars</div>
        </div>
        <div>
          <div className="stat-label">Money lasts until</div>
          <div className="stat-big num">{planSim.depletionAge ? `age ${Math.floor(planSim.depletionAge)}` : `${state.profile.lifeExpectancy}+`}</div>
          <div className="stat-sub">{planSim.depletionAge ? "portfolio runs dry — CPF LIFE continues" : `plus ${sgdShort(planSim.endingBalance)} legacy at ${state.profile.lifeExpectancy}`}</div>
        </div>
        <div>
          <div className="stat-label">Your current plan supports</div>
          <div className="stat-big num">{sgd(a.current.sustainableIncomeToday)}<span className="per">/mo</span></div>
          <div className="stat-sub">today's dollars, lasting to {state.profile.lifeExpectancy} {currentLasts ? "" : `(currently runs dry at ${Math.floor(a.current.sim.depletionAge!)})`}</div>
        </div>
      </section>

      {/* projection chart */}
      <section className="card span2">
        <div className="eyebrow"><TrendingUp size={14} /> Portfolio path — accumulate, then draw down</div>
        <BalanceChart points={planSim.points} retireAge={state.profile.retireAge} depletionAge={planSim.depletionAge} />
        <div className="axis"><span>age {d.age}</span><span>{state.profile.retireAge}</span><span>{state.profile.lifeExpectancy}</span></div>
        <div className="legend">
          <span><i style={{ background: "var(--jade)" }} /> Accumulation — investing {sgd(recommended)}/mo at {pct(r.returnPre)}</span>
          <span><i style={{ background: "var(--coral)" }} /> Drawdown — spending at {pct(r.returnPost)}, topped by CPF LIFE</span>
        </div>
        <Working>
          Month-by-month simulation. While working, your {sgdShort(d.liquidInvest)} of investable assets plus {sgd(recommended)}/mo grow at {pct(r.returnPre)} nominal.
          From {state.profile.retireAge} you withdraw your target income (inflated at {pct(r.inflation)}/yr), reduced by CPF LIFE once it starts at 65, with the remainder growing at a more conservative {pct(r.returnPost)}.
          The required figure is solved so the portfolio lasts exactly to age {state.profile.lifeExpectancy}.
        </Working>
      </section>

      {/* income floor */}
      <section className="card">
        <div className="eyebrow"><Landmark size={14} /> Your guaranteed floor vs. your target</div>
        <div className="stat-sub" style={{ marginBottom: 8 }}>At 65, against a {sgd(desiredAt65)}/mo need (your {sgd(r.desiredMonthlyIncome)} target grown by inflation):</div>
        <div className="bar tall">
          <div className="bar-seg" style={{ width: `${cpfPct}%`, background: "var(--jade)" }}>CPF LIFE</div>
          {otherPct > 0 && <div className="bar-seg" style={{ width: `${otherPct}%`, background: "#4E8A93" }}>other</div>}
          <div className="bar-seg" style={{ width: `${etfPct}%`, background: "var(--coral)" }}>your ETFs</div>
        </div>
        <div className="legend">
          <span><i style={{ background: "var(--jade)" }} /> CPF LIFE <b className="num">{sgd(cpfLife)}/mo</b> — guaranteed for life ({Math.round(cpfPct)}%)</span>
          {otherAt65 > 0 && <span><i style={{ background: "#4E8A93" }} /> Other income <b className="num">{sgd(otherAt65)}/mo</b></span>}
          <span><i style={{ background: "var(--coral)" }} /> Portfolio funds <b className="num">{sgd(Math.max(0, desiredAt65 - cpfLife - otherAt65))}/mo</b></span>
        </div>
      </section>

      {/* assumptions */}
      <section className="card">
        <div className="eyebrow"><Sparkles size={14} /> Your assumptions</div>
        <Slider label="Desired income in retirement" value={r.desiredMonthlyIncome} onChange={(n) => set("retirement", (p) => ({ ...p, desiredMonthlyIncome: n }))} min={1500} max={15000} step={250} fmt={(v) => sgd(v) + "/mo"} />
        <Slider label="Retirement age" value={state.profile.retireAge} onChange={(n) => set("profile", (p) => ({ ...p, retireAge: n }))} min={Math.max(45, d.age + 1)} max={Math.min(75, state.profile.lifeExpectancy - 1)} step={1} fmt={(v) => `${v}`} />
        <Slider label="Plan to age" value={state.profile.lifeExpectancy} onChange={(n) => set("profile", (p) => ({ ...p, lifeExpectancy: n }))} min={75} max={100} step={1} fmt={(v) => `${v}`} />
        <Slider label="Return while investing" value={r.returnPre} onChange={(n) => set("retirement", (p) => ({ ...p, returnPre: n }))} min={0.02} max={0.10} step={0.005} fmt={pct} />
        <Slider label="Return in retirement" value={r.returnPost} onChange={(n) => set("retirement", (p) => ({ ...p, returnPost: n }))} min={0.01} max={0.07} step={0.005} fmt={pct} />
        <Slider label="Inflation" value={r.inflation} onChange={(n) => set("retirement", (p) => ({ ...p, inflation: n }))} min={0.01} max={0.05} step={0.0025} fmt={pct} />
      </section>

      {/* other retirement income */}
      <section className="card span2">
        <div className="eyebrow"><Coins size={14} /> Other retirement income</div>
        <div className="stat-sub" style={{ marginBottom: 12 }}>
          Streams (annuity, rental, part-time) reduce how much you draw from your portfolio; lump sums (endowment / savings-plan maturities) add to your nest egg. Both feed the plan and chart above.
        </div>

        <div className="between" style={{ marginBottom: 8 }}>
          <span className="field-label" style={{ margin: 0 }}>Monthly income streams</span>
          <button className="btn sm" onClick={addStream}><Plus size={14} /> Add stream</button>
        </div>
        {r.otherIncome.length === 0
          ? <div className="empty" style={{ padding: "8px 0 4px" }}>None yet — add rental, an annuity, or part-time work. CPF LIFE is already counted separately.</div>
          : <div className="pol-list">
              {r.otherIncome.map((s) => (
                <div className="pol-card" key={s.id}>
                  <div className="pol-head">
                    <input className="bare pol-name" aria-label="Income label" maxLength={40} placeholder="e.g. Rental income"
                      value={s.label} onChange={(e) => setStream(s.id, { label: e.target.value })} />
                    <button className="icon-btn" onClick={() => rmStream(s.id)} aria-label="Remove income stream"><Trash2 size={14} /></button>
                  </div>
                  <div className="pol-body">
                    <label className="pol-field"><span className="pol-flabel">Amount <em>/mo</em></span>
                      <MoneyIn value={s.monthly} step={100} onChange={(n) => setStream(s.id, { monthly: n })} /></label>
                    <label className="pol-field"><span className="pol-flabel">From age</span>
                      <AgeIn value={s.fromAge} min={40} max={100} onChange={(n) => setStream(s.id, { fromAge: n ?? s.fromAge })} /></label>
                    <label className="pol-field"><span className="pol-flabel">To age <em>blank = life</em></span>
                      <AgeIn value={s.toAge} min={40} max={110} allowEmpty onChange={(n) => setStream(s.id, { toAge: n })} /></label>
                  </div>
                </div>
              ))}
            </div>}

        <div className="hr" />

        <div className="between" style={{ marginBottom: 8 }}>
          <span className="field-label" style={{ margin: 0 }}>Lump sums at maturity</span>
          <button className="btn sm" onClick={addLump}><Plus size={14} /> Add lump sum</button>
        </div>
        {r.lumpSums.length === 0
          ? <div className="empty" style={{ padding: "8px 0 4px" }}>None yet — add an endowment or savings plan that pays out a lump sum at a set age.</div>
          : <div className="pol-list">
              {r.lumpSums.map((l) => (
                <div className="pol-card" key={l.id}>
                  <div className="pol-head">
                    <input className="bare pol-name" aria-label="Lump sum label" maxLength={40} placeholder="e.g. Endowment maturity"
                      value={l.label} onChange={(e) => setLump(l.id, { label: e.target.value })} />
                    <button className="icon-btn" onClick={() => rmLump(l.id)} aria-label="Remove lump sum"><Trash2 size={14} /></button>
                  </div>
                  <div className="pol-body">
                    <label className="pol-field"><span className="pol-flabel">Payout</span>
                      <MoneyIn value={l.amount} step={5000} onChange={(n) => setLump(l.id, { amount: n })} /></label>
                    <label className="pol-field"><span className="pol-flabel">At age</span>
                      <AgeIn value={l.atAge} min={40} max={100} onChange={(n) => setLump(l.id, { atAge: n ?? l.atAge })} /></label>
                  </div>
                </div>
              ))}
            </div>}
        {d.endowmentLumps.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {d.endowmentLumps.map((l) => (
              <div key={l.id} className="readrow">
                <span className="muted">{l.label} <Chip tone="neutral">from Insurance</Chip></span>
                <b className="num">{sgd(l.amount)} at {l.atAge}</b>
              </div>
            ))}
            <div className="note" style={{ marginTop: 4 }}>Endowment maturities you entered in Insurance are counted automatically — edit them there.</div>
          </div>
        )}
      </section>

      {/* actions */}
      <section className="card span2">
        <div className="eyebrow"><CheckCircle2 size={14} /> Do this</div>
        <div className="grid g2" style={{ gap: 10 }}>
          {onTrack
            ? <Action tone="good" icon={<CheckCircle2 size={16} />} title="Keep investing on autopilot">Your {sgd(a.current.monthly)}/mo already funds the plan. Automate it as a monthly standing order into your ETFs so you never skip a month.</Action>
            : <Action tone="do" icon={<Target size={16} />} title={`Raise ETF investing to ${sgd(recommended)}/mo`}>
                You're {sgd(a.gapMonthly)}/mo short. Your cashflow surplus is {sgd(Math.max(0, d.bud.surplus))}/mo — {d.bud.surplus >= a.gapMonthly ? "you can fund the full gap from it today." : `direct all of it here and find ${sgd(a.gapMonthly - Math.max(0, d.bud.surplus))}/mo more from expenses.`}
              </Action>}
          <Action tone="good" icon={<TrendingUp size={16} />} title="Use low-cost, broad ETFs">A globally diversified core (e.g. an S&P 500 + world ETF) keeps fees minimal. Irish-domiciled accumulating funds reduce US dividend withholding tax for Singapore investors.</Action>
          {d.tax.marginal >= 0.115 && <Action tone="good" icon={<Landmark size={16} />} title={`Shelter via SRS — you're in the ${pct(d.tax.marginal, 1)} bracket`}>Contributing to SRS cuts taxable income now and lets the money grow for retirement. You have {sgd(d.tax.srsHeadroom)} of SRS headroom this year.</Action>}
          {yearsToRetire <= 10 && <Action tone="warn" icon={<AlertTriangle size={16} />} title="Glide to safety as you near retirement">With {yearsToRetire} years left, start shifting new money toward bonds/cash so a crash just before retirement can't derail you.</Action>}
        </div>
      </section>
    </div>
  );
}

function MoneyIn({ value, onChange, step = 100 }: { value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <span className="field-box" style={{ display: "inline-flex", width: "100%" }}>
      <span className="field-pre">S$</span>
      <input type="number" value={Number.isFinite(value) ? value : 0} min={0} step={step}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} />
    </span>
  );
}

function AgeIn({ value, onChange, min = 40, max = 110, allowEmpty = false }:
  { value: number | null; onChange: (n: number | null) => void; min?: number; max?: number; allowEmpty?: boolean }) {
  return (
    <span className="field-box" style={{ display: "inline-flex", width: "100%" }}>
      <input type="number" value={value == null ? "" : value} min={min} max={max} placeholder={allowEmpty ? "life" : ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") { onChange(allowEmpty ? null : min); return; }
          const n = Math.min(max, Math.max(min, Math.round(Number(raw) || min)));
          onChange(n);
        }} />
    </span>
  );
}
