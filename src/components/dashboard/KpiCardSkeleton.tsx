import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const KpiCardSkeleton = () => {
  return (
    <Card className="w-full min-h-60 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <Skeleton className="h-6 w-1/3 mb-1" /> {/* Title */}
        <Skeleton className="h-4 w-1/4" /> {/* Description */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/3 mb-2" /> {/* KPI Value */}
        <Skeleton className="h-4 w-1/4" /> {/* Percentage Change */}
      </CardContent>
      <CardFooter>
        <Skeleton className="h-[50px] w-full rounded-md" /> {/* Chart Skeleton */}
      </CardFooter>
    </Card>
  );
};

export default KpiCardSkeleton;
