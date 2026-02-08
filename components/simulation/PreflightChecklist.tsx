"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskScore } from "@/lib/risk/types";

interface ChecklistItem {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
}

interface PreflightChecklistProps {
  riskScore?: RiskScore | null;
  hasRoutes: boolean;
  hasRiskData: boolean;
}

function getItems(riskScore: RiskScore | null, hasRoutes: boolean, hasRiskData: boolean): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  items.push({
    id: "routes",
    label: "Routes found",
    status: hasRoutes ? "pass" : "fail",
  });

  if (hasRiskData && riskScore) {
    items.push({
      id: "grade",
      label: `Risk grade ${riskScore.grade}`,
      status: riskScore.grade === "A" || riskScore.grade === "B" ? "pass" : riskScore.grade === "C" ? "warn" : "fail",
    });
    items.push({
      id: "warnings",
      label: riskScore.warnings.length === 0 ? "No critical warnings" : `${riskScore.warnings.length} warning(s)`,
      status: riskScore.warnings.length === 0 ? "pass" : riskScore.warnings.length <= 2 ? "warn" : "fail",
    });
    items.push({
      id: "security",
      label: `Security score ${riskScore.breakdown.security}/100`,
      status: riskScore.breakdown.security >= 70 ? "pass" : riskScore.breakdown.security >= 50 ? "warn" : "fail",
    });
    items.push({
      id: "liquidity",
      label: `Liquidity score ${riskScore.breakdown.liquidity}/100`,
      status: riskScore.breakdown.liquidity >= 70 ? "pass" : riskScore.breakdown.liquidity >= 50 ? "warn" : "fail",
    });
  } else if (hasRoutes && !hasRiskData) {
    items.push({
      id: "analyzing",
      label: "Analyzing risk...",
      status: "warn",
    });
  }

  return items;
}

const StatusIcon = ({ status }: { status: "pass" | "warn" | "fail" }) => {
  switch (status) {
    case "pass":
      return <CheckCircle2 className="size-4 text-risk-safe" />;
    case "warn":
      return <AlertCircle className="size-4 text-risk-moderate" />;
    case "fail":
      return <XCircle className="size-4 text-risk-high" />;
  }
};

export function PreflightChecklist({
  riskScore,
  hasRoutes,
  hasRiskData,
}: PreflightChecklistProps) {
  const items = getItems(riskScore ?? null, hasRoutes, hasRiskData);

  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-lg border bg-card p-4"
    >
      <h3 className="mb-3 text-sm font-medium">Before you bridge</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className={cn(
              "flex items-center gap-2 text-sm",
              item.status === "fail" && "text-risk-high",
              item.status === "warn" && "text-risk-moderate"
            )}
          >
            <StatusIcon status={item.status} />
            <span>{item.label}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
