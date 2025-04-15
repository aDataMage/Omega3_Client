import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KPIs } from "@/types/kpi";
import { SalesOverTime } from "..";

type Props = {};

const KpiCard = (props: KPIs) => {
  return (
    <Card className="w-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="text-md font-semibold">{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-3xl font-bold">{props.value}</h2>
        <p
          className={`font-light ${
            props.percentage_change < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {props.percentage_change}
        </p>
      </CardContent>
      <CardFooter>
        {/* <SalesOverTime 
        data={props.trend_data}
        /> */}
      </CardFooter>
    </Card>
  );
};

export default KpiCard;
