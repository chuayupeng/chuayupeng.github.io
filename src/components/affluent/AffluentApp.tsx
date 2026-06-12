import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Scale, Target, ShieldHalf, Lock, ChevronDown, Info,
  ArrowUpRight, BadgeCheck, Layers, CircleDot, Landmark, Wallet, Activity
} from "lucide-react";

/* ============================ calc layer (pure) ============================ */
/* Mirrors the Python calc/ signatures. Illustrative formulas for the demo. */

const fvAnnuity = (pmt, rate, years) =>
  rate === 0 ? pmt * years : pmt * (Math.pow(1 + rate, years) - 1) / rate;

/* Basic Financial Planning Guide rules of thumb (MAS · MoneySense · CPF · LIA) */
const BFPG = { deathTpd: 9, ci: 4, premiumPct: 0.15 };

function protectionBreakdown({ annualIncome, incomeYears, existingLife, existingCI, debts, mortgage, educationCost }) {
  const incomeReplacement = annualIncome * incomeYears;                 // years of income to replace
  const death = debts + mortgage + educationCost + incomeReplacement;   // DIME — driven by years-to-replace
  const tpd = death;                                                    // permanent income loss ≈ death need
  const ci = annualIncome * BFPG.ci;                                    // 4× income (~5-yr recovery)
  const benchmark9x = annualIncome * BFPG.deathTpd;                     // BFPG 9× rule of thumb (comparison)
  const takeHome = annualIncome * 0.80;                                 // rough: less ~20% employee CPF
  return {
    rows: [
      { key: "Death", basis: `${incomeYears}-yr income + debts + mortgage + edu`, need: death, have: existingLife },
      { key: "Total & permanent disability", basis: "same as death", need: tpd, have: existingLife },
      { key: "Critical illness", basis: "4× income (~5-yr recovery)", need: ci, have: existingCI },
    ],
    incomeReplacement, benchmark9x,
    premiumBudget: takeHome * BFPG.premiumPct,
  };
}

/* MediShield Life — actual figures (policies from 1 Oct 2025, incl. 9% GST, MediSave-payable). Source: CPF / insurer premium tables. */
const MSL = {
  premiumByAge: [
    { upTo: 20, p: 200 }, { upTo: 30, p: 295 }, { upTo: 40, p: 503 },
    { upTo: 50, p: 637 }, { upTo: 60, p: 903 }, { upTo: 65, p: 1131 },
    { upTo: 70, p: 1326 }, { upTo: 73, p: 1643 }, { upTo: 75, p: 1816 },
    { upTo: 78, p: 2027 }, { upTo: 80, p: 2187 }, { upTo: 999, p: 2303 },
  ],
  dedC: 1500, dedB2: 2000, dedA: 3500, annualLimit: 200000,
};
function mslPremium(age) {
  const b = MSL.premiumByAge.find((x) => age <= x.upTo) || MSL.premiumByAge.at(-1);
  return b.p;
}
function mslOutOfPocket(bill, deductible) {
  const afterDed = Math.max(0, bill - deductible);            // tiered co-insurance (illustrative bands)
  let coins = 0, rem = afterDed;
  const t1 = Math.min(rem, 5000); coins += t1 * 0.10; rem -= t1;
  const t2 = Math.min(rem, 5000); coins += t2 * 0.05; rem -= t2;
  coins += rem * 0.03;
  const dedPart = Math.min(bill, deductible);
  const oop = Math.min(bill, dedPart + coins);
  const covered = Math.max(0, Math.min(bill, MSL.annualLimit) - oop);
  return { oop, covered, dedPart, coins: oop - dedPart };
}

function budget({ income, expenses, insurance }) {
  const savings = income - expenses - insurance;
  return { income, expenses, insurance, savings };
}

function requiredMonthlySaving({ target, years, current, annualReturn }) {
  const r = annualReturn / 12, n = years * 12;
  const fvCurrent = current * Math.pow(1 + r, n);
  const remaining = Math.max(0, target - fvCurrent);
  const pmt = r === 0 ? remaining / n : remaining * r / (Math.pow(1 + r, n) - 1);
  return { pmt, fvCurrent, remaining };
}

function ilpVsBti({ years, ilpPremium, ilpFee, termPremium, expectedReturn }) {
  const ilpNet = expectedReturn - ilpFee;
  const ilpValue = fvAnnuity(ilpPremium, ilpNet, years);
  const diff = Math.max(0, ilpPremium - termPremium);
  const btiValue = fvAnnuity(diff, expectedReturn, years);
  const feeCost = btiValue - ilpValue;
  return { ilpValue, btiValue, diff, ilpNet, feeCost };
}

/* ============================ CPF engine (2026, accurate) ============================ */
/* Sources: CPF Board contribution/allocation tables from 1 Jan 2026. Under-55 figures exact;
   55+ MediSave/RA split is approximate (verify vs the official Jan-2026 allocation table). */
const CPF = {
  owCeilingMonthly: 8000,        // OW ceiling 2026
  annualSalaryCeiling: 102000,   // caps OW + AW subject to CPF for the year
  annualLimit: 37740,            // CPF Annual Limit = 37% × 102,000
  BHS: 79000,                    // Basic Healthcare Sum 2026 (MA cap; excess overflows to SA/RA→OA)
  iOA: 0.025, iRest: 0.04,       // OA 2.5%; SA/MA/RA 4% floor (to Dec 2026)
  sums: { BRS: 110200, FRS: 220400, ERS: 440800 },   // cohort turning 55 in 2026
  life: { BRS: 950, FRS: 1780, ERS: 3440 },          // est. monthly CPF LIFE Standard from 65
  // contribution rates by age: total / employer / employee
  rates: [
    { upTo: 55, total: 0.37,  er: 0.17,  ee: 0.20  },
    { upTo: 60, total: 0.34,  er: 0.16,  ee: 0.18  },
    { upTo: 65, total: 0.25,  er: 0.125, ee: 0.125 },
    { upTo: 70, total: 0.165, er: 0.09,  ee: 0.075 },
    { upTo: 999, total: 0.125, er: 0.075, ee: 0.05 },
  ],
  // allocation as % of WAGE (OA, SA/RA, MA); each row sums to that band's total rate
  alloc: [
    { upTo: 35, oa: 0.23,  sa: 0.06,  ma: 0.08  },
    { upTo: 45, oa: 0.21,  sa: 0.07,  ma: 0.09  },
    { upTo: 50, oa: 0.19,  sa: 0.08,  ma: 0.10  },
    { upTo: 55, oa: 0.15,  sa: 0.115, ma: 0.105 },
    { upTo: 60, oa: 0.12,  sa: 0.115, ma: 0.105 },   // SA→RA from 55; MA/RA split approximate
    { upTo: 65, oa: 0.035, sa: 0.11,  ma: 0.105 },
    { upTo: 70, oa: 0.01,  sa: 0.05,  ma: 0.105 },
    { upTo: 999, oa: 0.01, sa: 0.015, ma: 0.10  },
  ],
};

const pick = (arr, age) => arr.find((x) => age < x.upTo) || arr[arr.length - 1];

/* One year's contribution from monthly salary + annual bonus, respecting OW/AW ceilings */
function cpfContribAnnual(monthlySalary, annualBonus, age) {
  const owAnnual = Math.min(monthlySalary, CPF.owCeilingMonthly) * 12;     // OW subject to CPF
  const awCeiling = Math.max(0, CPF.annualSalaryCeiling - owAnnual);       // AW headroom
  const awSubject = Math.min(annualBonus, awCeiling);                      // bonus subject to CPF
  const wages = owAnnual + awSubject;                                      // ≤ 102,000
  const r = pick(CPF.rates, age);
  const a = pick(CPF.alloc, age);
  return {
    owAnnual, awSubject, awCeiling, wages,
    total: wages * r.total, employer: wages * r.er, employee: wages * r.ee,
    oa: wages * a.oa, sa: wages * a.sa, ma: wages * a.ma,
    rate: r, capped: wages >= CPF.annualSalaryCeiling - 1,
  };
}

function cpfLifePayout(ra) {
  const { BRS, FRS, ERS } = CPF.sums, L = CPF.life;
  if (ra <= 0) return 0;
  if (ra < BRS) return L.BRS * (ra / BRS);
  if (ra < FRS) return L.BRS + (L.FRS - L.BRS) * (ra - BRS) / (FRS - BRS);
  if (ra < ERS) return L.FRS + (L.ERS - L.FRS) * (ra - FRS) / (ERS - FRS);
  return L.ERS;
}

/* Year-by-year projection with OA drawdown for housing/investment. Includes a simplified
   extra-interest model (+1% first $60k <55; +2%/+1% first/next $30k for 55+). */
function cpfProject({ age, salary, bonus, salaryGrowth, oa0, sa0, ma0, oaDrawMonthly, toAge = 70 }) {
  let A = age, OA = oa0, SA = sa0, MA = ma0, RA = 0, sal = salary, bon = bonus;
  const pts: any[] = [{ age: A, OA, SA, RA, MA }];
  const ms: Record<string, number> = {};
  for (; A < toAge; A++) {
    if (A >= 55 && SA > 0) {                          // SA closes at 55: move to RA up to FRS, excess to OA
      const toRA = Math.min(SA, Math.max(0, CPF.sums.FRS - RA));
      RA += toRA; OA += SA - toRA; SA = 0;
    }
    const beforeInt = OA + SA + MA + RA;
    OA *= (1 + CPF.iOA); SA *= (1 + CPF.iRest); MA *= (1 + CPF.iRest); RA *= (1 + CPF.iRest);
    const combined = OA + SA + MA + RA;              // extra interest (modeled)
    const extra = A < 55 ? 0.01 * Math.min(combined, 60000)
      : 0.02 * Math.min(combined, 30000) + 0.01 * Math.min(Math.max(0, combined - 30000), 30000);
    if (A < 55) SA += extra; else RA += extra;
    const interestYr = OA + SA + MA + RA - beforeInt;
    const c = cpfContribAnnual(sal, bon, A);          // contributions for age A
    OA += c.oa; MA += c.ma;
    if (A < 55) SA += c.sa;
    else { const toRA = Math.min(c.sa, Math.max(0, CPF.sums.FRS - RA)); RA += toRA; OA += c.sa - toRA; }
    if (MA > CPF.BHS) {                                // MediSave capped at BHS; excess overflows
      const over = MA - CPF.BHS; MA = CPF.BHS;
      if (A < 55) SA += over;                         // <55 → SA
      else { const toRA = Math.min(over, Math.max(0, CPF.sums.FRS - RA)); RA += toRA; OA += over - toRA; }  // 55+ → RA up to FRS, then OA
    }
    OA = Math.max(0, OA - oaDrawMonthly * 12);        // OA used for housing / investment
    sal *= (1 + salaryGrowth); bon *= (1 + salaryGrowth);
    pts.push({ age: A + 1, OA, SA, RA, MA, contrib: c.total, interest: interestYr });
    if (A + 1 === 55) ms.at55 = OA + SA + RA + MA;
    if (A + 1 === 65) { ms.at65 = OA + SA + RA + MA; ms.ra65 = RA; ms.oa65 = OA; ms.ma65 = MA; }
  }
  return { pts, ms, lifeMonthly: cpfLifePayout(ms.ra65 || RA) };
}

function buildCpfChart(pts, W = 560, H = 210) {
  const padL = 48, padR = 12, padY = 12;
  const minA = pts[0].age, maxA = pts[pts.length - 1].age;
  const maxV = Math.max(...pts.map((p) => p.OA + p.SA + p.RA + p.MA), 1) * 1.06;
  const X = (a) => padL + (a - minA) / (maxA - minA) * (W - padL - padR);
  const Y = (v) => H - padY - (v / maxV) * (H - 2 * padY);
  const band = (lo, hi) => {
    const top = pts.map((p, i) => `${i ? "L" : "M"}${X(p.age).toFixed(1)} ${Y(hi(p)).toFixed(1)}`).join(" ");
    const bot = [...pts].reverse().map((p) => `L${X(p.age).toFixed(1)} ${Y(lo(p)).toFixed(1)}`).join(" ");
    return `${top} ${bot} Z`;
  };
  const ret = (p) => p.SA + p.RA;
  const ticks = [0.25, 0.5, 0.75, 1].map((f) => ({ y: Y(maxV * f), v: maxV * f, x1: padL, x2: W - padR }));
  return {
    oaBand: band(() => 0, (p) => p.OA),
    retBand: band((p) => p.OA, (p) => p.OA + ret(p)),
    maBand: band((p) => p.OA + ret(p), (p) => p.OA + ret(p) + p.MA),
    x55: X(55), x65: X(65), baseY: H - padY, topY: padY, padL, labelX: padL - 5, ticks, W, H,
  };
}

/* ============================ helpers ============================ */

const sgd = (n) => "S$" + Math.round(n).toLocaleString("en-SG");
const sgdShort = (n) => {
  if (n >= 1e6) return "S$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "S$" + (n / 1e3).toFixed(0) + "K";
  return "S$" + Math.round(n);
};

function useCountUp(value, ms = 450) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const raf = useRef(0);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplay(value); prev.current = value; return; }
    const from = prev.current, to = value, start = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplay(from + (to - from) * eased);
      if (k < 1) raf.current = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, ms]);
  return display;
}

/* ============================ small components ============================ */

function Field({ label, value, onChange, prefix = "S$", step = 1000, hint = null }) {
  return (
    <label className="field">
      <span className="field-label">{label}{hint && <span className="field-hint">{hint}</span>}</span>
      <span className="field-input">
        <span className="field-prefix">{prefix}</span>
        <input type="number" value={value} step={step} min={0}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} />
      </span>
    </label>
  );
}

function Slider({ label, value, onChange, min, max, step, fmt }) {
  return (
    <label className="slider">
      <span className="slider-top">
        <span className="field-label">{label}</span>
        <span className="num slider-val">{fmt(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function Working({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="working">
      <button className="working-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Info size={13} /> Show the working
        <ChevronDown size={14} className={open ? "rot" : ""} />
      </button>
      {open && <div className="working-body">{children}</div>}
    </div>
  );
}

function AnimNum({ value, render }) {
  const d = useCountUp(value);
  return <>{render(d)}</>;
}

/* ============================ main ============================ */

export default function AffluentApp() {
  const [mode, setMode] = useState("public");

  // protection
  const [income, setIncome] = useState(90000);
  const [incomeYears, setIncomeYears] = useState(10);
  const [debts, setDebts] = useState(20000);
  const [mortgage, setMortgage] = useState(380000);
  const [dependents, setDependents] = useState(1);
  const [existing, setExisting] = useState(200000);
  const [existingCI, setExistingCI] = useState(50000);

  // goal
  const [goalTarget, setGoalTarget] = useState(1000000);
  const [goalYears, setGoalYears] = useState(30);
  const [current, setCurrent] = useState(60000);
  const [growth, setGrowth] = useState(0.05);

  // comparison
  const [ilpPremium, setIlpPremium] = useState(4800);
  const [termPremium, setTermPremium] = useState(700);
  const [ilpFee, setIlpFee] = useState(0.025);
  const [expReturn, setExpReturn] = useState(0.06);

  // CPF (accurate engine)
  const [age, setAge] = useState(33);
  const [salary, setSalary] = useState(7500);
  const [bonus, setBonus] = useState(20000);
  const [oaBal, setOaBal] = useState(45000);
  const [saBal, setSaBal] = useState(30000);
  const [maBal, setMaBal] = useState(28000);
  const [oaDraw, setOaDraw] = useState(1500);
  const [salGrowth, setSalGrowth] = useState(0.03);
  const [desiredIncome, setDesiredIncome] = useState(4500);
  const [invest, setInvest] = useState(80000);

  // budget (monthly)
  const [netIncome, setNetIncome] = useState(6000);
  const [bHousing, setBHousing] = useState(1800);
  const [bFood, setBFood] = useState(900);
  const [bTransport, setBTransport] = useState(400);
  const [bBills, setBBills] = useState(300);
  const [bDependents, setBDependents] = useState(800);
  const [bLoans, setBLoans] = useState(500);
  const [bLifestyle, setBLifestyle] = useState(550);
  const [insPrem, setInsPrem] = useState(450);

  // HI worked example
  const [hiBill, setHiBill] = useState(25000);
  const [hiWard, setHiWard] = useState("B2");

  const educationCost = dependents * 70000;

  const prot = useMemo(() => protectionBreakdown({
    annualIncome: income, incomeYears, existingLife: existing, existingCI, debts, mortgage, educationCost
  }), [income, incomeYears, existing, existingCI, debts, mortgage, educationCost]);

  const goal = useMemo(() => requiredMonthlySaving({
    target: goalTarget, years: goalYears, current, annualReturn: growth
  }), [goalTarget, goalYears, current, growth]);

  const compare = useMemo(() => ilpVsBti({
    years: goalYears, ilpPremium, ilpFee, termPremium, expectedReturn: expReturn
  }), [goalYears, ilpPremium, ilpFee, termPremium, expReturn]);

  const cpfNow = useMemo(() => cpfContribAnnual(salary, bonus, age), [salary, bonus, age]);
  const cpf = useMemo(() => cpfProject({
    age, salary, bonus, salaryGrowth: salGrowth, oa0: oaBal, sa0: saBal, ma0: maBal, oaDrawMonthly: oaDraw, toAge: 70
  }), [age, salary, bonus, salGrowth, oaBal, saBal, maBal, oaDraw]);
  const cpfChart = useMemo(() => buildCpfChart(cpf.pts), [cpf]);
  const floorPct = Math.min(100, (cpf.lifeMonthly / desiredIncome) * 100 || 0);
  const interestYr = oaBal * CPF.iOA + (saBal + maBal) * CPF.iRest +
    (age < 55 ? 0.01 * Math.min(oaBal + saBal + maBal, 60000) : 0);
  const cpfTable = useMemo(() => {
    const rows = [cpf.pts[0]];
    [40, 45, 50, 55, 60, 65, 70].forEach((a) => {
      if (a > age && a <= 70) { const p = cpf.pts.find((q) => q.age === a); if (p) rows.push(p); }
    });
    return rows;
  }, [cpf, age]);

  const expenseTotal = bHousing + bFood + bTransport + bBills + bDependents + bLoans + bLifestyle;
  const bud = useMemo(() => budget({ income: netIncome, expenses: expenseTotal, insurance: insPrem }),
    [netIncome, expenseTotal, insPrem]);
  const insPct = netIncome ? (insPrem / netIncome) * 100 : 0;
  const savePct = netIncome ? (bud.savings / netIncome) * 100 : 0;
  const emFundMonths = expenseTotal + insPrem > 0 ? invest / (expenseTotal + insPrem) : 0;

  const msl = useMemo(() => {
    const ded = hiWard === "C" ? MSL.dedC : hiWard === "A" ? MSL.dedA : MSL.dedB2;
    return { premium: mslPremium(age + 1), ...mslOutOfPocket(hiBill, ded), ded };
  }, [age, hiBill, hiWard]);

  const budgetRows = [
    { k: "Housing / mortgage", v: bHousing, c: "#0F3138" },
    { k: "Food", v: bFood, c: "#2F7F66" },
    { k: "Transport", v: bTransport, c: "#4E8A93" },
    { k: "Bills & utilities", v: bBills, c: "#7AA6A0" },
    { k: "Dependents / childcare", v: bDependents, c: "#C28B4B" },
    { k: "Loans", v: bLoans, c: "#9B5644" },
    { k: "Lifestyle", v: bLifestyle, c: "#B7BDB0" },
    { k: "Insurance", v: insPrem, c: "#DD5C36" },
    { k: "Savings", v: Math.max(0, bud.savings), c: "#1C4D45" },
  ];

  return (
    <div className="affluent">
      <style>{CSS}</style>

      <header className="topbar">
        <div className="brand">
          <CircleDot size={18} className="brand-mark" />
          <span className="brand-name">af.fluent</span>
          <span className="brand-tag">Your money, shown plainly.</span>
        </div>
        <div className="modeswitch" role="tablist" aria-label="Mode">
          <button role="tab" aria-selected={mode === "public"}
            className={mode === "public" ? "on" : ""} onClick={() => setMode("public")}>
            Public education
          </button>
          <button role="tab" aria-selected={mode === "adviser"}
            className={mode === "adviser" ? "on" : ""} onClick={() => setMode("adviser")}>
            <Lock size={12} /> Adviser
          </button>
        </div>
      </header>

      {mode === "public" ? (
        <main className="grid">
          {/* ---------- inputs ---------- */}
          <section className="panel inputs">
            <h2 className="panel-h"><Layers size={15} /> Your picture</h2>
            <p className="panel-sub">Enter what you know. Nothing is stored, and nothing here is a recommendation.</p>
            <Field label="Annual income" value={income} onChange={setIncome} step={5000} />
            <Slider label="Years of income to replace" value={incomeYears} onChange={setIncomeYears} min={0} max={25} step={1} fmt={(v) => `${v} yrs`} />
            <Field label="Outstanding debts" value={debts} onChange={setDebts} step={1000} />
            <Field label="Mortgage outstanding" value={mortgage} onChange={setMortgage} step={10000} />
            <Slider label="Dependents" value={dependents} onChange={setDependents} min={0} max={5} step={1} fmt={(v) => `${v}`} />
            <Field label="Existing life / TPD cover" value={existing} onChange={setExisting} step={10000} />
            <Field label="Existing CI cover" value={existingCI} onChange={setExistingCI} step={10000} />
          </section>

          {/* ---------- readout ---------- */}
          <div className="readout">
            {/* budget snapshot */}
            <section className="panel budget-card">
              <div className="card-eyebrow"><Wallet size={14} /> Your money this month — where it goes</div>
              <div className="bud-top">
                <div className="bud-save">
                  <div className="mid-num"><AnimNum value={Math.max(0, bud.savings)} render={(v) => sgd(v)} /><span className="per">/mo</span></div>
                  <div className="mini-label">left to save &amp; invest after expenses and insurance</div>
                </div>
                <div className="bud-checks">
                  <div className={`chk ${insPct <= 15 ? "ok" : "over"}`}>
                    <span className="chk-v num">{insPct.toFixed(0)}%</span>
                    <span className="chk-l">on insurance<br /><em>guide: ≤15%</em></span>
                  </div>
                  <div className={`chk ${savePct >= 10 ? "ok" : "over"}`}>
                    <span className="chk-v num">{savePct.toFixed(0)}%</span>
                    <span className="chk-l">to savings<br /><em>guide: ≥10%</em></span>
                  </div>
                  <div className={`chk ${emFundMonths >= 3 ? "ok" : "over"}`}>
                    <span className="chk-v num">{emFundMonths.toFixed(1)}×</span>
                    <span className="chk-l">emergency fund<br /><em>guide: 3–6 mths</em></span>
                  </div>
                </div>
              </div>

              <div className="bud-bar">
                {budgetRows.filter((r) => r.v > 0).map((r) => (
                  <div key={r.k} className="bud-seg" style={{ width: `${(r.v / netIncome) * 100}%`, background: r.c }} title={`${r.k}: ${sgd(r.v)}`} />
                ))}
              </div>

              <div className="bud-list">
                {budgetRows.map((r) => (
                  <div key={r.k} className="bud-row">
                    <span className="bud-key"><i style={{ background: r.c }} /> {r.k}</span>
                    <span className="bud-val num">{sgd(r.v)}<em>{netIncome ? ` · ${((r.v / netIncome) * 100).toFixed(0)}%` : ""}</em></span>
                  </div>
                ))}
              </div>

              <Working>
                <div className="bud-inputs">
                  <Field label="Monthly take-home" value={netIncome} onChange={setNetIncome} step={250} />
                  <Field label="Housing / mortgage" value={bHousing} onChange={setBHousing} step={100} />
                  <Field label="Food" value={bFood} onChange={setBFood} step={50} />
                  <Field label="Transport" value={bTransport} onChange={setBTransport} step={50} />
                  <Field label="Bills & utilities" value={bBills} onChange={setBBills} step={50} />
                  <Field label="Dependents / childcare" value={bDependents} onChange={setBDependents} step={50} />
                  <Field label="Loans" value={bLoans} onChange={setBLoans} step={50} />
                  <Field label="Lifestyle" value={bLifestyle} onChange={setBLifestyle} step={50} />
                  <Field label="Insurance premiums" value={insPrem} onChange={setInsPrem} step={50} />
                </div>
                <p className="work-note">Savings is simply what's left: take-home − expenses − insurance. The three checks use the Basic Financial Planning Guide rules of thumb (≤15% insurance, ≥10% savings, 3–6 months of expenses set aside). Guidance, not instructions.</p>
              </Working>
            </section>

            {/* protection breakdown */}
            <section className="panel hero-card">
              <div className="card-eyebrow"><ShieldHalf size={14} /> Protection — how much cover your situation implies</div>
              <table className="prot-table num">
                <thead><tr><th>Risk</th><th>Suggested</th><th>You have</th><th>Gap</th></tr></thead>
                <tbody>
                  {prot.rows.map((r) => (
                    <tr key={r.key}>
                      <td className="pr-risk"><span>{r.key}</span><em>{r.basis}</em></td>
                      <td>{sgdShort(r.need)}</td>
                      <td>{sgdShort(r.have)}</td>
                      <td className="pr-gap">{sgdShort(Math.max(0, r.need - r.have))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="prot-compare num">
                <span>Death cover — your needs estimate <b>{sgdShort(prot.rows[0].need)}</b></span>
                <span className="pc-bench">vs 9× rule of thumb {sgdShort(prot.benchmark9x)}</span>
              </div>
              <div className="prot-extra">
                <div className="pe-item"><b>Hospitalisation (HI)</b><span>Not a lump sum. MediShield Life covers large subsidised-ward bills automatically; an Integrated Shield Plan tops up to your preferred ward, paid from MediSave. Match the tier to the ward you'd actually want.</span></div>
                <div className="pe-item"><b>Personal accident (PA)</b><span>No official benchmark, unlike the above. Optional cover for accidental death/disability and medical reimbursement — sized to preference, not a rule of thumb.</span></div>
              </div>
              <div className="prot-budget">
                <span>Premium budget ceiling</span>
                <span className="num">{sgd(prot.premiumBudget)}/yr<em> · 15% of est. take-home</em></span>
              </div>
              <Working>
                <p className="work-note">Death and TPD use the DIME method on your own numbers — {incomeYears} years of income to replace, plus debts, mortgage, and dependents' education — so the "years of income to replace" slider drives these directly. The Basic Financial Planning Guide's rule of thumb (9× annual income = {sgd(prot.benchmark9x)}) sits alongside as a sanity check; critical illness uses its 4× benchmark (about five years of recovery). These are amounts your situation implies — choosing a plan to deliver them is a separate, regulated step, so compare on compareFIRST or see a planner.</p>
              </Working>
            </section>

            {/* hospitalisation — MediShield Life */}
            <section className="panel">
              <div className="card-eyebrow"><Activity size={14} /> Hospitalisation — what MediShield Life actually covers</div>
              <div className="hi-top">
                <div className="hi-prem">
                  <div className="mid-num"><AnimNum value={msl.premium} render={(v) => sgd(v)} /><span className="per">/yr</span></div>
                  <div className="mini-label">your MediShield Life premium (age {age + 1} next birthday) — paid from MediSave</div>
                </div>
                <div className="hi-facts">
                  <div><span className="hf-l">Deductible ({hiWard})</span><span className="hf-v num">{sgd(msl.ded)}</span></div>
                  <div><span className="hf-l">Co-insurance</span><span className="hf-v num">3–10%</span></div>
                  <div><span className="hf-l">Annual claim limit</span><span className="hf-v num">{sgd(MSL.annualLimit)}</span></div>
                </div>
              </div>

              <div className="hi-example">
                <div className="hi-ex-head">
                  <span>On a hospital bill of</span>
                  <span className="num hi-bill">{sgd(hiBill)}</span>
                </div>
                <Slider label="Adjust the bill" value={hiBill} onChange={setHiBill} min={2000} max={150000} step={1000} fmt={(v) => sgd(v)} />
                <div className="hi-split">
                  <div className="hi-you" style={{ width: `${Math.min(100, (msl.oop / hiBill) * 100)}%` }}><span>you {sgdShort(msl.oop)}</span></div>
                  <div className="hi-msl" style={{ width: `${Math.max(0, 100 - (msl.oop / hiBill) * 100)}%` }}><span>MediShield Life {sgdShort(msl.covered)}</span></div>
                </div>
                <div className="hi-break num">deductible {sgd(msl.dedPart)} + co-insurance {sgd(msl.coins)} = {sgd(msl.oop)} out of pocket</div>
                <div className="hi-ward">Ward:
                  {["C", "B2", "A"].map((w) => (
                    <button key={w} className={hiWard === w ? "on" : ""} onClick={() => setHiWard(w)}>{w === "A" ? "A / private" : `Class ${w}`}</button>
                  ))}
                </div>
              </div>

              <Working>
                <p className="work-note">MediShield Life is automatic and lifelong for all Singaporeans and PRs, sized for subsidised B2/C ward bills; the 2025 enhancements raised the annual claim limit to {sgd(MSL.annualLimit)}. The premiums shown are the actual rates from 1 Oct 2025, fully payable from MediSave. For A-ward or private care you'd add an Integrated Shield Plan — an extra premium (partly MediSave, partly cash). The co-insurance bands modelled here are illustrative; the deductible, the 3–10% range and the limit are the real structure. Verify against the CPF MediShield Life calculator.</p>
              </Working>
              <p className="work-note">This shows what the national scheme covers — factual, not a nudge toward any particular Integrated Shield Plan.</p>
            </section>

            {/* goal */}
            <section className="panel">
              <div className="card-eyebrow"><Target size={14} /> To reach your goal</div>
              <div className="row-between">
                <div>
                  <div className="mid-num"><AnimNum value={goal.pmt} render={(v) => sgd(v)} /><span className="per">/mo</span></div>
                  <div className="mini-label">required saving</div>
                </div>
                <div className="goal-inputs">
                  <Slider label="Target" value={goalTarget} onChange={setGoalTarget} min={100000} max={3000000} step={50000} fmt={sgdShort} />
                  <Slider label="Years" value={goalYears} onChange={setGoalYears} min={5} max={45} step={1} fmt={(v) => `${v}`} />
                  <Slider label="Assumed return" value={growth} onChange={setGrowth} min={0} max={0.1} step={0.005} fmt={(v) => `${(v * 100).toFixed(1)}%`} />
                </div>
              </div>
              <Working>
                <p className="work-note num">Current savings {sgd(current)} grow to {sgd(goal.fvCurrent)} over {goalYears} yrs at {(growth * 100).toFixed(1)}%. Remaining {sgd(goal.remaining)} requires {sgd(goal.pmt)}/mo. Pure compounding math — no product implied.</p>
                <Field label="Current savings" value={current} onChange={setCurrent} step={10000} />
              </Working>
            </section>

            {/* CPF */}
            <section className="panel">
              <div className="card-eyebrow"><Landmark size={14} /> CPF — contributions today and your trajectory to retirement</div>
              <div className="cpf-grid">
                <div className="cpf-inputs">
                  <Slider label="Current age" value={age} onChange={setAge} min={21} max={64} step={1} fmt={(v) => `${v}`} />
                  <Field label="Monthly salary" value={salary} onChange={setSalary} step={500} />
                  <Field label="Annual bonus" value={bonus} onChange={setBonus} step={1000} />
                  <Field label="OA balance" value={oaBal} onChange={setOaBal} step={5000} />
                  <Field label="SA balance" value={saBal} onChange={setSaBal} step={5000} />
                  <Field label="MA balance" value={maBal} onChange={setMaBal} step={5000} />
                  <Field label="OA used / mo" value={oaDraw} onChange={setOaDraw} step={100} hint="housing / invest" />
                  <Slider label="Salary growth" value={salGrowth} onChange={setSalGrowth} min={0} max={0.08} step={0.005} fmt={(v) => (v * 100).toFixed(1) + "%"} />
                </div>

                <div className="cpf-main">
                  <div className="cpf-contrib">
                    <div className="cc-head"><span>This year's CPF contribution</span><span className="num cc-total">{sgd(cpfNow.total)}</span></div>
                    <div className="cc-split">
                      <div className="cc-seg er" style={{ width: `${(cpfNow.employer / cpfNow.total) * 100}%` }}><span>employer {sgdShort(cpfNow.employer)}</span></div>
                      <div className="cc-seg ee" style={{ width: `${(cpfNow.employee / cpfNow.total) * 100}%` }}><span>you {sgdShort(cpfNow.employee)}</span></div>
                    </div>
                    <div className="cc-facts num">
                      <div><span>OW on CPF</span><b>{sgd(cpfNow.owAnnual)}</b></div>
                      <div><span>Bonus on CPF</span><b>{sgd(cpfNow.awSubject)}</b></div>
                      <div><span>Total CPF wages</span><b>{sgd(cpfNow.wages)}{cpfNow.capped ? " ·max" : ""}</b></div>
                      <div><span>Rate (age {age})</span><b>{(cpfNow.rate.total * 100).toFixed(0)}%</b></div>
                    </div>
                    <div className="cc-alloc">
                      <span className="ca oa">OA <b className="num">{sgd(cpfNow.oa)}</b></span>
                      <span className="ca sa">{age < 55 ? "SA" : "RA"} <b className="num">{sgd(cpfNow.sa)}</b></span>
                      <span className="ca ma">MA <b className="num">{sgd(cpfNow.ma)}</b></span>
                    </div>
                    <div className="cc-grow num">Grows this year ≈ <b>{sgd(cpfNow.total)}</b> contributions + <b>{sgd(interestYr)}</b> interest{oaDraw > 0 ? <> − <b>{sgd(oaDraw * 12)}</b> OA drawn</> : null}</div>
                  </div>

                  <svg viewBox={`0 0 ${cpfChart.W} ${cpfChart.H}`} className="cpf-chart">
                    <path d={cpfChart.oaBand} className="b-oa" />
                    <path d={cpfChart.retBand} className="b-ret" />
                    <path d={cpfChart.maBand} className="b-ma" />
                    {cpfChart.ticks.map((t, i) => (
                      <g key={i}>
                        <line x1={t.x1} y1={t.y} x2={t.x2} y2={t.y} className="gridline" />
                        <text x={cpfChart.labelX} y={t.y + 3} className="grid-label">{sgdShort(t.v)}</text>
                      </g>
                    ))}
                    <line x1={cpfChart.x55} y1={cpfChart.topY} x2={cpfChart.x55} y2={cpfChart.baseY} className="marker" />
                    <line x1={cpfChart.x65} y1={cpfChart.topY} x2={cpfChart.x65} y2={cpfChart.baseY} className="marker m65" />
                  </svg>
                  <div className="chart-axis"><span>age {age}</span><span className="ax-mid">55 → 65</span><span>70</span></div>
                  <div className="chart-legend">
                    <span><i className="ck c-oa" /> OA (housing/invest)</span>
                    <span><i className="ck c-ret" /> SA / RA (retirement)</span>
                    <span><i className="ck c-ma" /> MA (health, capped at {sgdShort(CPF.BHS)})</span>
                  </div>
                </div>
              </div>

              <div className="cpf-table-wrap">
                <table className="cpf-table num">
                  <thead><tr><th>Age</th><th>OA</th><th>SA / RA</th><th>MA</th><th>Total</th><th>+ growth</th></tr></thead>
                  <tbody>
                    {cpfTable.map((p, i) => (
                      <tr key={p.age} className={p.age === 55 || p.age === 65 ? "hl" : ""}>
                        <td>{p.age}{p.age === 55 ? " ·SA→RA" : p.age === 65 ? " ·CPF LIFE" : ""}</td>
                        <td>{sgdShort(p.OA)}</td>
                        <td>{sgdShort(p.SA + p.RA)}</td>
                        <td>{sgdShort(p.MA)}</td>
                        <td className="tot">{sgdShort(p.OA + p.SA + p.RA + p.MA)}</td>
                        <td className="dlt">{i === 0 ? "—" : "+" + sgdShort((p.OA + p.SA + p.RA + p.MA) - (cpfTable[i - 1].OA + cpfTable[i - 1].SA + cpfTable[i - 1].RA + cpfTable[i - 1].MA))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="cpf-readout num">
                <div><span className="cr-label">Total CPF at 55</span><span className="cr-val">{cpf.ms.at55 ? sgd(cpf.ms.at55) : "—"}</span></div>
                <div><span className="cr-label">Total CPF at 65</span><span className="cr-val">{cpf.ms.at65 ? sgd(cpf.ms.at65) : "—"}</span></div>
                <div><span className="cr-label">RA at 65 / FRS</span><span className="cr-val">{cpf.ms.ra65 ? sgdShort(cpf.ms.ra65) : "—"} / {sgdShort(CPF.sums.FRS)}</span></div>
                <div><span className="cr-label">CPF LIFE from 65</span><span className="cr-val">{sgd(cpf.lifeMonthly)}/mo</span></div>
              </div>

              <div className="income-block">
                <div className="ib-head"><span>CPF LIFE vs your desired income</span><span className="num">{sgd(desiredIncome)}/mo target</span></div>
                <div className="income-bar">
                  <div className="ib-floor" style={{ width: `${floorPct}%` }} title="CPF LIFE — guaranteed for life" />
                  <div className="ib-gap" style={{ width: `${100 - floorPct}%` }} title="From savings/investments outside CPF" />
                </div>
                <div className="ib-legend">
                  <span><i className="dot floor" /> CPF LIFE covers <b className="num">{sgd(cpf.lifeMonthly)}/mo</b> ({floorPct.toFixed(0)}%) — guaranteed for life</span>
                  <span><i className="dot gap" /> Remaining <b className="num">{sgd(Math.max(0, desiredIncome - cpf.lifeMonthly))}/mo</b> from savings/investments outside CPF</span>
                </div>
                <Slider label="Desired retirement income" value={desiredIncome} onChange={setDesiredIncome} min={1500} max={12000} step={250} fmt={(v) => sgd(v) + "/mo"} />
              </div>

              <Working>
                <p className="work-note">2026 rates: 37% under 55 (17% employer + 20% you), 34% at 55–60, 25% at 60–65 — on Ordinary Wages up to $8,000/mo plus bonus up to the $102,000 annual ceiling, so total CPF wages can't exceed $102,000 (the $37,740 Annual Limit). OA earns 2.5%, SA/RA/MA 4%, plus extra interest on the first $60k/$30k (modeled). MediSave is capped at the Basic Healthcare Sum ({sgdShort(CPF.BHS)}); anything above it overflows to SA/RA. At 55 the SA closes into the RA up to the Full Retirement Sum ({sgd(CPF.sums.FRS)}) — anything above the FRS becomes withdrawable, shown here in OA. The 55+ MediSave/RA split is approximate — verify against the official Jan-2026 allocation table and the CPF LIFE Estimator.</p>
              </Working>
              <p className="work-note">This projects your own numbers if the trend holds — it doesn't tell you to top up, transfer OA to SA, or change anything. Those are your decisions, or a licensed planner's.</p>
            </section>

            {/* balanced comparison */}
            <section className="panel">
              <div className="card-eyebrow"><Scale size={14} /> ILP vs. term + invest the difference</div>
              <div className="vs">
                <div className="vs-col">
                  <div className="vs-name">Investment-linked policy</div>
                  <div className="vs-num num"><AnimNum value={compare.ilpValue} render={(v) => sgdShort(v)} /></div>
                  <div className="vs-sub">bundled · {(ilpFee * 100).toFixed(1)}% annual cost · net {(compare.ilpNet * 100).toFixed(1)}%</div>
                </div>
                <div className="vs-div">vs</div>
                <div className="vs-col">
                  <div className="vs-name">Term + invest difference</div>
                  <div className="vs-num num"><AnimNum value={compare.btiValue} render={(v) => sgdShort(v)} /></div>
                  <div className="vs-sub">unbundled · invests {sgd(compare.diff)}/yr at {(expReturn * 100).toFixed(1)}%</div>
                </div>
              </div>
              <div className="balance">
                <div className="balance-item"><span className="bk">Cost of bundling</span><span className="num bv">{sgd(Math.abs(compare.feeCost))} over {goalYears} yrs</span></div>
                <div className="balance-item warn"><span className="bk">Risk</span><span className="bv">Both carry market risk; neither return is guaranteed.</span></div>
                <div className="balance-item warn"><span className="bk">The assumption</span><span className="bv">Term + invest only works if you actually invest the difference, every year.</span></div>
              </div>
              <div className="compare-controls">
                <Slider label="ILP premium" value={ilpPremium} onChange={setIlpPremium} min={1000} max={12000} step={200} fmt={(v) => sgd(v) + "/yr"} />
                <Slider label="Term premium" value={termPremium} onChange={setTermPremium} min={200} max={4000} step={100} fmt={(v) => sgd(v) + "/yr"} />
                <Slider label="ILP annual cost" value={ilpFee} onChange={setIlpFee} min={0} max={0.05} step={0.0025} fmt={(v) => (v * 100).toFixed(2) + "%"} />
                <Slider label="Expected return" value={expReturn} onChange={setExpReturn} min={0} max={0.1} step={0.005} fmt={(v) => (v * 100).toFixed(1) + "%"} />
              </div>
              <p className="work-note">This is a trade-off, not a verdict. Which structure fits depends on cost sensitivity, your discipline to invest, and how much you value bundling — your call, or a fee-only planner's.</p>
            </section>

            {/* handoff */}
            <section className="panel handoff">
              <div>
                <div className="card-eyebrow light"><ArrowUpRight size={14} /> Where this stops</div>
                <p>Picking a specific plan is advice, not education. For a recommendation tailored to you, see an independent or fee-only planner.</p>
              </div>
              <button className="cta">Find a fee-only planner</button>
            </section>
          </div>
        </main>
      ) : (
        /* ---------- adviser mode (gated) ---------- */
        <main className="adviser">
          <div className="gate">
            <div className="gate-lock"><Lock size={26} /></div>
            <h2>Adviser mode is gated</h2>
            <p>This mode turns on tailored recommendations. Under the Financial Advisers Act, that requires a licensed <strong>appointed representative</strong> — the licence attaches to you, not to this tool. Sign-in here verifies rep status before the recommendation layer activates.</p>
            <button className="cta gate-cta" disabled>Verify representative status</button>
            <div className="unlock">
              <div className="unlock-h">What unlocks once verified</div>
              <ul>
                <li><BadgeCheck size={15} /> Tailored recommendation, with its reasonable-basis linkage</li>
                <li><BadgeCheck size={15} /> Auto-generated suitability record (need ↔ recommendation)</li>
                <li><BadgeCheck size={15} /> Fee &amp; conflict disclosure</li>
                <li><BadgeCheck size={15} /> MAS-style advisory form export (PDF)</li>
                <li><BadgeCheck size={15} /> Immutable audit trail of every recommendation</li>
              </ul>
              <p className="gate-note">Same engine as public mode — only the recommendation last-mile and the compliance scaffolding switch on. The AI's output is input to your judgment, never a substitute for it.</p>
            </div>
          </div>
        </main>
      )}

      <footer className="boundary">
        <span className="boundary-dot" />
        Education, not financial advice. af.fluent computes and compares; it never tells you what to buy. Figures are illustrative estimates on your inputs.
      </footer>
    </div>
  );
}

/* ============================ styles ============================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');

.affluent{
  --paper:#EEEFE8; --ink:#13181A; --muted:#5A6B6D;
  --deep:#0F3138; --deep2:#0A242A; --coral:#DD5C36; --jade:#2F7F66;
  --line:rgba(15,49,56,.14); --card:#F7F8F3;
  background:var(--paper); color:var(--ink);
  font-family:'Inter',system-ui,sans-serif;
  min-height:100%; padding:22px; box-sizing:border-box; -webkit-font-smoothing:antialiased;
}
.affluent *{box-sizing:border-box}
.affluent .num{font-family:'IBM Plex Mono',ui-monospace,Menlo,monospace;font-feature-settings:"tnum"1;}

.affluent .topbar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;margin-bottom:20px;}
.affluent .brand{display:flex;align-items:center;gap:10px;}
.affluent .brand-mark{color:var(--coral)}
.affluent .brand-name{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:22px;letter-spacing:-.02em;}
.affluent .brand-tag{color:var(--muted);font-size:13px;border-left:1px solid var(--line);padding-left:10px;}
.affluent .modeswitch{display:flex;background:var(--card);border:1px solid var(--line);border-radius:999px;padding:3px;}
.affluent .modeswitch button{border:0;background:transparent;color:var(--muted);font:inherit;font-size:13px;font-weight:500;padding:7px 15px;border-radius:999px;cursor:pointer;display:flex;align-items:center;gap:5px;}
.affluent .modeswitch button.on{background:var(--deep);color:var(--paper);}
.affluent .modeswitch button:focus-visible{outline:2px solid var(--coral);outline-offset:2px;}

.affluent .grid{display:grid;grid-template-columns:300px 1fr;gap:18px;align-items:start;}
.affluent .readout{display:flex;flex-direction:column;gap:18px;}
@media(max-width:820px){.affluent .grid{grid-template-columns:1fr;}}

.affluent .panel{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;}
.affluent .panel-h{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700;margin:0 0 4px;display:flex;align-items:center;gap:7px;}
.affluent .panel-sub{color:var(--muted);font-size:12.5px;margin:0 0 16px;line-height:1.5;}
.affluent .card-eyebrow{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--deep);margin-bottom:12px;}
.affluent .card-eyebrow.light{color:var(--paper);opacity:.85;}

.affluent .field{display:block;margin-bottom:14px;}
.affluent .field-label{display:flex;justify-content:space-between;font-size:12.5px;font-weight:500;color:var(--ink);margin-bottom:6px;}
.affluent .field-hint{color:var(--muted);font-weight:400;}
.affluent .field-input{display:flex;align-items:center;border:1px solid var(--line);border-radius:9px;background:var(--paper);overflow:hidden;}
.affluent .field-prefix{padding:0 0 0 11px;color:var(--muted);font-size:13px;}
.affluent .field-input input{flex:1;border:0;background:transparent;padding:9px 11px;font:inherit;font-family:'IBM Plex Mono',monospace;font-size:14px;color:var(--ink);width:100%;}
.affluent .field-input input:focus{outline:none;}
.affluent .field-input:focus-within{border-color:var(--deep);box-shadow:0 0 0 3px rgba(15,49,56,.1);}

.affluent .slider{display:block;margin-bottom:13px;}
.affluent .slider-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;}
.affluent .slider-val{font-size:13px;color:var(--deep);font-weight:600;}
.affluent .slider input[type=range]{width:100%;-webkit-appearance:none;appearance:none;height:4px;background:var(--line);border-radius:4px;outline:none;}
.affluent .slider input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--coral);cursor:pointer;border:2px solid var(--card);box-shadow:0 0 0 1px var(--coral);}
.affluent .slider input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--coral);cursor:pointer;border:2px solid var(--card);}
.affluent .slider input:focus-visible{box-shadow:0 0 0 3px rgba(221,92,54,.3);}

.affluent .hero-card{background:var(--deep);color:var(--paper);border-color:var(--deep);}
.affluent .hero-card .card-eyebrow{color:var(--paper);opacity:.9;}
.affluent .big-num{font-family:'IBM Plex Mono',monospace;font-size:46px;font-weight:600;letter-spacing:-.02em;line-height:1;margin-bottom:16px;}
.affluent .gapbar{height:8px;background:rgba(255,255,255,.16);border-radius:6px;overflow:hidden;}
.affluent .gapbar-fill{height:100%;background:var(--coral);border-radius:6px;transition:width .5s cubic-bezier(.2,.7,.2,1);}
.affluent .gapbar-legend{display:flex;justify-content:space-between;font-size:11.5px;opacity:.8;margin-top:7px;font-family:'IBM Plex Mono',monospace;}

.affluent .prot-table{width:100%;border-collapse:collapse;}
.affluent .prot-table th{text-align:right;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;font-weight:600;opacity:.65;padding:0 0 9px;font-family:'Inter',sans-serif;}
.affluent .prot-table th:first-child{text-align:left;}
.affluent .prot-table td{padding:9px 0;font-size:14px;text-align:right;border-top:1px solid rgba(255,255,255,.14);}
.affluent .prot-table td:first-child{text-align:left;}
.affluent .pr-risk span{display:block;font-size:13px;}
.affluent .pr-risk em{font-style:normal;font-size:11px;opacity:.55;font-family:'Inter',sans-serif;}
.affluent .pr-gap{color:#FFB59B;font-weight:600;}
.affluent .prot-compare{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap;margin-top:12px;padding-top:11px;border-top:1px solid rgba(255,255,255,.14);font-size:12.5px;}
.affluent .prot-compare b{font-weight:600;}
.affluent .prot-compare .pc-bench{opacity:.6;font-size:11.5px;}
.affluent .prot-extra{display:flex;flex-direction:column;gap:11px;margin-top:18px;}
.affluent .pe-item{font-size:12px;line-height:1.5;border-left:2px solid rgba(255,255,255,.25);padding-left:11px;}
.affluent .pe-item b{display:block;font-size:12.5px;margin-bottom:2px;}
.affluent .pe-item span{opacity:.72;}
.affluent .prot-budget{display:flex;justify-content:space-between;align-items:baseline;margin-top:16px;padding-top:13px;border-top:1px solid rgba(255,255,255,.14);font-size:13px;font-weight:600;}
.affluent .prot-budget em{font-style:normal;font-weight:400;opacity:.6;font-size:11px;}

.affluent .bud-top{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px;}
.affluent .bud-save{min-width:180px;}
.affluent .bud-checks{display:flex;gap:8px;flex-wrap:wrap;}
.affluent .chk{display:flex;gap:8px;align-items:center;background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:8px 11px;}
.affluent .chk-v{font-size:18px;font-weight:600;}
.affluent .chk-l{font-size:10.5px;color:var(--muted);line-height:1.25;}
.affluent .chk-l em{font-style:normal;opacity:.85;}
.affluent .chk.ok .chk-v{color:var(--jade);}
.affluent .chk.over .chk-v{color:var(--coral);}
.affluent .bud-bar{display:flex;height:22px;border-radius:7px;overflow:hidden;border:1px solid var(--line);margin-bottom:14px;}
.affluent .bud-seg{transition:width .45s cubic-bezier(.2,.7,.2,1);min-width:1px;}
.affluent .bud-list{display:grid;grid-template-columns:1fr 1fr;gap:5px 18px;}
@media(max-width:520px){.affluent .bud-list{grid-template-columns:1fr;}}
.affluent .bud-row{display:flex;justify-content:space-between;font-size:12.5px;padding:3px 0;}
.affluent .bud-key{display:flex;align-items:center;gap:8px;color:var(--ink);}
.affluent .bud-key i{width:9px;height:9px;border-radius:2px;display:inline-block;flex-shrink:0;}
.affluent .bud-val{color:var(--muted);}
.affluent .bud-val em{font-style:normal;opacity:.7;}
.affluent .bud-inputs{display:grid;grid-template-columns:1fr 1fr;gap:2px 16px;margin-bottom:6px;}
@media(max-width:520px){.affluent .bud-inputs{grid-template-columns:1fr;}}

.affluent .hi-top{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px;}
.affluent .hi-prem{min-width:200px;}
.affluent .hi-facts{display:flex;flex-direction:column;gap:6px;min-width:180px;}
.affluent .hi-facts>div{display:flex;justify-content:space-between;gap:16px;font-size:12.5px;border-bottom:1px solid var(--line);padding-bottom:5px;}
.affluent .hf-l{color:var(--muted);}
.affluent .hf-v{font-weight:600;color:var(--deep);}
.affluent .hi-example{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:14px;}
.affluent .hi-ex-head{display:flex;justify-content:space-between;align-items:baseline;font-size:12.5px;color:var(--muted);margin-bottom:6px;}
.affluent .hi-bill{font-size:17px;color:var(--ink);font-weight:600;}
.affluent .hi-split{display:flex;height:26px;border-radius:8px;overflow:hidden;border:1px solid var(--line);margin-top:6px;}
.affluent .hi-you{background:var(--coral);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;white-space:nowrap;transition:width .45s cubic-bezier(.2,.7,.2,1);min-width:fit-content;padding:0 7px;}
.affluent .hi-msl{background:var(--jade);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;white-space:nowrap;transition:width .45s;min-width:fit-content;padding:0 7px;}
.affluent .hi-break{font-size:11.5px;color:var(--muted);margin-top:9px;}
.affluent .hi-ward{display:flex;align-items:center;gap:6px;margin-top:12px;font-size:12px;color:var(--muted);flex-wrap:wrap;}
.affluent .hi-ward button{border:1px solid var(--line);background:var(--card);border-radius:7px;padding:5px 10px;font:inherit;font-size:12px;cursor:pointer;color:var(--ink);}
.affluent .hi-ward button.on{background:var(--deep);color:var(--paper);border-color:var(--deep);}

.affluent .mid-num{font-family:'IBM Plex Mono',monospace;font-size:34px;font-weight:600;letter-spacing:-.02em;}
.affluent .per{font-size:16px;color:var(--muted);margin-left:3px;}
.affluent .mini-label{font-size:12px;color:var(--muted);margin-top:2px;}
.affluent .row-between{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;flex-wrap:wrap;}
.affluent .goal-inputs{flex:1;min-width:200px;}

.affluent .working{margin-top:14px;border-top:1px solid var(--line);padding-top:10px;}
.affluent .hero-card .working{border-color:rgba(255,255,255,.18);}
.affluent .working-toggle{display:flex;align-items:center;gap:6px;background:none;border:0;cursor:pointer;font:inherit;font-size:12px;color:inherit;opacity:.8;padding:0;}
.affluent .working-toggle .rot{transform:rotate(180deg);}
.affluent .working-body{margin-top:11px;font-size:12.5px;}
.affluent .work-table{width:100%;border-collapse:collapse;font-size:12.5px;}
.affluent .work-table td{padding:4px 0;}
.affluent .work-table td:last-child{text-align:right;}
.affluent .work-table .sum td{border-top:1px solid var(--line);font-weight:600;padding-top:6px;}
.affluent .hero-card .work-table .sum td{border-color:rgba(255,255,255,.2);}
.affluent .work-table .coral-row td{color:var(--coral);}
.affluent .hero-card .coral-row td{color:#FFB59B;}
.affluent .work-note{color:var(--muted);font-size:12px;line-height:1.55;margin:10px 0 0;}
.affluent .hero-card .work-note{color:rgba(255,255,255,.7);}

.affluent .cpf-grid{display:grid;grid-template-columns:230px 1fr;gap:22px;align-items:start;}
@media(max-width:680px){.affluent .cpf-grid{grid-template-columns:1fr;}}
.affluent .cpf-main{min-width:0;}
.affluent .cpf-contrib{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:14px;margin-bottom:14px;}
.affluent .cc-head{display:flex;justify-content:space-between;align-items:baseline;font-size:12.5px;font-weight:600;margin-bottom:9px;}
.affluent .cc-total{font-size:19px;color:var(--deep);}
.affluent .cc-split{display:flex;height:24px;border-radius:7px;overflow:hidden;border:1px solid var(--line);margin-bottom:12px;}
.affluent .cc-seg{display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;white-space:nowrap;min-width:fit-content;padding:0 7px;}
.affluent .cc-seg.er{background:var(--deep);}
.affluent .cc-seg.ee{background:var(--jade);}
.affluent .cc-facts{display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;margin-bottom:12px;}
.affluent .cc-facts>div{display:flex;justify-content:space-between;gap:10px;font-size:12px;border-bottom:1px solid var(--line);padding-bottom:4px;}
.affluent .cc-facts span{color:var(--muted);}
.affluent .cc-facts b{color:var(--ink);font-weight:600;}
.affluent .cc-alloc{display:flex;gap:8px;flex-wrap:wrap;}
.affluent .ca{flex:1;min-width:90px;font-size:11px;color:var(--muted);border-radius:8px;padding:8px 10px;border:1px solid var(--line);border-left-width:3px;}
.affluent .ca b{display:block;font-size:14px;color:var(--ink);margin-top:2px;}
.affluent .ca.oa{border-left-color:var(--deep);}
.affluent .ca.sa{border-left-color:var(--jade);}
.affluent .ca.ma{border-left-color:#C28B4B;}
.affluent .cpf-chart{width:100%;height:auto;display:block;overflow:visible;}
.affluent .b-oa{fill:var(--deep);opacity:.85;}
.affluent .b-ret{fill:var(--jade);opacity:.85;}
.affluent .b-ma{fill:#C28B4B;opacity:.8;}
.affluent .marker{stroke:rgba(255,255,255,.55);stroke-width:1;stroke-dasharray:3 3;}
.affluent .marker.m65{stroke:#fff;}
.affluent .chart-axis{display:flex;justify-content:space-between;font-size:11px;color:var(--muted);font-family:'IBM Plex Mono',monospace;margin-top:4px;}
.affluent .chart-axis .ax-mid{color:var(--deep);}
.affluent .chart-legend{display:flex;align-items:center;gap:14px;font-size:11.5px;color:var(--muted);margin-top:8px;flex-wrap:wrap;}
.affluent .chart-legend .ck{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px;}
.affluent .chart-legend .ck.c-oa{background:var(--deep);}
.affluent .chart-legend .ck.c-ret{background:var(--jade);}
.affluent .chart-legend .ck.c-ma{background:#C28B4B;}
.affluent .cc-grow{margin-top:11px;padding-top:10px;border-top:1px solid var(--line);font-size:11.5px;color:var(--muted);line-height:1.5;}
.affluent .cc-grow b{color:var(--ink);font-weight:600;}
.affluent .gridline{stroke:rgba(255,255,255,.30);stroke-width:1;stroke-dasharray:2 3;}
.affluent .grid-label{fill:var(--muted);font-size:9px;font-family:'IBM Plex Mono',monospace;text-anchor:end;}
.affluent .cpf-table-wrap{margin-top:16px;overflow-x:auto;}
.affluent .cpf-table{width:100%;border-collapse:collapse;font-size:12px;}
.affluent .cpf-table th{text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);font-weight:600;padding:0 8px 7px 0;font-family:'Inter',sans-serif;}
.affluent .cpf-table th:first-child{text-align:left;}
.affluent .cpf-table td{text-align:right;padding:6px 8px 6px 0;border-top:1px solid var(--line);color:var(--muted);white-space:nowrap;}
.affluent .cpf-table td:first-child{text-align:left;color:var(--ink);}
.affluent .cpf-table td.tot{color:var(--deep);font-weight:600;}
.affluent .cpf-table td.dlt{color:var(--jade);}
.affluent .cpf-table tr.hl td{background:rgba(15,49,56,.05);}
.affluent .cpf-table tr.hl td:first-child{font-weight:600;color:var(--deep);}

.affluent .income-block{margin-top:18px;}
.affluent .ib-head{display:flex;justify-content:space-between;font-size:12.5px;font-weight:600;margin-bottom:8px;}
.affluent .income-bar{display:flex;height:26px;border-radius:8px;overflow:hidden;border:1px solid var(--line);}
.affluent .ib-floor{background:var(--jade);transition:width .5s cubic-bezier(.2,.7,.2,1);}
.affluent .ib-gap{background:repeating-linear-gradient(45deg,rgba(221,92,54,.85),rgba(221,92,54,.85) 6px,rgba(221,92,54,.65) 6px,rgba(221,92,54,.65) 12px);transition:width .5s cubic-bezier(.2,.7,.2,1);}
.affluent .ib-legend{display:flex;flex-direction:column;gap:5px;margin-top:10px;font-size:12px;color:var(--muted);}
.affluent .ib-legend b{color:var(--ink);font-weight:600;}
.affluent .ib-legend .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:7px;vertical-align:0;}
.affluent .ib-legend .dot.floor{background:var(--jade);}
.affluent .ib-legend .dot.gap{background:var(--coral);}

.affluent .cpf-readout{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px;}
.affluent .cpf-readout>div{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:11px 13px;}
.affluent .cr-label{display:block;font-size:11px;color:var(--muted);margin-bottom:5px;font-family:'Inter',sans-serif;}
.affluent .cr-val{font-size:17px;font-weight:600;color:var(--deep);}
@media(max-width:520px){.affluent .cpf-readout{grid-template-columns:1fr;}}

.affluent .vs{display:flex;align-items:stretch;gap:12px;margin-bottom:16px;}
.affluent .vs-col{flex:1;border:1px solid var(--line);border-radius:11px;padding:14px;background:var(--paper);}
.affluent .vs-name{font-size:12px;font-weight:600;color:var(--muted);margin-bottom:7px;}
.affluent .vs-num{font-size:26px;font-weight:600;letter-spacing:-.02em;}
.affluent .vs-sub{font-size:11.5px;color:var(--muted);margin-top:5px;line-height:1.4;}
.affluent .vs-div{align-self:center;font-size:12px;color:var(--muted);font-style:italic;}
.affluent .balance{display:flex;flex-direction:column;gap:9px;margin-bottom:16px;}
.affluent .balance-item{display:flex;justify-content:space-between;gap:14px;font-size:12.5px;padding:9px 12px;border-radius:9px;background:var(--paper);border:1px solid var(--line);}
.affluent .balance-item .bk{font-weight:600;white-space:nowrap;}
.affluent .balance-item .bv{text-align:right;color:var(--muted);}
.affluent .balance-item.warn{border-left:2px solid var(--coral);}
.affluent .compare-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px 18px;padding-top:6px;border-top:1px solid var(--line);margin-top:4px;}
@media(max-width:520px){.affluent .compare-controls{grid-template-columns:1fr;}.affluent .vs{flex-direction:column;}}

.affluent .handoff{background:var(--deep2);color:var(--paper);border-color:var(--deep2);display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap;}
.affluent .handoff p{margin:0;font-size:13px;line-height:1.5;max-width:420px;opacity:.9;}
.affluent .cta{background:var(--coral);color:#fff;border:0;border-radius:10px;padding:11px 18px;font:inherit;font-weight:600;font-size:13px;cursor:pointer;white-space:nowrap;}
.affluent .cta:hover{filter:brightness(1.06);}
.affluent .cta:focus-visible{outline:2px solid #fff;outline-offset:2px;}

.affluent .adviser{display:flex;justify-content:center;padding:30px 0;}
.affluent .gate{max-width:520px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:34px;text-align:center;}
.affluent .gate-lock{width:54px;height:54px;border-radius:50%;background:var(--deep);color:var(--paper);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
.affluent .gate h2{font-family:'Space Grotesk',sans-serif;font-size:21px;margin:0 0 10px;}
.affluent .gate>p{color:var(--muted);font-size:13.5px;line-height:1.6;margin:0 auto 18px;max-width:430px;}
.affluent .gate-cta{margin-bottom:24px;opacity:.55;cursor:not-allowed;}
.affluent .unlock{text-align:left;background:var(--paper);border:1px solid var(--line);border-radius:13px;padding:18px;}
.affluent .unlock-h{font-size:11.5px;text-transform:uppercase;letter-spacing:.07em;font-weight:600;color:var(--deep);margin-bottom:12px;}
.affluent .unlock ul{list-style:none;padding:0;margin:0 0 14px;display:flex;flex-direction:column;gap:9px;}
.affluent .unlock li{display:flex;align-items:center;gap:9px;font-size:13px;}
.affluent .unlock li svg{color:var(--jade);flex-shrink:0;}
.affluent .gate-note{font-size:12px;color:var(--muted);line-height:1.55;margin:0;}

.affluent .boundary{display:flex;align-items:center;gap:9px;justify-content:center;margin-top:22px;font-size:12px;color:var(--muted);text-align:center;line-height:1.5;}
.affluent .boundary-dot{width:7px;height:7px;border-radius:50%;background:var(--jade);flex-shrink:0;}
`;
