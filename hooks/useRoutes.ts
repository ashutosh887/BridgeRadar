"use client";

import { useQuery } from "@tanstack/react-query";
import type { RoutesResponse } from "@lifi/types";

export interface RoutesParams {
  fromChainId: number;
  toChainId: number;
  fromAmount: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  fromAddress?: string;
}

export function useRoutes(params: RoutesParams | null) {
  return useQuery<RoutesResponse>({
    queryKey: ["routes", params],
    queryFn: async () => {
      if (!params) throw new Error("No params");
      const search = new URLSearchParams({
        fromChainId: String(params.fromChainId),
        toChainId: String(params.toChainId),
        fromAmount: params.fromAmount,
        fromTokenAddress: params.fromTokenAddress,
        toTokenAddress: params.toTokenAddress,
      });
      if (params.fromAddress) search.set("fromAddress", params.fromAddress);
      const res = await fetch(`/api/routes?${search}`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    enabled: !!params && !!params.fromAmount && parseFloat(params.fromAmount) > 0,
    retry: 2,
    retryDelay: 1000,
  });
}
