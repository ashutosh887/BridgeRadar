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
      return "bg-risk-safe text-white";
    case "B":
      return "bg-risk-safe/80 text-white";
    case "C":
      return "bg-risk-moderate text-black";
    case "D":
      return "bg-risk-moderate text-black";
    case "F":
      return "bg-risk-high text-white";
    default:
      return "bg-muted";
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
          "cursor-pointer transition-shadow hover:ring-2 hover:ring-radar-primary/30",
          isSelected && "ring-2 ring-radar-primary"
        )}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <div className="flex flex-wrap gap-1">
            {bridgeNames.map((b) => (
              <Badge key={b} variant="secondary" className="text-[10px]">
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
            <div className="h-24 -mx-1">
              <RadarChart riskScore={riskScore} height={96} />
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">You receive</span>
            <span className="font-mono font-medium">
              ~{parseFloat(route.toAmount).toFixed(4)} ETH
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min (slippage)</span>
            <span>~{parseFloat(route.toAmountMin).toFixed(4)} ETH</span>
          </div>
          {route.gasCostUSD && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Gas</span>
              <span>${parseFloat(route.gasCostUSD).toFixed(2)}</span>
            </div>
          )}
          {duration > 0 && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Est. time</span>
              <span>{Math.ceil(duration / 60)} min</span>
            </div>
          )}
          {riskScore?.warnings && riskScore.warnings.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-xs text-risk-high">
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
