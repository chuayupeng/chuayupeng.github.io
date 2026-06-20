/* ============================================================================
   Retirement engine — the prescriptive core.
   Month-by-month simulation of (1) accumulation from now to retirement and
   (2) drawdown from retirement to life expectancy, with CPF LIFE as a level
   nominal income floor from 65. Solvers answer:
     • exactly how much to invest each month to fund the plan, and
     • what income the current plan actually supports / when money runs out.
   All figures nominal unless deflated for "today's dollars" display.
   ========================================================================== */

export interface RetireParams {
  age: number;
  retireAge: number;
  life: number;
  startPortfolio: number;        // investable assets earmarked for retirement
  desiredMonthlyToday: number;   // target income in today's dollars
  inflation: number;
  returnPre: number;             // nominal return while accumulating
  returnPost: number;            // nominal return in drawdown
  cpfLifeMonthly: number;        // CPF LIFE payout from cpfLifeStartAge (nominal, level)
  cpfLifeStartAge?: number;      // default 65
}

export interface YearPoint {
  age: number;
  balance: number;
  phase: "accum" | "draw";
  realBalance: number;           // deflated to today's dollars
  cpfLife: number;               // monthly CPF LIFE active at this age (nominal)
}

export interface SimResult {
  points: YearPoint[];
  nestEgg: number;               // portfolio balance at retirement (nominal)
  nestEggReal: number;           // ... in today's dollars
  depletionAge: number | null;   // age portfolio hits zero, or null if it lasts
  endingBalance: number;         // balance at life expectancy (legacy), nominal
  endingBalanceReal: number;
  firstGapMonthly: number;       // nominal monthly amount drawn from portfolio at retirement
}

const monthlyRate = (annual: number) => Math.pow(1 + annual, 1 / 12) - 1;

/** Simulate the full life path for a given level monthly contribution. */
export function simulate(p: RetireParams, monthlyContribution: number): SimResult {
  const cpfStart = p.cpfLifeStartAge ?? 65;
  const rPre = monthlyRate(p.returnPre);
  const rPost = monthlyRate(p.returnPost);
  const points: YearPoint[] = [];
  let balance = p.startPortfolio;
  let depletionAge: number | null = null;
  let nestEgg = p.startPortfolio;
  let firstGapMonthly = 0;
  let firstGapSeen = false;

  const totalYears = Math.max(0, p.life - p.age);
  const deflate = (nominal: number, yearsFromNow: number) =>
    nominal / Math.pow(1 + p.inflation, yearsFromNow);

  points.push({ age: p.age, balance, phase: "accum", realBalance: balance, cpfLife: 0 });

  for (let y = 0; y < totalYears; y++) {
    const yearStartAge = p.age + y;
    const accumulating = yearStartAge < p.retireAge;
    // inflate today's desired income to this calendar year
    const needMonthly = p.desiredMonthlyToday * Math.pow(1 + p.inflation, y);

    for (let m = 0; m < 12; m++) {
      if (accumulating) {
        balance = balance * (1 + rPre) + monthlyContribution;
      } else {
        const cpfActive = yearStartAge >= cpfStart ? p.cpfLifeMonthly : 0;
        const gap = Math.max(0, needMonthly - cpfActive);
        if (!firstGapSeen) { firstGapMonthly = gap; firstGapSeen = true; }
        balance = balance * (1 + rPost) - gap;
        if (balance <= 0 && depletionAge === null) {
          balance = 0;
          depletionAge = yearStartAge + m / 12;
        }
      }
    }

    const age = yearStartAge + 1;
    if (age === p.retireAge) nestEgg = balance;
    points.push({
      age,
      balance: Math.max(0, balance),
      phase: age <= p.retireAge ? "accum" : "draw",
      realBalance: deflate(Math.max(0, balance), y + 1),
      cpfLife: age >= cpfStart ? p.cpfLifeMonthly : 0,
    });
  }

  // if retireAge == age (already retired), nestEgg stays startPortfolio
  if (p.retireAge <= p.age) nestEgg = p.startPortfolio;
  const yearsToRetire = Math.max(0, p.retireAge - p.age);

  return {
    points,
    nestEgg,
    nestEggReal: nestEgg / Math.pow(1 + p.inflation, yearsToRetire),
    depletionAge,
    endingBalance: balance,
    endingBalanceReal: balance / Math.pow(1 + p.inflation, totalYears),
    firstGapMonthly,
  };
}

/** Binary-search the minimum level monthly contribution that lasts to life expectancy. */
export function solveRequiredContribution(p: RetireParams): { monthly: number; sim: SimResult; alreadyOnTrack: boolean } {
  const zero = simulate(p, 0);
  if (zero.depletionAge === null) {
    return { monthly: 0, sim: zero, alreadyOnTrack: true };
  }
  let lo = 0, hi = Math.max(2000, p.desiredMonthlyToday * 6);
  // expand hi until it lasts (guard against extreme inputs)
  let guard = 0;
  while (simulate(p, hi).depletionAge !== null && guard < 40) { hi *= 1.6; guard++; }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (simulate(p, mid).depletionAge === null) hi = mid; else lo = mid;
  }
  return { monthly: hi, sim: simulate(p, hi), alreadyOnTrack: false };
}

/** Given a fixed monthly contribution, what income (today's $) does the plan sustain to life expectancy? */
export function solveSustainableIncome(p: RetireParams, monthlyContribution: number): number {
  let lo = 0, hi = Math.max(2000, p.desiredMonthlyToday * 4);
  let guard = 0;
  while (simulate({ ...p, desiredMonthlyToday: hi }, monthlyContribution).depletionAge === null && guard < 40) {
    hi *= 1.5; guard++;
  }
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (simulate({ ...p, desiredMonthlyToday: mid }, monthlyContribution).depletionAge === null) lo = mid;
    else hi = mid;
  }
  return lo;
}

export interface RetireAnalysis {
  required: { monthly: number; sim: SimResult; alreadyOnTrack: boolean };
  current: { monthly: number; sim: SimResult; sustainableIncomeToday: number };
  gapMonthly: number;            // required − current contribution (0 if on track)
  onTrack: boolean;              // current contribution already funds the plan
  fundedPct: number;             // current nest egg vs required nest egg
}

/** Bundle the "what's required" vs "what your current plan does" comparison. */
export function analyzeRetirement(p: RetireParams, currentMonthlyContribution: number): RetireAnalysis {
  const required = solveRequiredContribution(p);
  const currentSim = simulate(p, currentMonthlyContribution);
  const sustainable = solveSustainableIncome(p, currentMonthlyContribution);
  const gapMonthly = Math.max(0, required.monthly - currentMonthlyContribution);
  const fundedPct = required.sim.nestEgg > 0 ? currentSim.nestEgg / required.sim.nestEgg : 1;
  return {
    required,
    current: { monthly: currentMonthlyContribution, sim: currentSim, sustainableIncomeToday: sustainable },
    gapMonthly,
    onTrack: currentSim.depletionAge === null,   // current plan actually lasts to life expectancy
    fundedPct: Math.min(2, fundedPct),
  };
}
