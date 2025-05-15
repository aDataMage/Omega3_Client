const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const currentIndex = multiMetricChartData.findIndex(
      (item) => item.name === label
    );

    const isReturns = currentMetric === "Total Returns";
    const colors = isReturns ? INVERTED_COLORS : STANDARD_COLORS;

    return (
      <div className="bg-background p-4 shadow-lg rounded-lg border border-border">
        <p className="font-semibold">{label}</p>
        <div className="space-y-2 mt-2">
          {payload.map((entry: any, index: number) => {
            const momChange = calculateMomChange(
              multiMetricChartData,
              currentIndex,
              entry.dataKey
            );

            // Determine if change is positive/negative based on metric type
            const isPositive =
              momChange !== null
                ? isReturns
                  ? momChange < 0
                  : momChange >= 0
                : true;

            const changeColor = isPositive ? colors.positive : colors.negative;
            const changeSymbol = isPositive ? "↑" : "↓";

            return (
              <div key={`tooltip-${index}`}>
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground">{entry.name}:</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(entry.value, currentMetric)}
                  </span>
                </div>
                {momChange !== null && (
                  <div className="ml-5 text-xs mt-1">
                    <span style={{ color: changeColor }}>
                      {changeSymbol} {Math.abs(momChange).toFixed(1)}% MoM
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};
