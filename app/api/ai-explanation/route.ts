import { NextRequest, NextResponse } from "next/server";
import { getRouteExplanation } from "@/lib/route-explanation";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import type { RiskScore } from "@/lib/risk/types";

export async function POST(req: NextRequest) {
  const rl = rateLimit(`ai:${getClientIdentifier(req)}`);
  if (!rl.ok) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }
  try {
    const body = await req.json();
    const { bridgeNames, riskScore, fromAmount, toAmount } = body as {
      bridgeNames: string[];
      riskScore: RiskScore;
      fromAmount: string;
      toAmount: string;
    };
    if (!bridgeNames?.length || !riskScore || !toAmount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const fallback = getRouteExplanation({
        bridgeNames,
        riskScore,
        fromAmount: fromAmount ?? "0",
        toAmount,
      });
      return NextResponse.json({ explanation: fallback });
    }

    const bridges = bridgeNames.join(", ");
    const prompt = `You are a cross-chain bridge risk analyst. In 1-2 concise sentences, explain why this route has a ${riskScore.grade} risk grade and what the user should know. Use plain language. No PII. Bridge(s): ${bridges}. Warnings: ${(riskScore.warnings ?? []).join("; ")}. Security breakdown: ${JSON.stringify(riskScore.breakdown ?? {})}.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 120,
      }),
    });

    if (!res.ok) {
      const fallback = getRouteExplanation({
        bridgeNames,
        riskScore,
        fromAmount: fromAmount ?? "0",
        toAmount,
      });
      return NextResponse.json({ explanation: fallback });
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = data.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({
      explanation: text ?? getRouteExplanation({ bridgeNames, riskScore, fromAmount: fromAmount ?? "0", toAmount }),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
