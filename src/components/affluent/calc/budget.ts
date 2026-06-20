/* ============================================================================
   Cashflow & budgeting. Take-home is derived from salary − employee CPF − tax,
   or set manually. The auto-budget recommends a needs / wants / save split and
   flags where you're over- or under-spending versus rules of thumb.
   ========================================================================== */
import type { Expense } from "../store";

export interface BudgetArgs {
  takeHome: number;            // monthly
  expenses: Expense[];
  insuranceMonthly: number;    // pulled from the insurance module
  cashReserves: number;        // liquid cash for emergency-fund test
}

export interface BudgetResult {
  takeHome: number;
  essential: number;
  discretionary: number;
  insurance: number;
  outflow: number;             // essential + discretionary + insurance
  surplus: number;             // what's left to invest
  savingsRate: number;
  insuranceRate: number;
  emergencyMonths: number;
  byCategory: { category: string; amount: number; essential: boolean }[];
  checks: { key: string; value: string; ok: boolean; guide: string }[];
  // 50/30/20-style recommendation, adapted: needs / wants / future
  recommend: { needs: number; wants: number; future: number };
}

export function computeBudget(a: BudgetArgs): BudgetResult {
  const essential = a.expenses.filter((e) => e.essential).reduce((s, e) => s + e.amount, 0);
  const discretionary = a.expenses.filter((e) => !e.essential).reduce((s, e) => s + e.amount, 0);
  const insurance = a.insuranceMonthly;
  const outflow = essential + discretionary + insurance;
  const surplus = a.takeHome - outflow;
  const savingsRate = a.takeHome > 0 ? surplus / a.takeHome : 0;
  const insuranceRate = a.takeHome > 0 ? insurance / a.takeHome : 0;
  // emergency fund covers essential burn (needs + insurance) — wants get cut in a crisis
  const essentialBurn = essential + insurance;
  const emergencyMonths = essentialBurn > 0 ? a.cashReserves / essentialBurn : 0;

  const cats = new Map<string, { amount: number; essential: boolean }>();
  for (const e of a.expenses) {
    const cur = cats.get(e.category) || { amount: 0, essential: e.essential };
    cur.amount += e.amount;
    cats.set(e.category, cur);
  }
  const byCategory = [...cats.entries()]
    .map(([category, v]) => ({ category, ...v }))
    .sort((x, y) => y.amount - x.amount);

  const checks = [
    { key: "Savings rate", value: Math.round(savingsRate * 100) + "%", ok: savingsRate >= 0.20, guide: "aim ≥ 20%" },
    { key: "Insurance load", value: Math.round(insuranceRate * 100) + "%", ok: insuranceRate <= 0.15, guide: "keep ≤ 15%" },
    { key: "Emergency fund", value: emergencyMonths.toFixed(1) + "×", ok: emergencyMonths >= 6, guide: "hold 3–6 mths" },
  ];

  return {
    takeHome: a.takeHome, essential, discretionary, insurance, outflow, surplus,
    savingsRate, insuranceRate, emergencyMonths, byCategory, checks,
    recommend: { needs: a.takeHome * 0.50, wants: a.takeHome * 0.30, future: a.takeHome * 0.20 },
  };
}
