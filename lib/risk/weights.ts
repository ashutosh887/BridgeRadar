export const RISK_WEIGHTS = {
  security: 0.25,
  liquidity: 0.2,
  time: 0.15,
  cost: 0.15,
  slippage: 0.25,
} as const;

export const GRADE_THRESHOLDS = {
  A: 85,
  B: 70,
  C: 55,
  D: 40,
  F: 0,
} as const;
