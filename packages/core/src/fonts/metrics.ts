/**
 * Font metrics extraction and analysis
 *
 * This module provides utilities for extracting metrics from font files.
 * Note: Full font parsing requires fontkit which is optional.
 * This provides the interface and fallback calculations.
 */

import type { FontMetrics } from '../types';

/**
 * Pre-calculated metrics for common system fonts
 * These are used as fallback bases for metric matching
 */
export const SYSTEM_FONT_METRICS: Record<string, FontMetrics> = {
  Arial: {
    familyName: 'Arial',
    ascent: 1854,
    descent: -434,
    lineGap: 67,
    unitsPerEm: 2048,
    capHeight: 1467,
    xHeight: 1062,
  },
  'Helvetica Neue': {
    familyName: 'Helvetica Neue',
    ascent: 952,
    descent: -213,
    lineGap: 28,
    unitsPerEm: 1000,
    capHeight: 714,
    xHeight: 517,
  },
  Verdana: {
    familyName: 'Verdana',
    ascent: 2059,
    descent: -430,
    lineGap: 0,
    unitsPerEm: 2048,
    capHeight: 1489,
    xHeight: 1117,
  },
  Georgia: {
    familyName: 'Georgia',
    ascent: 1878,
    descent: -449,
    lineGap: 0,
    unitsPerEm: 2048,
    capHeight: 1419,
    xHeight: 986,
  },
  'Times New Roman': {
    familyName: 'Times New Roman',
    ascent: 1825,
    descent: -443,
    lineGap: 87,
    unitsPerEm: 2048,
    capHeight: 1356,
    xHeight: 916,
  },
  'Courier New': {
    familyName: 'Courier New',
    ascent: 1705,
    descent: -615,
    lineGap: 0,
    unitsPerEm: 2048,
    capHeight: 1170,
    xHeight: 846,
  },
  'system-ui': {
    familyName: 'system-ui',
    ascent: 1900,
    descent: -400,
    lineGap: 0,
    unitsPerEm: 2048,
    capHeight: 1450,
    xHeight: 1050,
  },
  '-apple-system': {
    familyName: '-apple-system',
    ascent: 1900,
    descent: -400,
    lineGap: 0,
    unitsPerEm: 2048,
    capHeight: 1450,
    xHeight: 1050,
  },
  'Segoe UI': {
    familyName: 'Segoe UI',
    ascent: 2210,
    descent: -514,
    lineGap: 0,
    unitsPerEm: 2048,
    capHeight: 1434,
    xHeight: 1024,
  },
  Roboto: {
    familyName: 'Roboto',
    ascent: 1900,
    descent: -500,
    lineGap: 0,
    unitsPerEm: 2048,
    capHeight: 1456,
    xHeight: 1082,
  },
};

/**
 * Get metrics for a system font
 */
export function getSystemFontMetrics(fontName: string): FontMetrics | null {
  // Try exact match
  if (fontName in SYSTEM_FONT_METRICS) {
    return SYSTEM_FONT_METRICS[fontName];
  }

  // Try case-insensitive match
  const lowerName = fontName.toLowerCase();
  for (const [name, metrics] of Object.entries(SYSTEM_FONT_METRICS)) {
    if (name.toLowerCase() === lowerName) {
      return metrics;
    }
  }

  // Try partial match
  for (const [name, metrics] of Object.entries(SYSTEM_FONT_METRICS)) {
    if (lowerName.includes(name.toLowerCase()) || name.toLowerCase().includes(lowerName)) {
      return metrics;
    }
  }

  return null;
}

/**
 * Normalize font metrics to a standard units per em
 */
export function normalizeMetrics(
  metrics: FontMetrics,
  targetUnitsPerEm: number = 1000
): FontMetrics {
  const scale = targetUnitsPerEm / metrics.unitsPerEm;

  return {
    ...metrics,
    unitsPerEm: targetUnitsPerEm,
    ascent: Math.round(metrics.ascent * scale),
    descent: Math.round(metrics.descent * scale),
    lineGap: Math.round(metrics.lineGap * scale),
    capHeight: metrics.capHeight ? Math.round(metrics.capHeight * scale) : undefined,
    xHeight: metrics.xHeight ? Math.round(metrics.xHeight * scale) : undefined,
  };
}

/**
 * Calculate the overall line height from metrics
 */
export function calculateLineHeightFromMetrics(metrics: FontMetrics): number {
  const { ascent, descent, lineGap, unitsPerEm } = metrics;
  return (ascent - descent + lineGap) / unitsPerEm;
}

/**
 * Create default metrics for unknown fonts
 * Based on average values from common fonts
 */
export function createDefaultMetrics(familyName: string): FontMetrics {
  return {
    familyName,
    ascent: 900,
    descent: -200,
    lineGap: 0,
    unitsPerEm: 1000,
    capHeight: 700,
    xHeight: 500,
  };
}

/**
 * Estimate if metrics are suitable for a display/heading font
 */
export function isDisplayFont(metrics: FontMetrics): boolean {
  const lineHeight = calculateLineHeightFromMetrics(metrics);
  // Display fonts typically have tighter line height
  return lineHeight < 1.3;
}

/**
 * Estimate if metrics are suitable for body text
 */
export function isBodyFont(metrics: FontMetrics): boolean {
  const lineHeight = calculateLineHeightFromMetrics(metrics);
  // Body fonts typically have more generous line height
  return lineHeight >= 1.2;
}

/**
 * Find the best matching system font based on metrics
 */
export function findBestMatchingFallback(metrics: FontMetrics): string {
  let bestMatch = 'Arial';
  let bestScore = Infinity;

  for (const [name, systemMetrics] of Object.entries(SYSTEM_FONT_METRICS)) {
    // Normalize both to same units per em for comparison
    const normalizedCustom = normalizeMetrics(metrics, 1000);
    const normalizedSystem = normalizeMetrics(systemMetrics, 1000);

    // Calculate difference score
    const ascentDiff = Math.abs(normalizedCustom.ascent - normalizedSystem.ascent);
    const descentDiff = Math.abs(normalizedCustom.descent - normalizedSystem.descent);
    const xHeightDiff = Math.abs(
      (normalizedCustom.xHeight || 500) - (normalizedSystem.xHeight || 500)
    );

    const score = ascentDiff + descentDiff + xHeightDiff * 2; // Weight x-height more

    if (score < bestScore) {
      bestScore = score;
      bestMatch = name;
    }
  }

  return bestMatch;
}
