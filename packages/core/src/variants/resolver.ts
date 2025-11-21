/**
 * Variant style resolution
 *
 * Resolves variant definitions to computed CSS styles
 * by looking up scale values and font families.
 */

import type {
  VariantDefinition,
  VariantsConfig,
  ComputedVariantStyles,
  ComputedScale,
  FontsConfig,
} from '../types';
import { getScaleValue, scaleValueToCSS } from '../scale';
import { LETTER_SPACING_PRESETS } from '../config/schema';

/**
 * Resolve letter spacing value
 */
function resolveLetterSpacing(
  value: string | undefined
): string | undefined {
  if (!value) return undefined;

  // Check if it's a preset
  if (value in LETTER_SPACING_PRESETS) {
    return LETTER_SPACING_PRESETS[value];
  }

  // Return as-is (already a CSS value)
  return value;
}

/**
 * Resolve font family from fonts config
 */
function resolveFontFamily(
  fontKey: string | undefined,
  fonts: FontsConfig
): string | undefined {
  if (!fontKey) return undefined;

  const font = fonts[fontKey];
  if (!font) {
    console.warn(`Font "${fontKey}" not found in configuration`);
    return undefined;
  }

  // Build font-family string
  const parts = [font.name];

  // Add fallback
  if (font.fallback) {
    parts.push(`${font.name} Fallback`);
    parts.push(font.fallback.font);
  }

  // Add generic fallback based on font name
  const lowerName = font.name.toLowerCase();
  if (lowerName.includes('mono') || lowerName.includes('code')) {
    parts.push('monospace');
  } else if (lowerName.includes('serif') && !lowerName.includes('sans')) {
    parts.push('serif');
  } else {
    parts.push('sans-serif');
  }

  return parts.map((p) => (p.includes(' ') ? `'${p}'` : p)).join(', ');
}

/**
 * Resolve a single variant to computed styles
 */
export function resolveVariant(
  variant: VariantDefinition,
  scale: ComputedScale,
  fonts: FontsConfig
): ComputedVariantStyles {
  const styles: ComputedVariantStyles = {
    fontSize: 16, // Default
  };

  // Resolve font size from scale
  if (typeof variant.fontSize === 'string') {
    const scaleValue = getScaleValue(scale, variant.fontSize);
    styles.fontSize = scaleValueToCSS(scaleValue);
  } else {
    styles.fontSize = `${variant.fontSize}px`;
  }

  // Font weight
  if (variant.fontWeight !== undefined) {
    styles.fontWeight = variant.fontWeight;
  }

  // Line height
  if (variant.lineHeight !== undefined) {
    styles.lineHeight = variant.lineHeight;
  }

  // Font family
  if (variant.fontFamily) {
    styles.fontFamily = resolveFontFamily(variant.fontFamily, fonts);
  }

  // Letter spacing
  if (variant.letterSpacing) {
    styles.letterSpacing = resolveLetterSpacing(variant.letterSpacing);
  }

  // Text transform
  if (variant.textTransform) {
    styles.textTransform = variant.textTransform;
  }

  // Font style
  if (variant.fontStyle) {
    styles.fontStyle = variant.fontStyle;
  }

  return styles;
}

/**
 * Resolve all variants to computed styles
 */
export function resolveAllVariants(
  variants: VariantsConfig,
  scale: ComputedScale,
  fonts: FontsConfig
): Record<string, ComputedVariantStyles> {
  const resolved: Record<string, ComputedVariantStyles> = {};

  for (const [key, variant] of Object.entries(variants)) {
    resolved[key] = resolveVariant(variant, scale, fonts);
  }

  return resolved;
}

/**
 * Convert computed styles to CSS properties object
 */
export function stylesToCSSProperties(
  styles: ComputedVariantStyles
): Record<string, string | number> {
  const css: Record<string, string | number> = {};

  if (styles.fontSize) css.fontSize = styles.fontSize;
  if (styles.fontWeight) css.fontWeight = styles.fontWeight;
  if (styles.lineHeight) css.lineHeight = styles.lineHeight;
  if (styles.fontFamily) css.fontFamily = styles.fontFamily;
  if (styles.letterSpacing) css.letterSpacing = styles.letterSpacing;
  if (styles.textTransform) css.textTransform = styles.textTransform;
  if (styles.fontStyle) css.fontStyle = styles.fontStyle;

  return css;
}

/**
 * Convert computed styles to CSS string
 */
export function stylesToCSSString(styles: ComputedVariantStyles): string {
  const lines: string[] = [];

  if (styles.fontSize) {
    lines.push(`font-size: ${styles.fontSize};`);
  }
  if (styles.fontWeight) {
    lines.push(`font-weight: ${styles.fontWeight};`);
  }
  if (styles.lineHeight) {
    lines.push(`line-height: ${styles.lineHeight};`);
  }
  if (styles.fontFamily) {
    lines.push(`font-family: ${styles.fontFamily};`);
  }
  if (styles.letterSpacing) {
    lines.push(`letter-spacing: ${styles.letterSpacing};`);
  }
  if (styles.textTransform) {
    lines.push(`text-transform: ${styles.textTransform};`);
  }
  if (styles.fontStyle) {
    lines.push(`font-style: ${styles.fontStyle};`);
  }

  return lines.join('\n  ');
}

/**
 * Generate CSS classes for all variants
 */
export function generateVariantClasses(
  variants: VariantsConfig,
  scale: ComputedScale,
  fonts: FontsConfig
): string {
  const resolved = resolveAllVariants(variants, scale, fonts);
  const classes: string[] = [];

  for (const [key, styles] of Object.entries(resolved)) {
    const cssString = stylesToCSSString(styles);
    classes.push(`.text-${key} {\n  ${cssString}\n}`);
  }

  return classes.join('\n\n');
}

/**
 * Merge variant with overrides
 */
export function mergeVariantStyles(
  base: ComputedVariantStyles,
  overrides: Partial<ComputedVariantStyles>
): ComputedVariantStyles {
  return {
    ...base,
    ...Object.fromEntries(
      Object.entries(overrides).filter(([, v]) => v !== undefined)
    ),
  } as ComputedVariantStyles;
}
