import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function resolveENS(address: string): Promise<{
  name: string | null;
  avatar: string | null;
}> {
  try {
    const name = await client.getEnsName({ address: address as `0x${string}` });
    const avatar = name
      ? await client.getEnsAvatar({ name })
      : null;
    return { name, avatar };
  } catch {
    return { name: null, avatar: null };
  }
}
