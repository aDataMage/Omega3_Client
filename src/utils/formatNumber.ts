/**
 * Formats a number with thousand separators
 * @param num - The number to format (can be number or string representation)
 * @param options - Optional formatting configuration
 * @returns Formatted string with thousand separators
 */
export function formatNumberWithSeparator(
  num: number | string,
  options: {
    decimalPlaces?: number;
    decimalSeparator?: string;
    thousandSeparator?: string;
  } = {}
): string {
  const {
    decimalPlaces = 2,
    decimalSeparator = ".",
    thousandSeparator = ",",
  } = options;

  // Convert to number if it's a string
  const numberValue = typeof num === "string" ? parseFloat(num) : num;

  // Handle NaN cases
  if (isNaN(numberValue)) {
    return "0";
  }

  // Format the number parts
  const parts = numberValue.toFixed(decimalPlaces).split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1] ? decimalSeparator + parts[1] : "";

  // Add thousand separators
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  return integerPart;
}
