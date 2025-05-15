"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartWrapper from "./ChartWrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ComparisonWrapper from "./ComparisonWrapper";

type Props = {};

const SideInfoWrapper = (props: Props) => {
  const [activeTab, setActiveTab] = useState("chart");

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger
            value="chart"
            className={cn(
              "data-[state=active]:bg-primary/10",
              "data-[state=active]:text-primary",
              "data-[state=active]:shadow-sm"
            )}
          >
            Chart
          </TabsTrigger>
          <TabsTrigger
            value="compare"
            className={cn(
              "data-[state=active]:bg-primary/10",
              "data-[state=active]:text-primary",
              "data-[state=active]:shadow-sm"
            )}
          >
            Compare
          </TabsTrigger>
        </TabsList>

        {/* Fixed height container to prevent jumping */}
        <div className="flex-1 min-h-[500px] relative">
          <TabsContent
            value="chart"
            className="absolute inset-0 mt-0"
            forceMount
            hidden={activeTab !== "chart"}
          >
            <ChartWrapper />
          </TabsContent>

          <TabsContent
            value="compare"
            className="absolute inset-0 mt-0"
            forceMount
            hidden={activeTab !== "compare"}
          >
            <div className="h-full bg-muted/50 rounded-lg border">
              <ComparisonWrapper />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SideInfoWrapper;
