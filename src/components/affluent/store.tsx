/* ============================================================================
   af.fluent — local-first store
   One persisted state object, shared across every module. No backend: everything
   lives in localStorage so the app tracks you over time. Seeded with sensible
   Singapore defaults you can overwrite.
   ========================================================================== */
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

/* ----------------------------------- types -------------------------------- */

export type Residency = "citizen" | "pr" | "foreigner";

export interface Profile {
  name: string;
  age: number;
  retireAge: number;
  lifeExpectancy: number;
  residency: Residency;
}

export interface Income {
  monthlySalary: number;   // gross Ordinary Wages
  annualBonus: number;     // Additional Wages
  salaryGrowth: number;    // assumed annual raise, decimal
  otherMonthly: number;    // rental / side income not subject to CPF
}

export interface Cpf {
  oa: number;
  sa: number;
  ma: number;
  ra: number;              // 0 before 55
  oaDrawMonthly: number;   // OA used each month for housing / investment
  annualTopUp: number;     // voluntary RSTU / MA cash top-up (tax-relief)
}

export type ExpenseCategory =
  | "Housing" | "Food" | "Transport" | "Bills" | "Dependents"
  | "Loans" | "Healthcare" | "Lifestyle" | "Other";

export interface Expense {
  id: string;
  label: string;
  amount: number;          // monthly
  category: ExpenseCategory;
  essential: boolean;
}

export interface Budget {
  takeHomeMode: "auto" | "manual";
  manualTakeHome: number;
  expenses: Expense[];
}

export type HoldingType =
  | "etf" | "stocks" | "bonds" | "cash" | "srs" | "crypto" | "property" | "other";

export interface Holding {
  id: string;
  name: string;
  ticker?: string;
  type: HoldingType;
  value: number;                 // current market value
  monthlyContribution: number;   // ongoing top-up
  expectedReturn?: number;       // optional per-holding override, decimal
  liability?: number;            // e.g. outstanding mortgage on a property
}

export interface NetWorthSnapshot {
  date: string;     // ISO yyyy-mm-dd
  invested: number; // liquid investable assets
  cpf: number;
  cash: number;
  property: number;
  liabilities: number;
  netWorth: number;
}

export interface Investments {
  holdings: Holding[];
  snapshots: NetWorthSnapshot[];
}

// recurring income in retirement (annuity, rental, part-time, endowment cashback)
export interface IncomeStream {
  id: string;
  label: string;
  monthly: number;               // today's dollars; inflated alongside the income need
  fromAge: number;
  toAge: number | null;          // null = for life
}
// one-off payout added to the nest egg at an age (endowment/savings maturity, downsizing)
export interface LumpSum {
  id: string;
  label: string;
  amount: number;                // nominal payout at maturity
  atAge: number;
}

export interface Retirement {
  desiredMonthlyIncome: number;  // in today's dollars
  inflation: number;             // decimal
  returnPre: number;             // expected nominal return while accumulating
  returnPost: number;            // expected nominal return in drawdown
  swr: number;                   // safe withdrawal rate reference, decimal
  otherIncome: IncomeStream[];   // extra income streams in retirement
  lumpSums: LumpSum[];           // maturities/one-offs added to the nest egg
}

export type PolicyType =
  | "term_life" | "whole_life" | "ci" | "early_ci" | "tpd"
  | "hospitalisation" | "personal_accident" | "disability_income"
  | "mortgage" | "endowment" | "ilp" | "other";

export interface Policy {
  id: string;
  name: string;
  insurer: string;
  type: PolicyType;
  deathBenefit: number;
  tpdBenefit: number;
  ciBenefit: number;
  monthlyBenefit?: number;   // disability-income monthly payout
  annualPremium: number;
  notes?: string;
}

export interface InsuranceInputs {
  dependents: number;
  incomeYearsToReplace: number;
  eduPerChild: number;
  finalExpenses: number;
  ipWard: "C" | "B2" | "A";   // ward you'd actually want
}

export interface Insurance {
  inputs: InsuranceInputs;
  policies: Policy[];
}

export type GoalKind = "house" | "wedding" | "education" | "car" | "travel" | "emergency" | "custom";

export interface Goal {
  id: string;
  name: string;
  kind: GoalKind;
  target: number;
  current: number;
  monthly: number;        // what you're putting aside now
  targetYears: number;    // horizon to reach it
  expectedReturn: number; // decimal — cash-like for near-term goals
}

/* Tax reliefs & deductions (YA2026). Auto reliefs (earned income, CPF) are computed
   from your profile; these capture the rest. Amounts are derived from these facts. */
export interface TaxReliefs {
  handicapped: boolean;            // self — raises earned-income relief band
  srsContribution: number;         // annual SRS contributed (cap by residency)
  cashTopUpFamily: number;         // RSTU for family members, ≤ $8,000 (self top-up lives in cpf.annualTopUp)
  spouse: "none" | "supported" | "handicapped";   // $0 / $2,000 / $5,500
  children: number;                // Qualifying Child Relief, $4,000 each
  handicappedChildren: number;     // Handicapped Child Relief, $7,500 each
  wmcr: number;                    // Working Mother's Child Relief (amount; rules in hint)
  parentsApart: number;            // parent relief, not living with you — $5,500 each
  parentsLiveWith: number;         // parent relief, living with you — $9,000 each
  handicappedParents: number;      // handicapped parent living with you — $14,000 each
  grandparentCaregiver: boolean;   // $3,000 (working mothers)
  handicappedSiblings: number;     // $5,500 each
  nsman: "none" | "nsman" | "key"; // self: $3,000 / $5,000 (activity performed)
  nsmanWife: boolean;              // $750
  nsmanParents: number;            // $750 each (0–2)
  courseFees: number;              // qualifying course fees, ≤ $5,500
  lifeInsurancePremium: number;    // relief only if compulsory CPF < $5,000
  otherReliefs: number;            // catch-all, counts toward the $80k cap
  donations: number;               // cash to approved IPCs → 2.5× deduction (outside cap)
}

export interface AffluentState {
  v: number;
  profile: Profile;
  income: Income;
  cpf: Cpf;
  budget: Budget;
  investments: Investments;
  retirement: Retirement;
  insurance: Insurance;
  goals: Goal[];
  taxReliefs: TaxReliefs;
  meta: { created: string; updated: string };
}

/* --------------------------------- defaults ------------------------------- */

const today = () => new Date().toISOString().slice(0, 10);

export const uid = () =>
  "id" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);

const SEED: AffluentState = {
  v: 5,
  profile: { name: "You", age: 32, retireAge: 65, lifeExpectancy: 90, residency: "citizen" },
  income: { monthlySalary: 8500, annualBonus: 18000, salaryGrowth: 0.03, otherMonthly: 0 },
  cpf: { oa: 48000, sa: 32000, ma: 26000, ra: 0, oaDrawMonthly: 1500, annualTopUp: 0 },
  budget: {
    takeHomeMode: "auto",
    manualTakeHome: 6200,
    expenses: [
      { id: uid(), label: "HDB / mortgage", amount: 1800, category: "Housing", essential: true },
      { id: uid(), label: "Groceries & dining", amount: 850, category: "Food", essential: true },
      { id: uid(), label: "Transport", amount: 350, category: "Transport", essential: true },
      { id: uid(), label: "Utilities, phone, internet", amount: 280, category: "Bills", essential: true },
      { id: uid(), label: "Parents' allowance", amount: 600, category: "Dependents", essential: true },
      { id: uid(), label: "Subscriptions & leisure", amount: 500, category: "Lifestyle", essential: false },
    ],
  },
  investments: {
    holdings: [
      { id: uid(), name: "S&P 500 ETF", ticker: "CSPX", type: "etf", value: 62000, monthlyContribution: 750, expectedReturn: 0.07 },
      { id: uid(), name: "World ETF", ticker: "IWDA", type: "etf", value: 24000, monthlyContribution: 300, expectedReturn: 0.065 },
      { id: uid(), name: "Cash savings", type: "cash", value: 35000, monthlyContribution: 0, expectedReturn: 0.025 },
      { id: uid(), name: "SRS account", type: "srs", value: 15000, monthlyContribution: 0, expectedReturn: 0.05 },
    ],
    snapshots: [],
  },
  retirement: {
    desiredMonthlyIncome: 5000, inflation: 0.025, returnPre: 0.065, returnPost: 0.04, swr: 0.04,
    otherIncome: [{ id: uid(), label: "Rental income", monthly: 800, fromAge: 65, toAge: null }],
    lumpSums: [{ id: uid(), label: "Endowment maturity", amount: 60000, atAge: 65 }],
  },
  insurance: {
    inputs: { dependents: 1, incomeYearsToReplace: 10, eduPerChild: 70000, finalExpenses: 20000, ipWard: "B2" },
    policies: [
      { id: uid(), name: "Term life + TPD", insurer: "—", type: "term_life", deathBenefit: 250000, tpdBenefit: 250000, ciBenefit: 0, annualPremium: 720 },
      { id: uid(), name: "Early CI plan", insurer: "—", type: "ci", deathBenefit: 0, tpdBenefit: 0, ciBenefit: 100000, annualPremium: 1100 },
      { id: uid(), name: "Integrated Shield (B2 → private)", insurer: "—", type: "hospitalisation", deathBenefit: 0, tpdBenefit: 0, ciBenefit: 0, annualPremium: 650 },
    ],
  },
  goals: [
    { id: uid(), name: "BTO downpayment", kind: "house", target: 60000, current: 38000, monthly: 300, targetYears: 6, expectedReturn: 0.03 },
    { id: uid(), name: "Wedding", kind: "wedding", target: 25000, current: 15000, monthly: 200, targetYears: 3, expectedReturn: 0.025 },
    { id: uid(), name: "Emergency fund top-up", kind: "emergency", target: 30000, current: 26000, monthly: 200, targetYears: 2, expectedReturn: 0.03 },
  ],
  taxReliefs: {
    handicapped: false, srsContribution: 0, cashTopUpFamily: 0,
    spouse: "none", children: 0, handicappedChildren: 0, wmcr: 0,
    parentsApart: 0, parentsLiveWith: 0, handicappedParents: 0,
    grandparentCaregiver: false, handicappedSiblings: 0,
    nsman: "none", nsmanWife: false, nsmanParents: 0,
    courseFees: 0, lifeInsurancePremium: 0, otherReliefs: 0, donations: 0,
  },
  meta: { created: today(), updated: today() },
};

/* A blank slate: the structure with sensible default assumptions, but no personal
   data — empty lists, zero balances/income. Used by "Clear all data". */
function blankState(): AffluentState {
  const b = structuredClone(SEED);
  b.profile = { name: "You", age: 30, retireAge: 65, lifeExpectancy: 90, residency: "citizen" };
  b.income = { monthlySalary: 0, annualBonus: 0, salaryGrowth: 0.03, otherMonthly: 0 };
  b.cpf = { oa: 0, sa: 0, ma: 0, ra: 0, oaDrawMonthly: 0, annualTopUp: 0 };
  b.budget = { takeHomeMode: "auto", manualTakeHome: 0, expenses: [] };
  b.investments = { holdings: [], snapshots: [] };
  b.retirement = { ...b.retirement, otherIncome: [], lumpSums: [] };   // keep assumptions, drop sample income
  b.insurance = { inputs: { dependents: 0, incomeYearsToReplace: 10, eduPerChild: 70000, finalExpenses: 0, ipWard: "B2" }, policies: [] };
  b.goals = [];
  b.taxReliefs = structuredClone(SEED.taxReliefs);   // seed reliefs are already all zero/none
  b.meta = { created: today(), updated: today() };
  return b;
}

/* ------------------------------- persistence ------------------------------ */

const KEY = "affluent.state";   // versioning handled by the `v` field + migrate()

function load(): AffluentState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(SEED);
    return migrate(JSON.parse(raw));   // always normalize: backfills missing/corrupt sections
  } catch {
    return structuredClone(SEED);
  }
}

// Forward-compatible migration: keep matching sections, backfill the rest, and
// guarantee every section has the right shape (so corrupt localStorage can't crash the app).
function migrate(old: any): AffluentState {
  if (!old || typeof old !== "object") return structuredClone(SEED);
  const base = structuredClone(SEED);
  for (const k of Object.keys(base) as (keyof AffluentState)[]) {
    if (k === "v") continue;
    const seedVal = (base as any)[k];
    const oldVal = (old as any)[k];
    if (Array.isArray(seedVal)) {
      if (Array.isArray(oldVal)) (base as any)[k] = oldVal;          // valid array wins; else keep seed
    } else if (oldVal && typeof oldVal === "object" && !Array.isArray(oldVal)) {
      (base as any)[k] = { ...seedVal, ...oldVal };
    }
  }
  // coerce nested arrays a shallow merge could have corrupted (holdings:null, etc.)
  const inv = base.investments;
  if (!Array.isArray(inv.holdings)) inv.holdings = structuredClone(SEED.investments.holdings);
  if (!Array.isArray(inv.snapshots)) inv.snapshots = [];
  if (!Array.isArray(base.budget.expenses)) base.budget.expenses = structuredClone(SEED.budget.expenses);
  if (!Array.isArray(base.insurance.policies)) base.insurance.policies = structuredClone(SEED.insurance.policies);
  if (!base.insurance.inputs || typeof base.insurance.inputs !== "object" || Array.isArray(base.insurance.inputs)) base.insurance.inputs = structuredClone(SEED.insurance.inputs);
  if (!Array.isArray(base.goals)) base.goals = structuredClone(SEED.goals);
  if (!Array.isArray(base.retirement.otherIncome)) base.retirement.otherIncome = [];
  if (!Array.isArray(base.retirement.lumpSums)) base.retirement.lumpSums = [];
  base.v = SEED.v;
  return base;
}

/* -------------------------------- context --------------------------------- */

type SectionKey = Exclude<keyof AffluentState, "v" | "meta">;
type Updater<T> = T | ((prev: T) => T);

interface StoreApi {
  state: AffluentState;
  set: <K extends SectionKey>(key: K, value: Updater<AffluentState[K]>) => void;
  /** Bind a numeric field on a section to an input. */
  num: <K extends SectionKey>(key: K, field: keyof AffluentState[K]) =>
    { value: number; onChange: (n: number) => void };
  reset: () => void;
  clear: () => void;
  exportJSON: () => string;
  importJSON: (raw: string) => boolean;
  snapshotNow: (s: Omit<NetWorthSnapshot, "date">) => void;
}

const Ctx = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AffluentState>(() =>
    typeof window === "undefined" ? structuredClone(SEED) : load()
  );
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try {
      const next = { ...state, meta: { ...state.meta, updated: today() } };
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch { /* storage full / unavailable — stay in-memory */ }
  }, [state]);

  const api = useMemo<StoreApi>(() => ({
    state,
    set: (key, value) =>
      setState((prev) => ({
        ...prev,
        [key]: typeof value === "function" ? (value as any)(prev[key]) : value,
      })),
    num: (key, field) => ({
      value: (state[key] as any)[field] as number,
      onChange: (n: number) =>
        setState((prev) => ({ ...prev, [key]: { ...(prev[key] as any), [field]: n } })),
    }),
    reset: () => setState(structuredClone(SEED)),
    clear: () => setState(blankState()),
    exportJSON: () => JSON.stringify(state, null, 2),
    importJSON: (raw) => {
      try {
        const parsed = JSON.parse(raw);
        setState(migrate(parsed));
        return true;
      } catch { return false; }
    },
    snapshotNow: (s) =>
      setState((prev) => {
        const date = today();
        const rest = prev.investments.snapshots.filter((x) => x.date !== date);
        return {
          ...prev,
          investments: { ...prev.investments, snapshots: [...rest, { date, ...s }].sort((a, b) => a.date.localeCompare(b.date)) },
        };
      }),
  }), [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
