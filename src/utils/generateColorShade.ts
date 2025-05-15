import { converter, formatHex, formatRgb, interpolate, oklch } from "culori";

export function getHexFromTwVariable(twVariable: string) {
  // Remove any 'bg-' or 'text-' prefixes
  const cleanVar = twVariable.replace(
    /^(bg|text|border|fill|stroke|ring)-/,
    ""
  );

  // Create a temporary element to compute the style
  const el = document.createElement("div");
  el.className = `bg-${cleanVar} invisible absolute`;
  document.body.appendChild(el);

  // Get computed color
  const color = getComputedStyle(el).backgroundColor;
  const rgb_converter = converter("rgb");
  const rgb_color = formatRgb(rgb_converter(color));
  const rgbshades = generateColorShades(rgb_color, 3);

  const Shades = generateShades(color, 3);
  return rgbshades;
}

function generateShades(baseOklch: string, count: number): string[] {
  const scale = interpolate([
    oklch("oklch(0.3 0.1 185)"),
    oklch(baseOklch),
    oklch("oklch(0.9 0.1 185)"),
  ]);

  return Array.from({ length: count }, (_, i) =>
    formatHex(scale(i / (count - 1)))
  );
}

/**
 * Generates n shades of a base color
 * @param baseColor - Hex color string (e.g., "#3b82f6")
 * @param n - Number of shades to generate
 * @param intensityRange - How much to vary the shades (0-1, default 0.5)
 * @returns Array of hex color strings
 */
function generateColorShades(
  baseColor: string,
  n: number,
  intensityRange: number = 0.3
): string[] {
  console.log(baseColor);

  const rgb_colors = baseColor
    .replace("rgb", "")
    .trim()
    .replace("(", "")
    .replace(")", "")
    .split(",");

  const trimed = rgb_colors.map((n) => n.trim());

  // Parse the base color into RGB components
  const r = parseInt(trimed[0], 16);
  const g = parseInt(trimed[1], 16);
  const b = parseInt(trimed[2], 16);

  console.log(r, g, b);

  // Calculate min/max bounds for variation
  const minFactor = 1 - intensityRange;
  const maxFactor = 1 + intensityRange;
  const step = (maxFactor - minFactor) / (n - 1);

  // Generate each shade
  const shades: string[] = [];
  for (let i = 0; i < n; i++) {
    const factor = minFactor + step * i;

    // Calculate new RGB values
    const nr = Math.round(Math.min(255, Math.max(0, r * factor)));
    const ng = Math.round(Math.min(255, Math.max(0, g * factor)));
    const nb = Math.round(Math.min(255, Math.max(0, b * factor)));

    // Convert back to hex
    const shade = `#${nr.toString(16).padStart(2, "0")}${ng
      .toString(16)
      .padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
    shades.push(shade);
  }

  return shades;
}
