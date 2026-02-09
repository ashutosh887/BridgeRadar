"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadarChart } from "@/components/radar/RadarChart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskScore } from "@/lib/risk/types";

interface RouteCardProps {
  route: {
    id: string;
    fromAmount: string;
    toAmount: string;
    toAmountMin: string;
    fromAmountUSD: string;
    toAmountUSD: string;
    gasCostUSD?: string;
    steps: Array<{ tool: string; estimate?: { executionDuration?: number } }>;
  };
  riskScore?: RiskScore | null;
  isSelected?: boolean;
  onClick?: () => void;
}

function getGradeColor(grade: string) {
  switch (grade) {
    case "A":
      return "bg-emerald-500 text-white";
    case "B":
      return "bg-emerald-600 text-white";
    case "C":
      return "bg-amber-500 text-black";
    case "D":
      return "bg-amber-600 text-black";
    case "F":
      return "bg-red-500 text-white";
    default:
      return "bg-zinc-600 text-white";
  }
}

export function RouteCard({ route, riskScore, isSelected, onClick }: RouteCardProps) {
  const bridgeNames = [
    ...new Set(route.steps.map((s) => s.tool).filter(Boolean)),
  ];
  const duration = route.steps.reduce(
    (acc, s) => acc + (s.estimate?.executionDuration ?? 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "cursor-pointer border-white/10 bg-zinc-900/50 transition-shadow hover:ring-2 hover:ring-emerald-500/30",
          isSelected && "ring-2 ring-emerald-500"
        )}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <div className="flex flex-wrap gap-1">
            {bridgeNames.map((b) => (
              <Badge key={b} variant="secondary" className="text-[10px] border-white/20 bg-white/5 text-zinc-300">
                {b}
              </Badge>
            ))}
          </div>
          {riskScore && (
            <Badge className={cn("text-xs font-bold", getGradeColor(riskScore.grade))}>
              {riskScore.grade}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {riskScore && isSelected && (
            <div className="py-2 -mx-1 mb-2">
              <RadarChart riskScore={riskScore} height={200} />
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-zinc-400">You receive</span>
            <span className="font-mono font-medium">
              ~{parseFloat(route.toAmount).toFixed(4)} ETH
            </span>
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Min (slippage)</span>
            <span>~{parseFloat(route.toAmountMin).toFixed(4)} ETH</span>
          </div>
          {route.gasCostUSD && (
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Gas</span>
              <span>${parseFloat(route.gasCostUSD).toFixed(2)}</span>
            </div>
          )}
          {duration > 0 && (
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Est. time</span>
              <span>{Math.ceil(duration / 60)} min</span>
            </div>
          )}
          {riskScore?.warnings && riskScore.warnings.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-xs text-red-400">
              {riskScore.warnings.slice(0, 2).map((w, i) => (
                <li key={i}>⚠ {w}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
