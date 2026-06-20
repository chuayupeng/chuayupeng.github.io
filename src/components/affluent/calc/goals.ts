/* ============================================================================
   Life goals — short/medium-term savings targets (house, wedding, education…).
   For each: how much you must set aside monthly to hit it on time, what your
   current pace actually delivers, and when you'll get there.
   ========================================================================== */
import type { Goal } from "../store";

export interface GoalResult {
  required: number;              // monthly needed to hit target by targetYears
  projected: number;            // value at targetYears at the current monthly pace
  fundedNow: number;            // current / target, capped at 1
  onTrack: boolean;
  shortfall: number;            // max(0, required − monthly)
  monthsToTarget: number | null; // months to reach target at current pace (null = never)
}

export function analyzeGoal(g: Goal): GoalResult {
  const r = g.expectedReturn / 12;
  const n = Math.max(1, Math.round(g.targetYears * 12));
  const grow = Math.pow(1 + r, n);
  const annuity = r === 0 ? n : (grow - 1) / r;
  const fvCurrent = g.current * grow;
  const projected = fvCurrent + g.monthly * annuity;
  const required = Math.max(0, (g.target - fvCurrent) / annuity);
  const fundedNow = g.target > 0 ? Math.min(1, g.current / g.target) : 1;

  let monthsToTarget: number | null = g.current >= g.target ? 0 : null;
  if (monthsToTarget === null) {
    let bal = g.current;
    for (let m = 1; m <= 1200; m++) {
      bal = bal * (1 + r) + g.monthly;
      if (bal >= g.target) { monthsToTarget = m; break; }
    }
  }
  return {
    required, projected, fundedNow,
    onTrack: projected >= g.target - 1,
    shortfall: Math.max(0, required - g.monthly),
    monthsToTarget,
  };
}

export function totalGoalMonthly(goals: Goal[]): number {
  return goals.reduce((s, g) => s + g.monthly, 0);
}
