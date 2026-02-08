export type RiskGrade = "A" | "B" | "C" | "D" | "F";

export interface RiskScore {
  score: number;
  grade: RiskGrade;
  warnings: string[];
  breakdown: {
    security: number;
    liquidity: number;
    time: number;
    cost: number;
  };
}

export interface RiskInput {
  routeId: string;
  bridgeNames: string[];
  fromAmountUSD: string;
  toAmountMin: string;
  toAmount: string;
  gasCostUSD?: string;
  executionDuration?: number;
  liquidityRatio?: number;
}
