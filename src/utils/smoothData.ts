export function smoothData(data: number[], windowSize = 3): number[] {
  const smoothed = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const avg = data.slice(start, end).reduce((a, b) => a + b, 0) / (end - start);
    smoothed.push(avg);
  }
  return smoothed;
}
