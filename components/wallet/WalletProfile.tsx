"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import Image from "next/image";

export function WalletProfile() {
  const { address } = useAccount();
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
    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
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
      <div className="flex flex-col">
        <span className="text-sm font-medium">{displayName}</span>
        <span className="text-xs text-muted-foreground">
          {history?.isNew
            ? "New wallet — no history"
            : `${history?.bridges ?? 0} bridges, ${history?.failures ?? 0} failures`}
        </span>
      </div>
    </div>
  );
}
