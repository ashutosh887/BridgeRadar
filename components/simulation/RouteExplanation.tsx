"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRouteExplanation } from "@/lib/route-explanation";
import type { RiskScore } from "@/lib/risk/types";

interface RouteExplanationProps {
  bridgeNames: string[];
  riskScore: RiskScore;
  toAmount: string;
  fromAmount?: string;
}

export function RouteExplanation({
  bridgeNames,
  riskScore,
  toAmount,
  fromAmount = "0",
}: RouteExplanationProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data, isLoading } = useQuery({
    queryKey: ["ai-explanation", bridgeNames.join(","), riskScore.grade, toAmount],
    queryFn: async () => {
      const res = await fetch("/api/ai-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bridgeNames,
          riskScore,
          fromAmount,
          toAmount,
        }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.explanation as string;
    },
    enabled: mounted,
    staleTime: 60_000,
  });

  const explanation = data ?? getRouteExplanation({
    bridgeNames,
    riskScore,
    fromAmount,
    toAmount,
  });

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">AI</span>
        {isLoading && (
          <span className="text-xs text-zinc-500">Analyzing...</span>
        )}
      </div>
      <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
        {explanation}
      </p>
    </div>
  );
}
