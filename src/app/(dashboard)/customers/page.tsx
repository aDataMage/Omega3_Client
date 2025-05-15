"use client";
import ChartWrapper from "@/components/customers/ChartWrapper";
import KpiCardWrapper from "@/components/customers/KpiCards/KpiCardWrapper";
import SideInfoWrapper from "@/components/customers/SideInfoWrapper";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col gap-14 container items-stretch mx-auto h-auto min-h-auto">
      {/* KPI Cards Section - Added padding and scroll for overflow */}
      <div className="col-span-2 h-full w-full">
        <div className="flex gap-4 justify-between h-full w-full">
          {" "}
          {/* Constrained grid */}
          <KpiCardWrapper />
        </div>
      </div>

      <div className="col-span-3 h-full">
        <SideInfoWrapper />
      </div>
    </div>
  );
};

export default page;
