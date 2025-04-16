"use client";

import React, { useEffect, useRef } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  positiveColor?: string;
  negativeColor?: string;
  animate?: boolean;
}

export default function Sparkline({
  data,
  width = 100,
  height = 30,
  color = "#10B981", // Tailwind emerald-500
  positiveColor = "#10B981",
  negativeColor = "#EF4444",
  animate = true,
}: SparklineProps) {
  const pathRef = useRef<SVGPathElement | null>(null);

  if (!data || data.length < 2) {
    return <svg width={width} height={height} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const step = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * step;
    const y = height - ((val - min) / (max - min)) * height;
    return [x, y];
  });

  const pathData = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");

  const gradientId = `sparkline-gradient-${Math.random()
    .toString(36)
    .substring(2, 8)}`;
  const isTrendingUp = data[data.length - 1] >= data[0];

  useEffect(() => {
    if (animate && pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
      pathRef.current.getBoundingClientRect(); // trigger layout
      pathRef.current.style.transition = "stroke-dashoffset 1s ease-out";
      pathRef.current.style.strokeDashoffset = "0";
    }
  }, [data]);

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="100%" y2="0">
          <stop
            offset="0%"
            stopColor={isTrendingUp ? positiveColor : negativeColor}
          />
          <stop
            offset="100%"
            stopColor={isTrendingUp ? positiveColor : negativeColor}
          />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={pathData}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
      />
    </svg>
  );
}
