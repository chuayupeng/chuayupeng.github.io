import React from "react";
import { PiggyBank, Target, TrendingUp, CheckCircle2, AlertTriangle, Landmark, Sparkles } from "lucide-react";
import { useStore } from "../store";
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

  // The plan we visualise: the recommended path. If already on track, that's the
  // current contribution; otherwise it's the required contribution.
  const recommended = onTrack ? a.current.monthly : a.required.monthly;
  const planSim = onTrack ? a.current.sim : a.required.sim;
  const yearsToRetire = Math.max(0, state.profile.retireAge - d.age);

  // retirement-income floor (nominal at 65)
  const cpfLife = d.cpfProj.lifeMonthly;
  const desiredAt65 = r.desiredMonthlyIncome * Math.pow(1 + r.inflation, Math.max(0, 65 - d.age));
  const floorPct = Math.min(100, desiredAt65 > 0 ? (cpfLife / desiredAt65) * 100 : 0);

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
          <div className="bar-seg" style={{ width: `${floorPct}%`, background: "var(--jade)" }}>CPF LIFE</div>
          <div className="bar-seg" style={{ width: `${100 - floorPct}%`, background: "var(--coral)" }}>your ETFs</div>
        </div>
        <div className="legend">
          <span><i style={{ background: "var(--jade)" }} /> CPF LIFE <b className="num">{sgd(cpfLife)}/mo</b> — guaranteed for life ({Math.round(floorPct)}%)</span>
          <span><i style={{ background: "var(--coral)" }} /> Portfolio funds <b className="num">{sgd(Math.max(0, desiredAt65 - cpfLife))}/mo</b></span>
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
