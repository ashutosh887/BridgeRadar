"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { STRESS_SCENARIOS } from "@/lib/simulation/scenarios";
import type { SimulateResult } from "@/lib/simulation/stress-test";

interface StressTestPanelProps {
  onSimulate: (scenarioId: string) => void;
  result?: SimulateResult | null;
  isLoading?: boolean;
  route?: {
    toAmount: string;
    toAmountMin: string;
    gasCostUSD?: string;
    fromAmountUSD?: string;
  } | null;
}

export function StressTestPanel({
  onSimulate,
  result,
  isLoading,
  route,
}: StressTestPanelProps) {
  const [selectedId, setSelectedId] = useState("disaster");

  const handleRun = (id: string) => {
    setSelectedId(id);
    onSimulate(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
    >
      <Card className="border-white/10 bg-zinc-900/50">
        <CardHeader>
          <h3 className="text-sm font-medium text-white">What if?</h3>
          <p className="text-xs text-zinc-400">
            Stress test your route under adverse conditions
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1">
            {STRESS_SCENARIOS.filter((s) => s.id !== "baseline").map((s) => (
              <Button
                key={s.id}
                variant={selectedId === s.id ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedId === s.id ? "bg-emerald-500" : "border-white/20 text-zinc-300 hover:bg-white/10"}`}
                onClick={() => handleRun(s.id)}
                disabled={!route || isLoading}
              >
                {s.label}
              </Button>
            ))}
          </div>
          {result && (
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-zinc-800/50 p-3 text-center">
              <div>
                <div className="text-[10px] text-zinc-500">Worst</div>
                <div className="text-sm font-mono font-medium text-red-400">
                  {parseFloat(result.worstCase).toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500">Expected</div>
                <div className="text-sm font-mono font-medium text-zinc-300">
                  {parseFloat(result.expected).toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500">Best</div>
                <div className="text-sm font-mono font-medium text-emerald-400">
                  {parseFloat(result.bestCase).toFixed(4)}
                </div>
              </div>
            </div>
          )}
          {result && (
            <p className="text-xs text-zinc-500">
              Gas est: ${result.gasCostUSD} ({result.scenario.label})
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
