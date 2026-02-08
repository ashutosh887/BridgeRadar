"use client";

import { RouteCard } from "./RouteCard";
import type { RiskScore } from "@/lib/risk/types";

interface Route {
  id: string;
  fromAmount: string;
  toAmount: string;
  toAmountMin: string;
  fromAmountUSD: string;
  toAmountUSD: string;
  gasCostUSD?: string;
  steps: Array<{ tool: string; estimate?: { executionDuration?: number } }>;
}

interface RouteComparisonProps {
  routes: Route[];
  riskScores: Record<string, RiskScore>;
  selectedRouteId?: string;
  onSelectRoute?: (id: string) => void;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function RouteComparison({
  routes,
  riskScores,
  selectedRouteId,
  onSelectRoute,
  isLoading,
  error,
  onRetry,
}: RouteComparisonProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 py-8 text-center">
        <p className="text-sm text-red-400 mb-2">
          {error.message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-medium text-emerald-400 hover:underline"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl bg-zinc-800/50"
          />
        ))}
      </div>
    );
  }

  if (!routes.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 py-12 text-center text-zinc-500">
        Enter amount to see routes
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {routes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          riskScore={riskScores[route.id]}
          isSelected={selectedRouteId === route.id}
          onClick={() => onSelectRoute?.(route.id)}
        />
      ))}
    </div>
  );
}
