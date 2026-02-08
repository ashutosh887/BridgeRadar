import { NextResponse } from "next/server";
import { calculateRiskScore } from "@/lib/risk/calculator";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import type { RiskInput } from "@/lib/risk/types";

export async function POST(request: Request) {
  const limit = rateLimit(`risk:${getClientIdentifier(request)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests", retryAfter: limit.retryAfter },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } }
    );
  }
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
