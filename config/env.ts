const ENV = {
  NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "",
  LIFI_API_KEY: process.env.LIFI_API_KEY ?? "",
  LIFI_INTEGRATOR: process.env.LIFI_INTEGRATOR ?? "BridgeRadar",
  RPC_MAINNET: process.env.NEXT_PUBLIC_MAINNET_RPC ?? "",
  RPC_ARBITRUM: process.env.NEXT_PUBLIC_ARBITRUM_RPC ?? "",
  RPC_OPTIMISM: process.env.NEXT_PUBLIC_OPTIMISM_RPC ?? "",
  RPC_POLYGON: process.env.NEXT_PUBLIC_POLYGON_RPC ?? "",
  RPC_BASE: process.env.NEXT_PUBLIC_BASE_RPC ?? "",
} as const;

export function getRpcUrls(): Record<number, string[]> {
  const urls: Record<number, string[]> = {};
  if (ENV.RPC_MAINNET) urls[1] = [ENV.RPC_MAINNET];
  if (ENV.RPC_ARBITRUM) urls[42161] = [ENV.RPC_ARBITRUM];
  if (ENV.RPC_OPTIMISM) urls[10] = [ENV.RPC_OPTIMISM];
  if (ENV.RPC_POLYGON) urls[137] = [ENV.RPC_POLYGON];
  if (ENV.RPC_BASE) urls[8453] = [ENV.RPC_BASE];
  return urls;
}

export function getLifiConfig() {
  return {
    apiKey: ENV.LIFI_API_KEY || undefined,
    integrator: ENV.LIFI_INTEGRATOR,
    rpcUrls: getRpcUrls(),
  };
}

export function getEnsRpc(): string {
  return ENV.RPC_MAINNET || "https://eth.llamarpc.com";
}

export const env = ENV;
