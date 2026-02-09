"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount, useDisconnect } from "wagmi";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WalletProfile() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data } = useQuery({
    queryKey: ["ens", address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`/api/ens?address=${address}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!address,
  });
  const historyQuery = useQuery({
    queryKey: ["wallet-history", address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`/api/wallet-history?address=${address}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!address,
  });

  if (!address) return null;

  const displayName = data?.name ?? `${address.slice(0, 6)}...${address.slice(-4)}`;
  const history = historyQuery.data;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/50 px-3 py-2 hover:bg-zinc-900/70 transition">
        {data?.avatar && (
          <Image
            src={data.avatar}
            alt=""
            width={24}
            height={24}
            className="rounded-full"
            unoptimized
          />
        )}
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium text-white">{displayName}</span>
          <span className="text-xs text-zinc-400">
            {history?.isNew
              ? "New wallet — no history"
              : `${history?.bridges ?? 0} bridges, ${history?.failures ?? 0} failures`}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10">
        <DropdownMenuItem onClick={() => disconnect()} className="text-red-400 focus:text-red-400">
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
