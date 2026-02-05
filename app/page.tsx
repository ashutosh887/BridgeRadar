import { appName, appDescription } from "@/config";
import { WalletConnectButton } from "@/components/wallet/connect-button";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <div className="absolute top-4 right-4">
        <WalletConnectButton />
      </div>
      <h1 className="text-4xl font-bold">{appName}</h1>
      <p className="text-lg text-muted-foreground">{appDescription}</p>
    </div>
  );
}
