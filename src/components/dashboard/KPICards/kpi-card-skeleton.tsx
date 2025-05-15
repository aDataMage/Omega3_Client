import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardSkeletonProps {
  className?: string;
}

const KpiCardSkeleton = ({ className }: KpiCardSkeletonProps) => {
  return (
    <Card className={cn("w-full shadow-sm", className)} aria-hidden="true">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-2/3 mb-1" /> {/* Title */}
        <Skeleton className="h-3.5 w-1/2" /> {/* Date range */}
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between mb-4">
          <Skeleton className="h-8 w-1/2" /> {/* KPI Value */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
            <Skeleton className="h-4 w-12" /> {/* Percentage */}
          </div>
        </div>

        <div className="mt-3 space-y-2 border-t pt-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-16" /> {/* Previous label */}
            <Skeleton className="h-3.5 w-20" /> {/* Previous value */}
          </div>
          <Skeleton className="h-3 w-28" /> {/* Previous date range */}
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiCardSkeleton;
