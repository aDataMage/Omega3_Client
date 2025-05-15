/**
 * Formats a numeric value according to specified type
 * @param value - The numeric value to format
 * @param formatType - The type of formatting to apply ('currency' | 'integer' | 'percent')
 * @param options - Optional formatting configuration
 * @returns Formatted string
 */
export function formatValue(
  value: number,
  formatType: "currency" | "integer" | "percent",
  options: {
    decimalPlaces?: number;
    decimalSeparator?: string;
    thousandSeparator?: string;
    currencySymbol?: string;
    compact?: boolean; // Whether to use compact notation (K/M) for large numbers
  } = {}
): string {
  const {
    decimalPlaces = 2,
    decimalSeparator = ".",
    thousandSeparator = ",",
    currencySymbol = "$",
    compact = true,
  } = options;

  // Handle NaN/undefined cases
  if (isNaN(value)) {
    return formatType === "percent" ? "0%" : `${currencySymbol}0`;
  }

  // Apply compact notation if enabled and value is large enough
  if (compact && formatType === "currency" && Math.abs(value) >= 1000) {
    const absValue = Math.abs(value);
    let divisor, suffix;

    if (absValue >= 1_000_000_000) {
      divisor = 1_000_000_000;
      suffix = "B";
    } else if (absValue >= 1_000_000) {
      divisor = 1_000_000;
      suffix = "M";
    } else {
      divisor = 1_000;
      suffix = "K";
    }

    const compactValue = value / divisor;
    return `${currencySymbol}${compactValue.toFixed(decimalPlaces)}${suffix}`;
  }

  // Format based on type
  switch (formatType) {
    case "currency":
      return formatNumber(
        value,
        decimalPlaces,
        decimalSeparator,
        thousandSeparator,
        currencySymbol
      );

    case "percent":
      return formatNumber(
        value, // Convert decimal to percentage
        decimalPlaces,
        decimalSeparator,
        thousandSeparator,
        "",
        "%"
      );

    case "integer":
      return formatNumber(
        value,
        0, // No decimal places for integers
        decimalSeparator,
        thousandSeparator
      );

    default:
      return formatNumber(
        value,
        decimalPlaces,
        decimalSeparator,
        thousandSeparator
      );
  }
}

/**
 * Helper function that handles the actual number formatting
 */
function formatNumber(
  value: number,
  decimalPlaces: number,
  decimalSeparator: string,
  thousandSeparator: string,
  prefix: string = "",
  suffix: string = ""
): string {
  const parts = value.toFixed(decimalPlaces).split(".");
  let integerPart = parts[0].replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator
  );
  const decimalPart = parts[1] ? decimalSeparator + parts[1] : "";

  return `${prefix}${integerPart}${decimalPart}${suffix}`;
}
