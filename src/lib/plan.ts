export type Plan = 'free' | 'standard' | 'pro';

/** profiles.plan から Plan 型を解決する。未設定は free 扱い */
export function resolvePlanType(plan: string | null | undefined): Plan {
  if (plan === 'standard' || plan === 'pro') return plan;
  return 'free';
}

export function isFree(plan: Plan): boolean {
  return plan === 'free';
}

export function isPaid(plan: Plan): boolean {
  return plan === 'standard' || plan === 'pro';
}
