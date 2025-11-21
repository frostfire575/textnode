/**
 * Fallback font calculation
 *
 * Calculates CSS font-face overrides to match custom font metrics,
 * preventing Cumulative Layout Shift (CLS) during font loading.
 */

import type { FontMetrics, FallbackAdjustments, FallbackConfig } from '../types';
import { getSystemFontMetrics, normalizeMetrics, createDefaultMetrics } from './metrics';

/**
 * Calculate fallback font adjustments from font metrics
 *
 * These CSS properties adjust the fallback font to match the
 * custom font's metrics as closely as possible:
 * - ascent-override: Adjusts the space above the baseline
 * - descent-override: Adjusts the space below the baseline
 * - line-gap-override: Adjusts the space between lines
 * - size-adjust: Scales the overall font size
 *
 * @param customMetrics - Metrics from the custom font
 * @param fallbackFont - System font to use as fallback
 * @returns CSS override values
 */
export function calculateFallbackAdjustments(
  customMetrics: FontMetrics,
  fallbackFont: string
): FallbackAdjustments {
  const fallbackMetrics = getSystemFontMetrics(fallbackFont) || createDefaultMetrics(fallbackFont);

  // Normalize both to same scale for accurate comparison
  const normalized = normalizeMetrics(customMetrics, 1000);
  const normalizedFallback = normalizeMetrics(fallbackMetrics, 1000);

  // Calculate overrides as percentages
  // These values tell the browser how to adjust the fallback font
  const ascentOverride = (Math.abs(normalized.ascent) / 1000) * 100;
  const descentOverride = (Math.abs(normalized.descent) / 1000) * 100;
  const lineGapOverride = (normalized.lineGap / 1000) * 100;

  // Calculate size-adjust to match x-height (most important for visual matching)
  // If custom font has larger x-height, fallback needs to be scaled down and vice versa
  const customXHeight = normalized.xHeight || 500;
  const fallbackXHeight = normalizedFallback.xHeight || 500;
  const sizeAdjust = (customXHeight / fallbackXHeight) * 100;

  return {
    ascentOverride: `${ascentOverride.toFixed(2)}%`,
    descentOverride: `${descentOverride.toFixed(2)}%`,
    lineGapOverride: `${lineGapOverride.toFixed(2)}%`,
    sizeAdjust: `${sizeAdjust.toFixed(2)}%`,
  };
}

/**
 * Calculate adjustments from a FallbackConfig
 */
export function calculateAdjustmentsFromConfig(
  customMetrics: FontMetrics,
  config: FallbackConfig
): FallbackAdjustments {
  // If manual overrides are provided, use them
  if (
    config.ascentOverride ||
    config.descentOverride ||
    config.lineGapOverride ||
    config.sizeAdjust
  ) {
    const auto = config.auto
      ? calculateFallbackAdjustments(customMetrics, config.font)
      : {
          ascentOverride: '100%',
          descentOverride: '20%',
          lineGapOverride: '0%',
          sizeAdjust: '100%',
        };

    return {
      ascentOverride: config.ascentOverride || auto.ascentOverride,
      descentOverride: config.descentOverride || auto.descentOverride,
      lineGapOverride: config.lineGapOverride || auto.lineGapOverride,
      sizeAdjust: config.sizeAdjust || auto.sizeAdjust,
    };
  }

  // Auto calculate if enabled
  if (config.auto) {
    return calculateFallbackAdjustments(customMetrics, config.font);
  }

  // Return identity values (no adjustment)
  return {
    ascentOverride: '100%',
    descentOverride: '20%',
    lineGapOverride: '0%',
    sizeAdjust: '100%',
  };
}

/**
 * Estimate CLS improvement from using fallback adjustments
 *
 * Returns an estimated CLS score reduction
 * Lower is better (0 = no shift)
 */
export function estimateCLSImprovement(
  customMetrics: FontMetrics,
  fallbackFont: string
): { before: number; after: number } {
  const fallbackMetrics = getSystemFontMetrics(fallbackFont);
  if (!fallbackMetrics) {
    return { before: 0.15, after: 0.15 };
  }

  // Normalize for comparison
  const normalized = normalizeMetrics(customMetrics, 1000);
  const normalizedFallback = normalizeMetrics(fallbackMetrics, 1000);

  // Calculate line height differences
  const customLineHeight =
    (normalized.ascent - normalized.descent + normalized.lineGap) / 1000;
  const fallbackLineHeight =
    (normalizedFallback.ascent - normalizedFallback.descent + normalizedFallback.lineGap) / 1000;

  // Estimate CLS from line height difference
  // CLS is roughly proportional to the height change
  const heightDiff = Math.abs(customLineHeight - fallbackLineHeight);
  const beforeCLS = Math.min(0.25, heightDiff * 0.5);

  // With adjustments, CLS should be near zero
  // Small residual from width differences
  const afterCLS = Math.min(0.05, heightDiff * 0.05);

  return {
    before: Math.round(beforeCLS * 100) / 100,
    after: Math.round(afterCLS * 100) / 100,
  };
}

/**
 * Get recommended fallback font for a given font category
 */
export function getRecommendedFallback(
  category: 'sans-serif' | 'serif' | 'monospace' | 'display'
): string {
  switch (category) {
    case 'sans-serif':
      return 'Arial';
    case 'serif':
      return 'Georgia';
    case 'monospace':
      return 'Courier New';
    case 'display':
      return 'Arial';
    default:
      return 'Arial';
  }
}

/**
 * Validate fallback adjustments are within reasonable bounds
 */
export function validateAdjustments(adjustments: FallbackAdjustments): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  const parsePercent = (s: string) => parseFloat(s.replace('%', ''));

  const ascent = parsePercent(adjustments.ascentOverride);
  const descent = parsePercent(adjustments.descentOverride);
  const sizeAdjust = parsePercent(adjustments.sizeAdjust);

  if (ascent > 150 || ascent < 50) {
    warnings.push(`ascent-override (${ascent}%) is outside normal range (50-150%)`);
  }

  if (descent > 50 || descent < 5) {
    warnings.push(`descent-override (${descent}%) is outside normal range (5-50%)`);
  }

  if (sizeAdjust > 130 || sizeAdjust < 70) {
    warnings.push(`size-adjust (${sizeAdjust}%) is outside normal range (70-130%)`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
