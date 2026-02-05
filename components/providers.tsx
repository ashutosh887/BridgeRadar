"use client";

import { wagmiAdapter, projectId, appName, appDescription } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, polygon, optimism, arbitrum, base } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

const metadata = {
  name: appName,
  description: appDescription,
  url: typeof window !== "undefined" ? window.location.origin : "https://bridgeradar.vercel.app",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, polygon, optimism, arbitrum, base],
  defaultNetwork: mainnet,
  metadata,
  features: { analytics: true },
  enableReconnect: false,
});

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
