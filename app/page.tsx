import Link from "next/link";
import { WalletConnectButton } from "@/components/wallet/connect-button";
import { appName } from "@/config";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <span className="font-semibold text-white">{appName}</span>
        <WalletConnectButton />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-20">
        <div className="text-center space-y-5 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Stop flying blind on cross-chain
          </h1>
          <p className="text-lg text-zinc-400">
            Your $5,000. Your risk. Your call. Know what could go wrong before you bridge.
          </p>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Others optimize for price. We optimize for NOT getting rekt. See risk scores, stress tests, and pre-flight checks before you bridge.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/simulate"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          >
            Simulate your bridge
          </Link>
          <Link
            href="/simulate?demo=1"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-8 text-base font-medium text-zinc-300 transition hover:bg-white/5 hover:border-white/30"
          >
            Try demo (no wallet)
          </Link>
        </div>

        <div className="flex flex-col items-center gap-6 pt-8">
          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <span>LI.FI</span>
            <span>•</span>
            <span>ENS</span>
            <span>•</span>
            <span>Yellow</span>
          </div>
          <Link
            href="https://li.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-emerald-400 transition"
          >
            Execute via LI.FI →
          </Link>
        </div>
      </main>
    </div>
  );
}
