export interface StressScenario {
  id: string;
  label: string;
  liquidityDelta: number;
  gasMultiplier: number;
  priceDelta: number;
  slippageMultiplier: number;
  description: string;
}

export const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: "baseline",
    label: "Baseline",
    liquidityDelta: 0,
    gasMultiplier: 1,
    priceDelta: 0,
    slippageMultiplier: 1,
    description: "Current market conditions",
  },
  {
    id: "liquidity-drop",
    label: "Liquidity -30%",
    liquidityDelta: -0.3,
    gasMultiplier: 1,
    priceDelta: 0,
    slippageMultiplier: 1.5,
    description: "Liquidity drops 30%",
  },
  {
    id: "gas-spike",
    label: "Gas 3x",
    liquidityDelta: 0,
    gasMultiplier: 3,
    priceDelta: 0,
    slippageMultiplier: 1,
    description: "Gas costs triple",
  },
  {
    id: "price-volatility",
    label: "Price ±5%",
    liquidityDelta: 0,
    gasMultiplier: 1,
    priceDelta: 0.05,
    slippageMultiplier: 1.5,
    description: "5% price movement",
  },
  {
    id: "disaster",
    label: "Disaster",
    liquidityDelta: -0.3,
    gasMultiplier: 3,
    priceDelta: 0.05,
    slippageMultiplier: 2,
    description: "Liquidity -30%, gas 3x, price ±5%",
  },
];
