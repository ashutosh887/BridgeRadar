"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import { TransactionInput, getRouteParams } from "@/components/simulation/TransactionInput";
import { RouteComparison } from "@/components/simulation/RouteComparison";
import { StressTestPanel } from "@/components/simulation/StressTestPanel";
import { RouteExplanation } from "@/components/simulation/RouteExplanation";
import { PreflightChecklist } from "@/components/simulation/PreflightChecklist";
import { WalletConnectButton } from "@/components/wallet/connect-button";
import { WalletProfile } from "@/components/wallet/WalletProfile";
import { useRoutes } from "@/hooks/useRoutes";
import { useRiskScore } from "@/hooks/useRiskScore";
import { useSimulation } from "@/hooks/useSimulation";
import type { TransactionInputValues } from "@/components/simulation/TransactionInput";
import type { RiskScore } from "@/lib/risk/types";
import type { SimulateResult } from "@/lib/simulation/stress-test";
import { DEMO_PRESETS } from "@/config";
import Link from "next/link";

export default function SimulatePage() {
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const [params, setParams] = useState<ReturnType<typeof getRouteParams> | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const routesQuery = useRoutes(params);
  const routes = routesQuery.data?.routes ?? [];
  const riskScoreMutation = useRiskScore();
  const simulationMutation = useSimulation();

  const [riskScores, setRiskScores] = useState<Record<string, RiskScore>>({});
  const [simulationResult, setSimulationResult] = useState<SimulateResult | null>(null);

  const selectedRoute = selectedRouteId
    ? routes.find((r) => r.id === selectedRouteId)
    : routes[0];

  const computeRiskScores = useCallback(async () => {
    const scores: Record<string, RiskScore> = {};
    for (const route of routes) {
      const bridgeNames = [...new Set(route.steps.map((s) => s.tool).filter(Boolean))];
      const duration = route.steps.reduce(
        (acc, s) => acc + (s.estimate?.executionDuration ?? 0),
        0
      );
      try {
        const score = await riskScoreMutation.mutateAsync({
          routeId: route.id,
          bridgeNames,
          fromAmountUSD: route.fromAmountUSD,
          toAmountMin: route.toAmountMin,
          toAmount: route.toAmount,
          gasCostUSD: route.gasCostUSD,
          executionDuration: duration,
        });
        scores[route.id] = score;
      } catch {
        scores[route.id] = {
          score: 50,
          grade: "C",
          warnings: ["Risk analysis unavailable"],
          breakdown: { security: 50, liquidity: 50, time: 50, cost: 50 },
        };
      }
    }
    setRiskScores(scores);
    setSelectedRouteId((prev) => (prev ? prev : routes[0]?.id ?? null));
  }, [routes, riskScoreMutation]);

  useEffect(() => {
    if (routes.length > 0 && Object.keys(riskScores).length === 0) {
      computeRiskScores();
    }
  }, [routes, riskScores, computeRiskScores]);

  const handleFormSubmit = (values: TransactionInputValues) => {
    const p = getRouteParams(values, address);
    setParams(p);
    setRiskScores({});
    setSimulationResult(null);
    setSelectedRouteId(null);
  };

  const demoValues = searchParams.get("demo")
    ? {
        fromChainId: Number(searchParams.get("from") ?? DEMO_PRESETS.default.fromChainId),
        toChainId: Number(searchParams.get("to") ?? DEMO_PRESETS.default.toChainId),
        fromAmount: searchParams.get("amount") ?? DEMO_PRESETS.default.fromAmount,
      }
    : undefined;

  useEffect(() => {
    if (demoValues && !params) {
      const p = getRouteParams(demoValues, address);
      setParams(p);
    }
  }, [searchParams, params, address]);

  const handleSimulate = useCallback(
    async (scenarioId: string) => {
      if (!selectedRoute) return;
      try {
        const res = await simulationMutation.mutateAsync({
          input: {
            toAmount: selectedRoute.toAmount,
            toAmountMin: selectedRoute.toAmountMin,
            gasCostUSD: selectedRoute.gasCostUSD,
            fromAmountUSD: selectedRoute.fromAmountUSD,
          },
          scenarioId,
        });
        setSimulationResult(res);
      } catch {
        setSimulationResult(null);
      }
    },
    [selectedRoute, simulationMutation]
  );


  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 gap-4">
          <Link href="/" className="font-semibold">
            BridgeRadar
          </Link>
          <div className="flex items-center gap-2">
            <WalletProfile />
            <WalletConnectButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Simulate your bridge</h1>
          <p className="text-muted-foreground">
            Know what could go wrong before you bridge
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <TransactionInput
              onSubmit={handleFormSubmit}
              isLoading={routesQuery.isFetching}
              defaultValues={demoValues ?? DEMO_PRESETS.default}
            />
            <PreflightChecklist
              riskScore={selectedRoute ? riskScores[selectedRoute.id] : null}
              hasRoutes={routes.length > 0}
              hasRiskData={Object.keys(riskScores).length > 0}
            />
          </aside>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-sm font-medium">Routes</h2>
              <RouteComparison
                routes={routes}
                riskScores={riskScores}
                selectedRouteId={selectedRouteId ?? undefined}
                onSelectRoute={setSelectedRouteId}
                isLoading={routesQuery.isFetching}
                error={routesQuery.error as Error | undefined}
                onRetry={() => routesQuery.refetch()}
              />
            </section>

            {selectedRoute && riskScores[selectedRoute.id] && (
              <div className="space-y-2">
                <RouteExplanation
                  bridgeNames={[...new Set(selectedRoute.steps.map((s) => s.tool).filter(Boolean))]}
                  riskScore={riskScores[selectedRoute.id]}
                  toAmount={selectedRoute.toAmount}
                />
              </div>
            )}
            {selectedRoute && (
              <StressTestPanel
                route={selectedRoute}
                onSimulate={handleSimulate}
                result={simulationResult}
                isLoading={simulationMutation.isPending}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
