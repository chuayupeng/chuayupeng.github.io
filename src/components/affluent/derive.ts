/* ============================================================================
   Single source of derived truth. Every module reads from here so the numbers
   agree across the app (take-home in Cashflow == take-home used by CPF, the
   CPF LIFE floor in Retirement == the one shown in the CPF view, etc.).
   ========================================================================== */
import { useMemo } from "react";
import { useStore, HoldingType } from "./store";
import { cpfContribAnnual, cpfEmployeeMonthly, cpfProject } from "./calc/cpf";
import { estimateTax } from "./calc/tax";
import { computeBudget } from "./calc/budget";
import { protectionNeeds, rollupCoverage, coverageChecklist } from "./calc/insurance";
import { analyzeRetirement } from "./calc/retirement";
import { analyzeGoal, totalGoalMonthly } from "./calc/goals";

const INVESTABLE: HoldingType[] = ["etf", "stocks", "bonds", "srs", "crypto"];

export function useDerived() {
  const { state } = useStore();
  return useMemo(() => {
    const { profile, income, cpf, budget, investments, retirement, insurance } = state;
    const age = profile.age;
    const annualEmployment = income.monthlySalary * 12 + income.annualBonus + income.otherMonthly * 12;
    const annualIncomeForCover = income.monthlySalary * 12 + income.annualBonus;

    /* ---- CPF (citizens & PRs only — foreigners on EP/S-Pass don't contribute) ---- */
    const cpfEligible = profile.residency !== "foreigner";
    const ZERO_CONTRIB = {
      owAnnual: 0, awSubject: 0, awCeiling: 0, wages: 0, total: 0, employer: 0, employee: 0,
      oa: 0, sa: 0, ma: 0, rate: { upTo: 0, total: 0, er: 0, ee: 0 }, capped: false,
    };
    const cpfNow = cpfEligible ? cpfContribAnnual(income.monthlySalary, income.annualBonus, age) : ZERO_CONTRIB;
    const cpfProj = cpfProject({
      age,
      salary: cpfEligible ? income.monthlySalary : 0,   // no wage contributions for foreigners
      bonus: cpfEligible ? income.annualBonus : 0,
      salaryGrowth: income.salaryGrowth,
      oa0: cpf.oa, sa0: cpf.sa, ma0: cpf.ma, ra0: cpf.ra,
      oaDrawMonthly: cpf.oaDrawMonthly, annualTopUp: cpfEligible ? cpf.annualTopUp : 0,
      retireAge: profile.retireAge, toAge: Math.max(71, profile.retireAge + 1),
    });
    const cpfTotalNow = cpf.oa + cpf.sa + cpf.ma + cpf.ra;
    const employeeCpfMonthly = cpfEligible ? cpfEmployeeMonthly(income.monthlySalary, age) : 0;

    /* ---- tax ---- */
    const tax = estimateTax({
      age,
      totalIncome: annualEmployment,
      earnedIncome: income.monthlySalary * 12 + income.annualBonus,
      employeeCpf: cpfNow.employee,
      cashTopUpSelf: cpfEligible ? cpf.annualTopUp : 0,   // foreigners have no CPF account to RSTU
      residency: profile.residency,
      reliefs: state.taxReliefs,
    });

    /* ---- take-home ---- */
    const autoTakeHome = Math.max(0, income.monthlySalary - employeeCpfMonthly - tax.tax / 12 + income.otherMonthly);
    const takeHome = budget.takeHomeMode === "manual" ? budget.manualTakeHome : autoTakeHome;

    /* ---- holdings / net worth ---- */
    const val = (pred: (t: HoldingType) => boolean) =>
      investments.holdings.filter((h) => pred(h.type)).reduce((s, h) => s + h.value, 0);
    const liquidInvest = val((t) => INVESTABLE.includes(t));
    const cashHoldings = val((t) => t === "cash");
    const otherHoldings = val((t) => t === "other");
    const propertyEquity = investments.holdings
      .filter((h) => h.type === "property")
      .reduce((s, h) => s + (h.value - (h.liability || 0)), 0);
    const liabilities = investments.holdings.reduce((s, h) => s + (h.type !== "property" ? (h.liability || 0) : 0), 0);
    const netWorth = liquidInvest + cashHoldings + otherHoldings + propertyEquity + cpfTotalNow - liabilities;
    const investContribMonthly = investments.holdings
      .filter((h) => INVESTABLE.includes(h.type))
      .reduce((s, h) => s + h.monthlyContribution, 0);

    const allocation = (() => {
      const groups: Record<string, number> = {};
      for (const h of investments.holdings) {
        const v = h.type === "property" ? Math.max(0, h.value - (h.liability || 0)) : h.value;
        groups[h.type] = (groups[h.type] || 0) + v;
      }
      groups["cpf"] = cpfTotalNow;
      return groups;
    })();

    /* ---- insurance ---- */
    const cov = rollupCoverage(insurance.policies);
    const needs = protectionNeeds({
      annualIncome: annualIncomeForCover,
      inputs: insurance.inputs,
      debts: liabilities,
      mortgage: investments.holdings.filter((h) => h.type === "property").reduce((s, h) => s + (h.liability || 0), 0),
      takeHomeAnnual: takeHome * 12,
    });
    const checklist = coverageChecklist(needs, cov, insurance.inputs);
    const protectionGaps = checklist.filter((c) => c.status === "short" || c.status === "missing").length;
    const protectionCovered = checklist.filter((c) => c.status === "covered").length;
    const protectionApplicable = checklist.filter((c) => c.status !== "none").length;   // excludes zero-need lines

    /* ---- budget ---- */
    // voluntary savings already leaving take-home each month: CPF top-up + SRS + family top-up + investing
    const monthlyContributions =
      (cpfEligible ? cpf.annualTopUp : 0) / 12 +
      (state.taxReliefs.srsContribution + state.taxReliefs.cashTopUpFamily) / 12 +
      investContribMonthly;
    const bud = computeBudget({
      takeHome, expenses: budget.expenses,
      insuranceMonthly: cov.monthlyPremium, cashReserves: cashHoldings,
      contributions: monthlyContributions,
    });

    /* ---- retirement ---- */
    const retire = analyzeRetirement({
      age, retireAge: profile.retireAge, life: profile.lifeExpectancy,
      startPortfolio: liquidInvest,
      desiredMonthlyToday: retirement.desiredMonthlyIncome,
      inflation: retirement.inflation, returnPre: retirement.returnPre, returnPost: retirement.returnPost,
      cpfLifeMonthly: cpfProj.lifeMonthly, cpfLifeStartAge: 65,
      otherIncome: retirement.otherIncome, lumpSums: retirement.lumpSums,
    }, investContribMonthly);
    const otherIncomeAtRetire = retirement.otherIncome
      .filter((s) => profile.retireAge >= s.fromAge && (s.toAge == null || profile.retireAge <= s.toAge))
      .reduce((sum, s) => sum + s.monthly, 0);

    /* ---- goals ---- */
    const goalsMonthly = totalGoalMonthly(state.goals);
    const goalsOffTrack = state.goals.filter((g) => !analyzeGoal(g).onTrack).length;

    return {
      age, annualEmployment, annualIncomeForCover,
      cpfEligible,
      cpfNow, cpfProj, cpfTotalNow, employeeCpfMonthly,
      tax, autoTakeHome, takeHome,
      liquidInvest, cashHoldings, otherHoldings, propertyEquity, liabilities, netWorth,
      investContribMonthly, allocation,
      cov, needs, checklist, protectionGaps, protectionCovered, protectionApplicable,
      bud, retire, otherIncomeAtRetire,
      goalsMonthly, goalsOffTrack,
    };
  }, [state]);
}

export type Derived = ReturnType<typeof useDerived>;
