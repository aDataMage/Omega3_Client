import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

const TOTSkelenton = (props: Props) => {
  return (
    <Card className="w-full min-h-60 bg-card shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <Skeleton className="h-10 w-1/2 mb-1" />
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-[150px] w-full rounded-md" />{" "}
        {/* Chart Skeleton */}
      </CardFooter>
    </Card>
  );
};

export default TOTSkelenton;
