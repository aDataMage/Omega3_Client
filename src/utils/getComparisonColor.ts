// Get color for each comparison key
const getComparisonColor = (
  index: number,
  format: "none" | "bg" | "text" | "multi" = "none"
) => {
  // These are just examples; customize as needed

  if (format == "multi") {
    const standardColors = ["chart-3", "chart-9", "chart-5"];
    return standardColors[index % standardColors.length];
  }
  if (format == "text") {
    const standardColors = ["text-chart-3", "text-chart-9", "text-chart-5"];
    return standardColors[index % standardColors.length];
  }
  if (format == "bg") {
    const standardColors = ["bg-chart-3", "bg-chart-9", "bg-chart-5"];
    return standardColors[index % standardColors.length];
  }

  const standardColors = [
    "var(--color-chart-3)",
    "var(--color-chart-9)",
    "var(--color-chart-5)",
  ];
  return standardColors[index % standardColors.length];
};

export default getComparisonColor;
