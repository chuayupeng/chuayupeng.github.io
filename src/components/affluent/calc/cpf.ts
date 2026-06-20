/* ============================================================================
   CPF engine — 2026 figures, year-by-year projection to retirement.
   Sources: CPF Board contribution/allocation tables effective 1 Jan 2026,
   Basic Healthcare Sum 2026, Retirement Sums for the cohort turning 55 in 2026,
   CPF interest floors. Under-55 figures are exact; the 55+ MA/RA allocation
   split is modelled and flagged in the UI as "verify against the official table".
   ========================================================================== */

export const CPF = {
  owCeilingMonthly: 8000,        // Ordinary Wage ceiling, 2026
  annualSalaryCeiling: 102000,   // caps OW + AW subject to CPF for the year
  annualLimit: 37740,            // 37% × 102,000
  BHS: 79000,                    // Basic Healthcare Sum 2026 (MA cap)
  iOA: 0.025, iRest: 0.04,       // OA 2.5%; SA/MA/RA 4% floor
  sums: { BRS: 110200, FRS: 220400, ERS: 440800 },  // cohort turning 55 in 2026
  life: { BRS: 950, FRS: 1780, ERS: 3440 },         // est. CPF LIFE Standard /mo from 65
  // total / employer / employee contribution rate by age band
  rates: [
    { upTo: 55, total: 0.37, er: 0.17, ee: 0.20 },
    { upTo: 60, total: 0.34, er: 0.16, ee: 0.18 },
    { upTo: 65, total: 0.25, er: 0.125, ee: 0.125 },
    { upTo: 70, total: 0.165, er: 0.09, ee: 0.075 },
    { upTo: 999, total: 0.125, er: 0.075, ee: 0.05 },
  ],
  // allocation as % of WAGE → OA / SA(or RA) / MA; each row sums to that band's total
  alloc: [
    { upTo: 35, oa: 0.23, sa: 0.06, ma: 0.08 },
    { upTo: 45, oa: 0.21, sa: 0.07, ma: 0.09 },
    { upTo: 50, oa: 0.19, sa: 0.08, ma: 0.10 },
    { upTo: 55, oa: 0.15, sa: 0.115, ma: 0.105 },
    { upTo: 60, oa: 0.12, sa: 0.115, ma: 0.105 },
    { upTo: 65, oa: 0.035, sa: 0.11, ma: 0.105 },
    { upTo: 70, oa: 0.01, sa: 0.05, ma: 0.105 },
    { upTo: 999, oa: 0.01, sa: 0.01, ma: 0.105 },   // >70: OA 1% / RA 1% / MA 10.5% (verified vs 1 Jan 2026 table)
  ],
};

const pick = <T extends { upTo: number }>(arr: T[], age: number): T =>
  arr.find((x) => age < x.upTo) || arr[arr.length - 1];

export interface CpfContribYear {
  owAnnual: number; awSubject: number; awCeiling: number; wages: number;
  total: number; employer: number; employee: number;
  oa: number; sa: number; ma: number;
  rate: { upTo: number; total: number; er: number; ee: number };
  capped: boolean;
}

/** One year's contribution from monthly salary + annual bonus, respecting ceilings. */
export function cpfContribAnnual(monthlySalary: number, annualBonus: number, age: number): CpfContribYear {
  const owAnnual = Math.min(monthlySalary, CPF.owCeilingMonthly) * 12;
  const awCeiling = Math.max(0, CPF.annualSalaryCeiling - owAnnual);
  const awSubject = Math.min(annualBonus, awCeiling);
  const wages = owAnnual + awSubject;
  const r = pick(CPF.rates, age);
  const a = pick(CPF.alloc, age);
  return {
    owAnnual, awSubject, awCeiling, wages,
    total: wages * r.total, employer: wages * r.er, employee: wages * r.ee,
    oa: wages * a.oa, sa: wages * a.sa, ma: wages * a.ma,
    rate: r, capped: wages >= CPF.annualSalaryCeiling - 1,
  };
}

/** Monthly employee CPF deduction from this month's salary (for take-home). */
export function cpfEmployeeMonthly(monthlySalary: number, age: number): number {
  const ow = Math.min(monthlySalary, CPF.owCeilingMonthly);
  return ow * pick(CPF.rates, age).ee;
}

export function cpfLifePayout(ra: number): number {
  const { BRS, FRS, ERS } = CPF.sums, L = CPF.life;
  if (ra <= 0) return 0;
  if (ra < BRS) return L.BRS * (ra / BRS);
  if (ra < FRS) return L.BRS + (L.FRS - L.BRS) * (ra - BRS) / (FRS - BRS);
  if (ra < ERS) return L.FRS + (L.ERS - L.FRS) * (ra - FRS) / (ERS - FRS);
  return L.ERS;
}

export interface CpfPoint { age: number; OA: number; SA: number; RA: number; MA: number; contrib?: number; interest?: number; }
export interface CpfProjection {
  pts: CpfPoint[];
  ms: { at55?: number; at65?: number; ra65?: number; oa65?: number; ma65?: number };
  lifeMonthly: number;
}

export interface CpfProjectArgs {
  age: number; salary: number; bonus: number; salaryGrowth: number;
  oa0: number; sa0: number; ma0: number; ra0?: number;
  oaDrawMonthly: number; annualTopUp?: number; toAge?: number;
  retireAge?: number;   // employment CPF contributions stop at this age
}

const closeSaToRa = (SA: number, RA: number, OA: number) => {
  const toRA = Math.min(SA, Math.max(0, CPF.sums.FRS - RA));   // RA up to FRS, excess spills to OA
  return { RA: RA + toRA, OA: OA + (SA - toRA), SA: 0 };
};

/** Year-by-year projection with OA drawdown, BHS overflow, SA→RA at 55, extra interest. */
export function cpfProject(a: CpfProjectArgs): CpfProjection {
  const toAge = a.toAge ?? 70;
  const retireAge = a.retireAge ?? 200;
  let A = a.age, OA = a.oa0, SA = a.sa0, MA = a.ma0, RA = a.ra0 ?? 0;
  let sal = a.salary, bon = a.bonus;
  const topUp = a.annualTopUp ?? 0;

  // members already 55+ have had their SA closed into the RA
  if (A >= 55 && SA > 0) ({ SA, RA, OA } = closeSaToRa(SA, RA, OA));

  const pts: CpfPoint[] = [{ age: A, OA, SA, RA, MA }];
  const ms: CpfProjection["ms"] = {};

  for (; A < toAge; A++) {
    const rowAge = A + 1;   // this iteration produces the balances at rowAge

    // base interest on start-of-year (principal) balances
    const oaP = OA, saP = SA, maP = MA, raP = RA;
    const beforeInt = oaP + saP + maP + raP;
    OA *= (1 + CPF.iOA); SA *= (1 + CPF.iRest); MA *= (1 + CPF.iRest); RA *= (1 + CPF.iRest);
    // Extra interest: +1% on the first $60k of combined balances (under 55), or +2%/+1% on the
    // first/next $30k (55+) — but only the first $20k of OA counts toward it. Earned on principal.
    const extraBase = Math.min(oaP, 20000) + saP + maP + raP;
    const extra = A < 55
      ? 0.01 * Math.min(extraBase, 60000)
      : 0.02 * Math.min(extraBase, 30000) + 0.01 * Math.min(Math.max(0, extraBase - 30000), 30000);
    if (A < 55) SA += extra; else RA += extra;
    const interestYr = OA + SA + MA + RA - beforeInt;

    // employment contributions only while still working
    let contribTotal = 0;
    if (A < retireAge) {
      const c = cpfContribAnnual(sal, bon, A);
      contribTotal = c.total;
      OA += c.oa; MA += c.ma;
      if (A < 55) SA += c.sa;
      else { const toRA = Math.min(c.sa, Math.max(0, CPF.sums.FRS - RA)); RA += toRA; OA += c.sa - toRA; }
      sal *= (1 + a.salaryGrowth); bon *= (1 + a.salaryGrowth);
    }

    // voluntary top-up → SA (<55) or RA, spilling above FRS to OA
    if (topUp > 0) {
      if (A < 55) SA += topUp;
      else { const toRA = Math.min(topUp, Math.max(0, CPF.sums.FRS - RA)); RA += toRA; OA += topUp - toRA; }
    }

    // MediSave capped at BHS; excess overflows
    if (MA > CPF.BHS) {
      const over = MA - CPF.BHS; MA = CPF.BHS;
      if (A < 55) SA += over;
      else { const toRA = Math.min(over, Math.max(0, CPF.sums.FRS - RA)); RA += toRA; OA += over - toRA; }
    }

    // SA closes into the RA at the 55th birthday (the year the member turns 55)
    if (rowAge >= 55 && SA > 0) ({ SA, RA, OA } = closeSaToRa(SA, RA, OA));

    OA = Math.max(0, OA - a.oaDrawMonthly * 12);   // OA used for housing / investment
    pts.push({ age: rowAge, OA, SA, RA, MA, contrib: contribTotal, interest: interestYr });
    if (rowAge === 55) ms.at55 = OA + SA + RA + MA;
    if (rowAge === 65) { ms.at65 = OA + SA + RA + MA; ms.ra65 = RA; ms.oa65 = OA; ms.ma65 = MA; }
  }
  return { pts, ms, lifeMonthly: cpfLifePayout(ms.ra65 ?? RA) };
}
