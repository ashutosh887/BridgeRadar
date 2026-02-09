"use client";

import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
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

export function RadarChart({ riskScore, height = 220 }: RadarChartProps) {
  const data = Object.entries(riskScore.breakdown).map(([k, v]) => ({
    subject: LABELS[k] ?? k,
    score: v,
    fullMark: 100,
  }));

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid stroke="#ffffff20" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fontSize: 11,
              fill: "#a1a1aa",
              fontWeight: 500,
            }}
            style={{ textTransform: "capitalize" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fontSize: 9,
              fill: "#71717a",
            }}
            tickCount={5}
          />
          <Radar
            name="Risk"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.4}
            strokeWidth={2}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
