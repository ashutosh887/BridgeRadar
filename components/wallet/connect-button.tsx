"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react-core";
import { Button } from "@/components/ui/button";

export function WalletConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  if (isConnected && address) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => open()}
        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={() => open()}
      className="bg-emerald-500 text-white hover:bg-emerald-400"
    >
      Connect
    </Button>
  );
}
