/* ============================================================================
   Singapore resident income tax (YA2024 onward) + relief optimisation.
   Brackets are the IRAS resident progressive rates. Reliefs modelled: earned
   income, compulsory employee CPF, SRS, CPF cash top-up (RSTU) — all under the
   $80,000 personal income tax relief cap. An estimate, not a tax filing.
   ========================================================================== */

// [upper bound of band, marginal rate]; last band is open-ended.
const BANDS: [number, number][] = [
  [20000, 0], [30000, 0.02], [40000, 0.035], [80000, 0.07],
  [120000, 0.115], [160000, 0.15], [200000, 0.18], [240000, 0.19],
  [280000, 0.195], [320000, 0.20], [500000, 0.22], [1000000, 0.23],
  [Infinity, 0.24],
];

/** Brackets with explicit lower bounds, for display. */
export const RESIDENT_BRACKETS = BANDS.map(([upper, rate], i) => ({
  lower: i === 0 ? 0 : BANDS[i - 1][0],
  upper,
  rate,
}));

export function earnedIncomeRelief(age: number): number {
  if (age >= 60) return 8000;
  if (age >= 55) return 6000;
  return 1000;
}

export const SRS_CAP = { citizen: 15300, pr: 15300, foreigner: 35700 };
export const RSTU_SELF_CAP = 8000;
export const RELIEF_CAP = 80000;

export function incomeTax(chargeable: number): number {
  let tax = 0, lower = 0;
  for (const [upper, rate] of BANDS) {
    if (chargeable <= lower) break;
    const slice = Math.min(chargeable, upper) - lower;
    tax += slice * rate;
    lower = upper;
  }
  return Math.max(0, tax);
}

export function marginalRate(chargeable: number): number {
  // rate on the NEXT dollar: a value exactly on a boundary belongs to the next band
  for (const [upper, rate] of BANDS) {
    if (chargeable < upper) return rate;
  }
  return BANDS[BANDS.length - 1][1];
}

function handicappedEarnedIncomeRelief(age: number): number {
  if (age >= 60) return 12000;
  if (age >= 55) return 10000;
  return 4000;
}

/* The reliefs the user enters (mirrors store.TaxReliefs, kept loose to avoid a cycle). */
export interface ReliefInputs {
  handicapped: boolean;
  srsContribution: number;
  cashTopUpFamily: number;
  spouse: "none" | "supported" | "handicapped";
  children: number;
  handicappedChildren: number;
  wmcr: number;
  parentsApart: number;
  parentsLiveWith: number;
  handicappedParents: number;
  grandparentCaregiver: boolean;
  handicappedSiblings: number;
  nsman: "none" | "nsman" | "key";
  nsmanWife: boolean;
  nsmanParents: number;
  courseFees: number;
  lifeInsurancePremium: number;
  otherReliefs: number;
  donations: number;
}

export interface TaxArgs {
  age: number;
  totalIncome: number;        // employment + other taxable (annual)
  earnedIncome: number;       // salary*12 + bonus — for the EIR cap
  employeeCpf: number;        // compulsory employee CPF (a relief; $0 for foreigners)
  cashTopUpSelf: number;      // RSTU self top-up (cpf.annualTopUp)
  residency: "citizen" | "pr" | "foreigner";
  reliefs: ReliefInputs;
}

export interface ReliefItem { label: string; amount: number; }

export interface TaxResult {
  totalIncome: number;
  donationDeduction: number;  // 2.5× donations, applied before reliefs (outside cap)
  assessable: number;
  reliefItems: ReliefItem[];
  reliefsTotal: number;       // before the $80k cap
  reliefsUsed: number;        // after the $80k cap
  reliefCapped: boolean;
  chargeable: number;
  tax: number;
  effectiveRate: number;
  marginal: number;
  srsHeadroom: number;
  topUpHeadroom: number;
  reliefHeadroom: number;
}

export function estimateTax(a: TaxArgs): TaxResult {
  const r = a.reliefs;
  const srsCap = SRS_CAP[a.residency];
  const eirBand = r.handicapped ? handicappedEarnedIncomeRelief(a.age) : earnedIncomeRelief(a.age);

  const srs = Math.min(Math.max(0, r.srsContribution), srsCap);
  const topUpSelf = Math.min(Math.max(0, a.cashTopUpSelf), RSTU_SELF_CAP);
  const topUpFamily = Math.min(Math.max(0, r.cashTopUpFamily), RSTU_SELF_CAP);
  const spouse = r.spouse === "handicapped" ? 5500 : r.spouse === "supported" ? 2000 : 0;
  const nsmanSelf = r.nsman === "key" ? 5000 : r.nsman === "nsman" ? 3000 : 0;
  const course = Math.min(Math.max(0, r.courseFees), 5500);
  // Life Insurance Relief: only when compulsory CPF is under $5,000; tops CPF+LI up to $5,000.
  const lifeIns = a.employeeCpf < 5000 ? Math.min(Math.max(0, r.lifeInsurancePremium), 5000 - a.employeeCpf) : 0;

  const items: ReliefItem[] = [
    { label: "Earned income relief", amount: Math.min(eirBand, Math.max(0, a.earnedIncome)) },
    { label: "CPF relief (your contributions)", amount: a.employeeCpf },
    { label: "SRS contribution", amount: srs },
    { label: "CPF cash top-up — self", amount: topUpSelf },
    { label: "CPF cash top-up — family", amount: topUpFamily },
    { label: "Spouse relief", amount: spouse },
    { label: "Qualifying child relief", amount: Math.max(0, r.children) * 4000 },
    { label: "Handicapped child relief", amount: Math.max(0, r.handicappedChildren) * 7500 },
    { label: "Working mother's child relief", amount: Math.max(0, r.wmcr) },
    { label: "Parent relief", amount: Math.max(0, r.parentsApart) * 5500 + Math.max(0, r.parentsLiveWith) * 9000 + Math.max(0, r.handicappedParents) * 14000 },
    { label: "Grandparent caregiver relief", amount: r.grandparentCaregiver ? 3000 : 0 },
    { label: "Handicapped sibling relief", amount: Math.max(0, r.handicappedSiblings) * 5500 },
    { label: "NSman relief (self)", amount: nsmanSelf },
    { label: "NSman wife relief", amount: r.nsmanWife ? 750 : 0 },
    { label: "NSman parent relief", amount: Math.min(2, Math.max(0, r.nsmanParents)) * 750 },
    { label: "Course fees relief", amount: course },
    { label: "Life insurance relief", amount: lifeIns },
    { label: "Other reliefs", amount: Math.max(0, r.otherReliefs) },
  ].filter((x) => x.amount > 0);

  const reliefsTotal = items.reduce((s, x) => s + x.amount, 0);
  const reliefsUsed = Math.min(reliefsTotal, RELIEF_CAP);
  const donationDeduction = Math.max(0, r.donations) * 2.5;
  const assessable = Math.max(0, a.totalIncome - donationDeduction);
  const chargeable = Math.max(0, assessable - reliefsUsed);
  const tax = incomeTax(chargeable);

  return {
    totalIncome: a.totalIncome, donationDeduction, assessable,
    reliefItems: items, reliefsTotal, reliefsUsed, reliefCapped: reliefsTotal > RELIEF_CAP,
    chargeable, tax,
    effectiveRate: a.totalIncome > 0 ? tax / a.totalIncome : 0,
    marginal: marginalRate(chargeable),
    srsHeadroom: Math.max(0, Math.min(srsCap - srs, RELIEF_CAP - reliefsUsed)),
    topUpHeadroom: Math.max(0, Math.min(RSTU_SELF_CAP - topUpSelf, RELIEF_CAP - reliefsUsed)),
    reliefHeadroom: Math.max(0, RELIEF_CAP - reliefsUsed),
  };
}
