/* ============================================================================
   Protection engine.
   • Needs: DIME (Debt, Income, Mortgage, Education) sized on your own numbers,
     with the MoneySense/LIA 9× income (death/TPD) and 4× income (CI) rules of
     thumb alongside as a sanity check.
   • Coverage: rolls up your policies by risk line and produces a checklist that
     tells you exactly which risks are covered, short, or missing.
   • MediShield Life: actual premiums + a worked out-of-pocket example.
   ========================================================================== */
import type { Policy, InsuranceInputs, PolicyType } from "../store";

const BFPG = { deathTpdMult: 9, ciMult: 4, premiumPct: 0.15 };

export interface NeedsArgs {
  annualIncome: number;
  inputs: InsuranceInputs;
  debts: number;
  mortgage: number;
  takeHomeAnnual?: number;   // real take-home from derive; falls back to 0.8× gross
}

export interface ProtectionNeeds {
  death: number;
  tpd: number;
  ci: number;
  incomeReplacement: number;
  benchmark9x: number;
  premiumBudget: number;       // annual ceiling, 15% of est. take-home
  disabilityMonthly: number;   // target monthly income-replacement cover (~70% of take-home)
}

export function protectionNeeds(a: NeedsArgs): ProtectionNeeds {
  const edu = a.inputs.dependents * a.inputs.eduPerChild;
  const incomeReplacement = a.annualIncome * a.inputs.incomeYearsToReplace;
  const death = a.debts + a.mortgage + edu + incomeReplacement + a.inputs.finalExpenses;
  const takeHome = a.takeHomeAnnual ?? a.annualIncome * 0.8;
  return {
    death,
    tpd: death,
    ci: a.annualIncome * BFPG.ciMult,
    incomeReplacement,
    benchmark9x: a.annualIncome * BFPG.deathTpdMult,
    premiumBudget: takeHome * BFPG.premiumPct,
    disabilityMonthly: (takeHome / 12) * 0.7,
  };
}

export type BenefitKey = "death" | "tpd" | "ci" | "monthly";

/* Which benefits each policy type actually provides. This is the single source of
   truth: it drives both the editor fields shown for a policy AND the coverage
   roll-up, so a stored amount only counts toward a line its type really covers.
   (A death amount left on a policy later switched to "hospitalisation" is ignored,
   not silently dropped — switch back and it counts again.) */
export const POLICY_BENEFITS: Record<PolicyType, BenefitKey[]> = {
  term_life: ["death", "tpd"],
  whole_life: ["death", "tpd", "ci"],
  ci: ["ci"],
  early_ci: ["ci"],
  tpd: ["tpd"],
  mortgage: ["death"],
  ilp: ["death"],
  endowment: ["death"],
  disability_income: ["monthly"],
  hospitalisation: [],
  personal_accident: [],
  other: ["death", "tpd", "ci"],
};

// `?? []` keeps a corrupt/unknown type (from a hand-edited import) from crashing the app
const provides = (p: Policy, b: BenefitKey) => (POLICY_BENEFITS[p.type] ?? []).includes(b);

export interface Coverage {
  life: number; tpd: number; ci: number;
  disabilityMonthly: number;
  hasHospitalisation: boolean;
  hasPersonalAccident: boolean;
  hasDisabilityIncome: boolean;
  hasMortgageCover: boolean;
  annualPremium: number;
  monthlyPremium: number;
}

export function rollupCoverage(policies: Policy[]): Coverage {
  const sum = (f: (p: Policy) => number) => policies.reduce((s, p) => s + f(p), 0);
  const has = (t: Policy["type"]) => policies.some((p) => p.type === t);
  const annualPremium = sum((p) => p.annualPremium);
  return {
    life: sum((p) => provides(p, "death") ? p.deathBenefit : 0),
    tpd: sum((p) => provides(p, "tpd") ? p.tpdBenefit : 0),
    ci: sum((p) => provides(p, "ci") ? p.ciBenefit : 0),
    disabilityMonthly: sum((p) => provides(p, "monthly") ? (p.monthlyBenefit || 0) : 0),
    hasHospitalisation: has("hospitalisation"),
    hasPersonalAccident: has("personal_accident"),
    hasDisabilityIncome: has("disability_income"),
    hasMortgageCover: has("mortgage") || has("term_life"),
    annualPremium,
    monthlyPremium: annualPremium / 12,
  };
}

export type CheckStatus = "covered" | "short" | "missing" | "none";

export interface CoverageLine {
  key: string;
  need: number | null;       // null = presence-based, not a $ amount
  have: number;
  status: CheckStatus;
  gap: number;
  note: string;
  addType: PolicyType;       // policy type created when you "Add" this cover
  addName: string;           // sensible default name for that policy
  monthly?: boolean;         // need/have/gap are $/month (vs a lump sum)
}

export function coverageChecklist(needs: ProtectionNeeds, cov: Coverage, inputs: InsuranceInputs): CoverageLine[] {
  const line = (key: string, need: number, have: number, note: string, addType: PolicyType, addName: string, monthly = false): CoverageLine => {
    const gap = Math.max(0, need - have);
    // zero need (e.g. no income/dependants yet) is "none" — neither a gap nor "covered"
    const status: CheckStatus = need <= 0 ? "none" : have <= 0 ? "missing" : gap > need * 0.1 ? "short" : "covered";
    return { key, need, have, status, gap, note, addType, addName, monthly };
  };
  const presence = (key: string, ok: boolean, note: string, addType: PolicyType, addName: string): CoverageLine => ({
    key, need: null, have: ok ? 1 : 0, status: ok ? "covered" : "missing", gap: 0, note, addType, addName,
  });

  return [
    line("Death", needs.death, cov.life, "Clears debts + mortgage + replaces income for dependants.", "term_life", "Term life"),
    line("Total & permanent disability", needs.tpd, cov.tpd, "Same magnitude as death — income is gone permanently.", "tpd", "TPD cover"),
    line("Critical illness", needs.ci, cov.ci, "~4× income to fund recovery and lost earnings while you heal.", "ci", "Critical illness"),
    presence("Hospitalisation (Integrated Shield)", cov.hasHospitalisation,
      `MediShield Life is automatic; an IP tops up to your preferred ward (you chose ${inputs.ipWard}).`, "hospitalisation", "Integrated Shield plan"),
    line("Disability income", needs.disabilityMonthly, cov.disabilityMonthly,
      "A monthly income (insurers cap ~75% of salary) if illness/injury stops you working but isn't total disability.", "disability_income", "Disability income", true),
    presence("Personal accident", cov.hasPersonalAccident,
      "Lump sum + medical reimbursement for accidents. Optional; no official benchmark.", "personal_accident", "Personal accident"),
  ];
}

/* ----------------------------- MediShield Life ---------------------------- */
/* Actual premiums (policies from 1 Oct 2025, incl. 9% GST, MediSave-payable). */
export const MSL = {
  premiumByAge: [
    { upTo: 20, p: 200 }, { upTo: 30, p: 295 }, { upTo: 40, p: 503 },
    { upTo: 50, p: 637 }, { upTo: 60, p: 903 }, { upTo: 65, p: 1131 },
    { upTo: 70, p: 1326 }, { upTo: 73, p: 1643 }, { upTo: 75, p: 1816 },
    { upTo: 78, p: 2027 }, { upTo: 80, p: 2187 }, { upTo: 83, p: 2303 },
    { upTo: 85, p: 2616 }, { upTo: 88, p: 2785 }, { upTo: 90, p: 2785 },
    { upTo: 999, p: 2826 },
  ],
  dedC: 1500, dedB2: 2000, dedA: 3500, annualLimit: 200000,
};

export function mslPremium(age: number): number {
  const b = MSL.premiumByAge.find((x) => age <= x.upTo) || MSL.premiumByAge[MSL.premiumByAge.length - 1];
  return b.p;
}

export interface MslOop { oop: number; covered: number; dedPart: number; coins: number; }

export function mslOutOfPocket(bill: number, deductible: number): MslOop {
  // MediShield Life only pays within the annual claim limit; anything above it is the patient's.
  const claimable = Math.min(bill, MSL.annualLimit);
  const afterDed = Math.max(0, claimable - deductible);   // tiered co-insurance (illustrative bands)
  let coins = 0, rem = afterDed;
  const t1 = Math.min(rem, 5000); coins += t1 * 0.10; rem -= t1;
  const t2 = Math.min(rem, 5000); coins += t2 * 0.05; rem -= t2;
  coins += rem * 0.03;
  const dedPart = Math.min(claimable, deductible);
  const overLimit = Math.max(0, bill - MSL.annualLimit);
  const oop = dedPart + coins + overLimit;
  const covered = bill - oop;   // = claimable − deductible − co-insurance
  return { oop, covered, dedPart, coins };
}

export const wardDeductible = (ward: InsuranceInputs["ipWard"]) =>
  ward === "C" ? MSL.dedC : ward === "A" ? MSL.dedA : MSL.dedB2;
