"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHAINS, NATIVE_TOKEN, DEMO_PRESETS } from "@/config";

const schema = z.object({
  fromChainId: z.number(),
  toChainId: z.number(),
  fromAmount: z
    .string()
    .min(1, "Enter amount")
    .refine((v) => !Number.isNaN(parseFloat(v)) && parseFloat(v) > 0, "Enter a valid amount"),
  slippageTolerance: z.number().min(0.1).max(50).optional(),
});

export type TransactionInputValues = z.infer<typeof schema>;

interface TransactionInputProps {
  onSubmit: (values: TransactionInputValues) => void;
  isLoading?: boolean;
  defaultValues?: Partial<TransactionInputValues>;
}

export function TransactionInput({
  onSubmit,
  isLoading,
  defaultValues,
}: TransactionInputProps) {
  const form = useForm<TransactionInputValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromChainId: 42161,
      toChainId: 10,
      fromAmount: "2",
      slippageTolerance: 1,
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-xl border border-white/10 bg-zinc-900/50 p-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">From</label>
          <Select
            value={String(form.watch("fromChainId"))}
            onValueChange={(v) => form.setValue("fromChainId", Number(v))}
          >
            <SelectTrigger className="w-full h-10 border-white/10 bg-zinc-900 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHAINS.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  <div className="flex items-center gap-2">
                    {c.logo && <img src={c.logo} alt="" className="size-4 rounded-full" />}
                    {c.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">To</label>
          <Select
            value={String(form.watch("toChainId"))}
            onValueChange={(v) => form.setValue("toChainId", Number(v))}
          >
            <SelectTrigger className="w-full h-10 border-white/10 bg-zinc-900 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHAINS.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  <div className="flex items-center gap-2">
                    {c.logo && <img src={c.logo} alt="" className="size-4 rounded-full" />}
                    {c.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-xs text-zinc-400 mb-1 block">Amount</label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="0.0"
            className="h-10 border-white/10 bg-zinc-900 text-white"
            {...form.register("fromAmount")}
          />
          <div className="flex gap-1">
            {DEMO_PRESETS.amount.map((a) => (
              <Button
                key={a}
                type="button"
                variant="outline"
                size="sm"
                className="h-10 text-xs border-white/20 text-zinc-300 hover:bg-white/10"
                onClick={() => form.setValue("fromAmount", a)}
              >
                {a}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs text-zinc-400 mb-1 block">Slippage</label>
        <div className="flex gap-1">
          {[0.5, 1, 2, 3].map((p) => (
            <Button
              key={p}
              type="button"
              variant="outline"
              size="sm"
              className={`h-8 text-xs flex-1 ${form.watch("slippageTolerance") === p ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" : "border-white/20 text-zinc-300 hover:bg-white/10"}`}
              onClick={() => form.setValue("slippageTolerance", p)}
            >
              {p}%
            </Button>
          ))}
        </div>
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 bg-emerald-500 text-white hover:bg-emerald-400"
      >
        {isLoading ? "Analyzing..." : "Simulate Risk"}
      </Button>
    </form>
  );
}

export function getRouteParams(values: TransactionInputValues, fromAddress?: string) {
  const parsed = parseFloat(values.fromAmount);
  const amount =
    Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed * 1e18) : Math.floor(2 * 1e18);
  const amountWei = BigInt(amount).toString();
  return {
    fromChainId: values.fromChainId,
    toChainId: values.toChainId,
    fromAmount: amountWei,
    fromTokenAddress: NATIVE_TOKEN,
    toTokenAddress: NATIVE_TOKEN,
    fromAddress,
    slippageTolerance: values.slippageTolerance ?? 1,
  };
}
