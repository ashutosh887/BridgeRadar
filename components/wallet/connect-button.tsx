"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WalletConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex h-8 items-center justify-center rounded-md border border-white/20 bg-white/5 px-2.5 text-sm text-white hover:bg-white/10"
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10">
          <DropdownMenuItem onClick={() => disconnect()} className="text-red-400 focus:text-red-400">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
