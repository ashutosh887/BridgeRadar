import { BRIDGE_SECURITY } from "./risk/security-data";
import type { RiskScore } from "./risk/types";

export interface RouteExplanationInput {
  bridgeNames: string[];
  riskScore: RiskScore;
  fromAmount: string;
  toAmount: string;
}

function normalizeKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getRouteExplanation(input: RouteExplanationInput): string {
  const { bridgeNames, riskScore } = input;
  const primary = bridgeNames[0] ?? "bridge";
  const bridge = BRIDGE_SECURITY[normalizeKey(primary)] ?? null;

  if (riskScore.grade === "A" || riskScore.grade === "B") {
    const reasons: string[] = [];
    if (bridge?.audits && bridge.audits >= 2) reasons.push("multiple audits");
    if (bridge?.tvlUsd && bridge.tvlUsd > 100_000_000) reasons.push("high TVL");
    if (riskScore.breakdown.security >= 80) reasons.push("strong security profile");
    return reasons.length > 0
      ? `${primary} recommended: ${reasons.join(", ")}.`
      : `${primary} shows acceptable risk for this route.`;
  }

  if (riskScore.grade === "C" || riskScore.grade === "D") {
    const concerns = riskScore.warnings.slice(0, 1);
    return concerns.length > 0
      ? `Caution: ${concerns[0]} Consider smaller amounts or alternative routes.`
      : "Moderate risk. Review breakdown before proceeding.";
  }

  return "High risk. Consider splitting the transaction or using a different bridge.";
}
