import { NextResponse } from "next/server";
import { fetchRoutes } from "@/lib/lifi/routes";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const limit = rateLimit(`routes:${getClientIdentifier(request)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests", retryAfter: limit.retryAfter },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } }
    );
  }
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

  const fromId = Number(fromChainId);
  const toId = Number(toChainId);
  if (isNaN(fromId) || isNaN(toId) || fromId <= 0 || toId <= 0) {
    return NextResponse.json({ error: "Invalid chain IDs" }, { status: 400 });
  }
  if (!/^\d+$/.test(fromAmount) || BigInt(fromAmount) <= BigInt(0)) {
    return NextResponse.json({ error: "Invalid fromAmount" }, { status: 400 });
  }

  try {
    const routes = await fetchRoutes({
      fromChainId: fromId,
      toChainId: toId,
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
