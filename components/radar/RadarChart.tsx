"use client";

import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RiskScore } from "@/lib/risk/types";

interface RadarChartProps {
  riskScore: RiskScore;
  height?: number;
}

const LABELS: Record<string, string> = {
  security: "Security",
  liquidity: "Liquidity",
  time: "Time",
  cost: "Cost",
};

export function RadarChart({ riskScore, height = 200 }: RadarChartProps) {
  const data = Object.entries(riskScore.breakdown).map(([k, v]) => ({
    subject: LABELS[k] ?? k,
    score: v,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadar data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Radar
          name="Risk"
          dataKey="score"
          stroke="var(--color-radar-primary)"
          fill="var(--color-radar-primary)"
          fillOpacity={0.3}
        />
        <Legend />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
