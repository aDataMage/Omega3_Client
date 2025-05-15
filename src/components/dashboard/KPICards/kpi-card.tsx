import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { KPIs } from "@/types/kpi";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { formatValue } from "@/utils/formatValue";

type KpiCardProps = {
  active?: boolean;
  kpi: KPIs;
  className?: string;
};

const KpiCard = ({ active = false, kpi, className }: KpiCardProps) => {
  // Parse percentage change once
  const percentageChange = Number.parseFloat(String(kpi.percentage_change));
  const isPositive = percentageChange > 0;
  const isNeutral = percentageChange === 0;

  // Determine styles based on change direction
  const changeColor = isNeutral
    ? "text-muted-foreground"
    : isPositive
    ? "text-emerald-600 dark:text-emerald-500"
    : "text-rose-600 dark:text-rose-500";

  // Choose appropriate icon
  const ChangeIcon = isNeutral ? null : isPositive ? TrendingUp : TrendingDown;
  const formartType =
    kpi.metric_name === "Total Sales" || kpi.metric_name === "Total Profit"
      ? "currency"
      : "integer";

  return (
    <Card
      className={cn(
        "w-full transition-all duration-200 hover:shadow-md",
        active ? "ring-2 ring-primary shadow-md" : "shadow-sm",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          {kpi.metric_name}
        </CardTitle>
        <CardDescription>{kpi.current_date_range.join(" - ")}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            {formatValue(kpi.total_value, formartType)}
          </h2>

          <div
            className={cn("flex items-center gap-1", changeColor)}
            aria-label={`${Math.abs(percentageChange)}% ${
              isPositive ? "increase" : isNeutral ? "no change" : "decrease"
            }`}
          >
            {ChangeIcon && <ChangeIcon className="h-4 w-4" strokeWidth={2.5} />}
            <span className="text-sm font-medium">
              {isPositive && "+"}
              {formatValue(kpi.percentage_change, "percent")}
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-1 border-t pt-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Previous:</span>
            <span className="font-medium">
              {formatValue(kpi.previous_total, formartType)}
            </span>
          </div>
          <div className="text-xs opacity-80">
            {kpi.previous_date_range.join(" - ")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(KpiCard);
