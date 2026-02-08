import { redirect } from "next/navigation";
import { DEMO_SECRET_PATH, DEMO_PRESETS } from "@/config";

export default async function DemoRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const expected = DEMO_SECRET_PATH.replace("/s/", "");
  if (slug !== expected) {
    redirect("/");
  }
  redirect(
    `/simulate?demo=1&amount=${DEMO_PRESETS.default.fromAmount}&from=${DEMO_PRESETS.default.fromChainId}&to=${DEMO_PRESETS.default.toChainId}`
  );
}
