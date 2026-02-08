import Link from "next/link";
import { WalletConnectButton } from "@/components/wallet/connect-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { appName, DEMO_PRESETS } from "@/config";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-semibold">{appName}</span>
        <WalletConnectButton />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Stop flying blind on cross-chain
          </h1>
          <p className="text-lg text-muted-foreground">
            Your $5,000. Your risk. Your call. Know what could go wrong before you bridge.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/simulate?demo=1"
            className={cn(buttonVariants({ size: "lg" }), "text-base")}
          >
            Simulate your bridge
          </Link>
          <Link
            href={DEMO_PRESETS.url.arbitrumToOptimism}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-base")}
          >
            Demo: 2 ETH Arbitrum → Optimism
          </Link>
        </div>

        <div className="flex items-center gap-8 pt-8 text-sm text-muted-foreground">
          <span>LI.FI</span>
          <span>•</span>
          <span>ENS</span>
          <span>•</span>
          <span>Yellow</span>
        </div>
      </main>
    </div>
  );
}
