import { NextResponse } from "next/server";
import { fetchRoutes } from "@/lib/lifi/routes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromChainId = searchParams.get("fromChainId");
  const toChainId = searchParams.get("toChainId");
  const fromAmount = searchParams.get("fromAmount");
  const fromTokenAddress = searchParams.get("fromTokenAddress");
  const toTokenAddress = searchParams.get("toTokenAddress");
  const fromAddress = searchParams.get("fromAddress") ?? undefined;

  if (
    !fromChainId ||
    !toChainId ||
    !fromAmount ||
    !fromTokenAddress ||
    !toTokenAddress
  ) {
    return NextResponse.json(
      {
        error:
          "Missing required params: fromChainId, toChainId, fromAmount, fromTokenAddress, toTokenAddress",
      },
      { status: 400 }
    );
  }

  try {
    const routes = await fetchRoutes({
      fromChainId: Number(fromChainId),
      toChainId: Number(toChainId),
      fromAmount,
      fromTokenAddress,
      toTokenAddress,
      fromAddress,
    });
    return NextResponse.json(routes);
  } catch (err) {
    console.error("LI.FI getRoutes error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch routes" },
      { status: 500 }
    );
  }
}
