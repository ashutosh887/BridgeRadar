import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { getEnsRpc } from "@/config";

export async function resolveENS(address: string): Promise<{
  name: string | null;
  avatar: string | null;
}> {
  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(getEnsRpc()),
    });
    const name = await client.getEnsName({ address: address as `0x${string}` });
    const avatar = name ? await client.getEnsAvatar({ name }) : null;
    return { name, avatar };
  } catch {
    return { name: null, avatar: null };
  }
}
