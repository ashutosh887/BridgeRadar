"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";

export function WalletConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  if (isConnected && address) {
    return (
      <Button variant="outline" size="sm" onClick={() => open()}>
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button variant="default" size="sm" onClick={() => open()}>
      Connect
    </Button>
  );
}
