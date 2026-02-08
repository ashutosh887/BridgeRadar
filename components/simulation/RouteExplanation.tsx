"use client";

import { getRouteExplanation } from "@/lib/route-explanation";
import type { RiskScore } from "@/lib/risk/types";

interface RouteExplanationProps {
  bridgeNames: string[];
  riskScore: RiskScore;
  toAmount: string;
}

export function RouteExplanation({
  bridgeNames,
  riskScore,
  toAmount,
}: RouteExplanationProps) {
  const explanation = getRouteExplanation({
    bridgeNames,
    riskScore,
    fromAmount: "0",
    toAmount,
  });

  return (
    <p className="text-xs text-muted-foreground leading-relaxed">
      {explanation}
    </p>
  );
}
