export const DEMO_PRESETS = {
  amount: ["0.1", "1", "2", "10"] as const,
  default: {
    fromChainId: 42161,
    toChainId: 10,
    fromAmount: "2",
  },
  url: {
    base: "/simulate?demo=1",
    arbitrumToOptimism: "/simulate?demo=1&amount=2&from=42161&to=10",
  },
} as const;

export const DEMO_SECRET_PATH = "/s/b7x9k2";
