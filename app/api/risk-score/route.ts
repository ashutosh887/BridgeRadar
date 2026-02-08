import { NextResponse } from "next/server";
import { calculateRiskScore } from "@/lib/risk/calculator";
import type { RiskInput } from "@/lib/risk/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RiskInput;
    const score = calculateRiskScore(body);
    return NextResponse.json(score);
  } catch (err) {
    console.error("Risk score error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Risk calculation failed" },
      { status: 500 }
    );
  }
}
