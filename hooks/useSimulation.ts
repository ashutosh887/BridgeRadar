"use client";

import { useMutation } from "@tanstack/react-query";
import type { SimulateInput, SimulateResult } from "@/lib/simulation/stress-test";

export function useSimulation() {
  return useMutation({
    mutationFn: async (params: {
      input: SimulateInput;
      scenarioId?: string;
    }): Promise<SimulateResult> => {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });
}
