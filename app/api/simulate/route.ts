import { NextResponse } from "next/server";
import { runStressTest } from "@/lib/simulation/stress-test";
import { STRESS_SCENARIOS } from "@/lib/simulation/scenarios";
import type { SimulateInput } from "@/lib/simulation/stress-test";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      input: SimulateInput;
      scenarioId?: string;
    };
    const { input, scenarioId = "disaster" } = body;
    const scenario =
      STRESS_SCENARIOS.find((s) => s.id === scenarioId) ?? STRESS_SCENARIOS[4];
    const result = runStressTest(input, scenario);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Simulate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Simulation failed" },
      { status: 500 }
    );
  }
}
