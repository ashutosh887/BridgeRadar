import type { StressScenario } from "./scenarios";

export interface SimulateInput {
  toAmount: string;
  toAmountMin: string;
  gasCostUSD?: string;
  fromAmountUSD?: string;
  slippageBps?: number;
}

export interface SimulateResult {
  expected: string;
  worstCase: string;
  bestCase: string;
  gasCostUSD: string;
  scenario: StressScenario;
}

export function runStressTest(
  input: SimulateInput,
  scenario: StressScenario
): SimulateResult {
  const toAmount = parseFloat(input.toAmount) || 0;
  const toMin = parseFloat(input.toAmountMin) || 0;
  const gasUsd = parseFloat(input.gasCostUSD ?? "0") || 0;
  const fromUsd = parseFloat(input.fromAmountUSD ?? "1") || 1;

  const gasAdjusted = gasUsd * scenario.gasMultiplier;
  const liquidityFactor = 1 + scenario.liquidityDelta;
  const priceFactor = 1 + scenario.priceDelta * (Math.random() > 0.5 ? 1 : -1);
  const slippageFactor = scenario.slippageMultiplier;

  const worstCase =
    toMin * liquidityFactor * (1 - scenario.priceDelta) * slippageFactor;
  const bestCase =
    toAmount * liquidityFactor * (1 + scenario.priceDelta) / slippageFactor;
  const expected = toAmount * liquidityFactor;

  return {
    expected: expected.toFixed(6),
    worstCase: Math.max(0, worstCase).toFixed(6),
    bestCase: bestCase.toFixed(6),
    gasCostUSD: gasAdjusted.toFixed(2),
    scenario,
  };
}
