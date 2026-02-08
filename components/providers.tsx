"use client";

import { useEffect, useState } from "react";
import { wagmiAdapter, projectId, appName, appDescription } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, polygon, optimism, arbitrum, base } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";

const queryClient = new QueryClient();

function UrlCleanup() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const had = url.searchParams.has("result_uri") || url.searchParams.has("wc") || url.searchParams.has("connectUri");
    url.searchParams.delete("result_uri");
    url.searchParams.delete("wc");
    url.searchParams.delete("connectUri");
    if (had) window.history.replaceState({}, document.title, url.toString());
  }, []);
  return null;
}

function ModalCloseOnMount() {
  useEffect(() => {
    const timer = setTimeout(() => {
      appkit?.close?.();
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return null;
}

function ModalCloseOnConnect() {
  const [prevConnected, setPrevConnected] = useState(false);
  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    if (isConnected && !prevConnected) {
      appkit?.close?.();
    }
    setPrevConnected(isConnected);
  }, [isConnected, prevConnected]);

  return null;
}

const metadata = {
  name: appName,
  description: appDescription,
  url: process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "https://bridgeradar.vercel.app"),
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

const appkit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, polygon, optimism, arbitrum, base],
  defaultNetwork: mainnet,
  metadata,
  features: { analytics: false, email: false, socials: false },
  enableReconnect: false,
  enableWalletGuide: false,
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
      <UrlCleanup />
      <ModalCloseOnMount />
      <ModalCloseOnConnect />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
