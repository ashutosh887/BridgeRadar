"use client";

import { useMutation } from "@tanstack/react-query";
import type { RiskInput, RiskScore } from "@/lib/risk/types";

export function useRiskScore() {
  return useMutation({
    mutationFn: async (input: RiskInput): Promise<RiskScore> => {
      const res = await fetch("/api/risk-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });
}
