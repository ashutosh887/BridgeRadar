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
  fromAmount: z.string().min(1),
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
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">From</label>
          <Select
            value={String(form.watch("fromChainId"))}
            onValueChange={(v) => form.setValue("fromChainId", Number(v))}
          >
            <SelectTrigger className="w-full h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHAINS.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">To</label>
          <Select
            value={String(form.watch("toChainId"))}
            onValueChange={(v) => form.setValue("toChainId", Number(v))}
          >
            <SelectTrigger className="w-full h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHAINS.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="0.0"
            className="h-9"
            {...form.register("fromAmount")}
          />
          <div className="flex gap-1">
            {DEMO_PRESETS.amount.map((a) => (
              <Button
                key={a}
                type="button"
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                onClick={() => form.setValue("fromAmount", a)}
              >
                {a}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Analyzing..." : "Simulate Risk"}
      </Button>
    </form>
  );
}

export function getRouteParams(values: TransactionInputValues, fromAddress?: string) {
  const amountWei = BigInt(Math.floor(parseFloat(values.fromAmount) * 1e18)).toString();
  return {
    fromChainId: values.fromChainId,
    toChainId: values.toChainId,
    fromAmount: amountWei,
    fromTokenAddress: NATIVE_TOKEN,
    toTokenAddress: NATIVE_TOKEN,
    fromAddress,
  };
}
