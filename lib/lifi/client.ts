import { createConfig } from "@lifi/sdk";
import { getLifiConfig } from "@/config";

const { apiKey, integrator, rpcUrls } = getLifiConfig();

createConfig({
  integrator,
  apiKey: apiKey || undefined,
  rpcUrls: Object.keys(rpcUrls).length > 0 ? rpcUrls : undefined,
});
