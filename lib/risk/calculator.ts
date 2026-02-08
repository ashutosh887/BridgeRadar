import type { RiskScore, RiskGrade, RiskInput } from "./types";
import { RISK_WEIGHTS, GRADE_THRESHOLDS } from "./weights";
import { BRIDGE_SECURITY, DEFAULT_BRIDGE } from "./security-data";

function getGrade(score: number): RiskGrade {
  if (score >= GRADE_THRESHOLDS.A) return "A";
  if (score >= GRADE_THRESHOLDS.B) return "B";
  if (score >= GRADE_THRESHOLDS.C) return "C";
  if (score >= GRADE_THRESHOLDS.D) return "D";
  return "F";
}

export function calculateRiskScore(input: RiskInput): RiskScore {
  const warnings: string[] = [];
  const bridgeKeys = input.bridgeNames.map((n) =>
    n.toLowerCase().replace(/[^a-z0-9]/g, "")
  );
  const bridges = bridgeKeys.map((k) => BRIDGE_SECURITY[k] ?? DEFAULT_BRIDGE);

  let securityScore = 100;
  for (const b of bridges) {
    if (b.exploits > 0) {
      securityScore -= 30;
      warnings.push(`This bridge had ${b.exploits} exploit(s) in 2024`);
    }
    if (b.audits === 0) {
      securityScore -= 20;
      warnings.push("Bridge has no public audits");
    }
    if (b.tvlUsd < 10_000_000) {
      securityScore -= 15;
      warnings.push("Low TVL — higher counterparty risk");
    }
  }

  const fromUsd = parseFloat(input.fromAmountUSD) || 1;
  const toMin = parseFloat(input.toAmountMin) || 0;
  const toExpected = parseFloat(input.toAmount) || 0;
  const slippage =
    toExpected > 0 ? (1 - toMin / toExpected) * 100 : 5;
  let slippageScore = Math.max(0, 100 - slippage * 10);
  if (slippage > 3) {
    warnings.push(`Slippage: ${slippage.toFixed(1)}% — worst case may differ`);
  }

  const liquidityRatio = input.liquidityRatio ?? 0.01;
  let liquidityScore = 100;
  if (liquidityRatio > 0.01) {
    liquidityScore = Math.max(0, 100 - liquidityRatio * 1000);
    if (liquidityRatio > 0.001) {
      warnings.push(
        `Your trade = ${(liquidityRatio * 100).toFixed(2)}% of available liquidity`
      );
    }
  }

  const gasUsd = parseFloat(input.gasCostUSD ?? "0") || 0;
  const gasRatio = fromUsd > 0 ? gasUsd / fromUsd : 0;
  const costScore =
    gasRatio > 0.05 ? 70 : gasRatio > 0.02 ? 85 : 100;

  const durationMin = (input.executionDuration ?? 300) / 60;
  const timeScore =
    durationMin > 30 ? 50 : durationMin > 10 ? 75 : durationMin > 5 ? 90 : 100;

  const breakdown = {
    security: Math.min(100, securityScore),
    liquidity: Math.min(100, liquidityScore),
    time: timeScore,
    cost: costScore,
  };

  const weighted =
    breakdown.security * RISK_WEIGHTS.security +
    breakdown.liquidity * RISK_WEIGHTS.liquidity +
    breakdown.time * RISK_WEIGHTS.time +
    breakdown.cost * RISK_WEIGHTS.cost +
    slippageScore * RISK_WEIGHTS.slippage;

  return {
    score: Math.round(weighted),
    grade: getGrade(weighted),
    warnings: [...new Set(warnings)],
    breakdown,
  };
}
