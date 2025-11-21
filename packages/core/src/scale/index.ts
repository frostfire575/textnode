/**
 * Type scale module
 *
 * Provides utilities for calculating and working with typography scales.
 */

import type { ScaleConfig, ComputedScale, CustomScaleConfig } from '../types';
import { calculateModularScale } from './modular';
import { calculateFixedScale, getDefaultFixedScale } from './fixed';
import { calculateFluidScale } from './fluid';

export {
  // Modular scale
  calculateModularScale,
  calculateModularStep,
  calculateModularScaleRange,
  NAMED_RATIOS,
  getRatioName,
} from './modular';

export {
  // Fixed scale
  calculateFixedScale,
  createFixedScaleFromArray,
  getDefaultFixedScale,
  mergeFixedScale,
} from './fixed';

export {
  // Fluid scale
  calculateFluidScale,
  calculateFluidSize,
  calculateFluidValue,
  getFluidSizeAtViewport,
  parseClampExpression,
} from './fluid';

/**
 * Calculate scale values based on configuration
 *
 * @param config - Scale configuration (modular, fixed, fluid, or custom)
 * @returns Computed scale values
 */
export function calculateScale(config: ScaleConfig): ComputedScale {
  switch (config.type) {
    case 'modular':
      return calculateModularScale(config);

    case 'fixed':
      return calculateFixedScale(config);

    case 'fluid':
      return calculateFluidScale(config);

    case 'custom':
      return { ...(config as CustomScaleConfig).values };

    default:
      console.warn(`Unknown scale type, using default fixed scale`);
      return calculateFixedScale(getDefaultFixedScale());
  }
}

/**
 * Get a specific value from computed scale
 *
 * @param scale - Computed scale values
 * @param key - Scale key (e.g., 'base', 'lg', '2xl')
 * @param fallback - Fallback value if key not found
 * @returns Scale value (number for fixed/modular, string for fluid)
 */
export function getScaleValue(
  scale: ComputedScale,
  key: string,
  fallback?: number | string
): number | string {
  if (key in scale) {
    return scale[key];
  }

  // Try to parse as a number (direct pixel value)
  const numValue = parseFloat(key);
  if (!isNaN(numValue)) {
    return numValue;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  console.warn(`Scale key "${key}" not found, using base`);
  return scale['base'] ?? 16;
}

/**
 * Convert scale value to CSS string
 *
 * @param value - Scale value (number or string)
 * @param unit - CSS unit for number values
 * @returns CSS value string
 */
export function scaleValueToCSS(
  value: number | string,
  unit: 'px' | 'rem' | 'em' = 'px'
): string {
  if (typeof value === 'string') {
    // Already a CSS value (fluid clamp() or custom)
    return value;
  }

  switch (unit) {
    case 'rem':
      return `${value / 16}rem`;
    case 'em':
      return `${value}em`;
    case 'px':
    default:
      return `${value}px`;
  }
}

/**
 * Get all scale keys from a computed scale
 */
export function getScaleKeys(scale: ComputedScale): string[] {
  return Object.keys(scale);
}

/**
 * Check if a scale uses fluid (responsive) values
 */
export function isFluidScale(scale: ComputedScale): boolean {
  const values = Object.values(scale);
  return values.some(
    (v) => typeof v === 'string' && v.includes('clamp(')
  );
}

/**
 * Convert a scale to pixel values (for non-fluid scales)
 */
export function scaleToPixels(scale: ComputedScale): Record<string, number> {
  const result: Record<string, number> = {};

  for (const [key, value] of Object.entries(scale)) {
    if (typeof value === 'number') {
      result[key] = value;
    } else if (typeof value === 'string') {
      // Try to extract pixel value
      const match = value.match(/^(\d+(?:\.\d+)?)(px)?$/);
      if (match) {
        result[key] = parseFloat(match[1]);
      }
    }
  }

  return result;
}
