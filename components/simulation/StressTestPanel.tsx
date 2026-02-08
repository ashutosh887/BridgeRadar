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
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <h3 className="text-sm font-medium">What if?</h3>
          <p className="text-xs text-muted-foreground">
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
                className="text-xs"
                onClick={() => handleRun(s.id)}
                disabled={!route || isLoading}
              >
                {s.label}
              </Button>
            ))}
          </div>
          {result && (
            <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/50 p-3 text-center">
              <div>
                <div className="text-[10px] text-muted-foreground">Worst</div>
                <div className="text-sm font-mono font-medium text-risk-high">
                  {parseFloat(result.worstCase).toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">Expected</div>
                <div className="text-sm font-mono font-medium">
                  {parseFloat(result.expected).toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">Best</div>
                <div className="text-sm font-mono font-medium text-risk-safe">
                  {parseFloat(result.bestCase).toFixed(4)}
                </div>
              </div>
            </div>
          )}
          {result && (
            <p className="text-xs text-muted-foreground">
              Gas est: ${result.gasCostUSD} ({result.scenario.label})
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
