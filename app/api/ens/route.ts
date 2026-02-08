import { NextResponse } from "next/server";
import { resolveENS } from "@/lib/ens/resolve";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }
  try {
    const { name, avatar } = await resolveENS(address);
    return NextResponse.json({ name, avatar });
  } catch (err) {
    console.error("ENS resolve error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "ENS resolution failed" },
      { status: 500 }
    );
  }
}
