/**
 * Fixed scale implementation
 *
 * A fixed scale uses explicitly defined pixel values for each size.
 * This gives maximum control over typography sizes.
 */

import type { FixedScaleConfig, ComputedScale } from '../types';
import { DEFAULT_FIXED_SCALE_VALUES } from '../config/schema';

/**
 * Calculate fixed scale values
 *
 * Simply returns the provided values, with validation
 *
 * @param config - Fixed scale configuration
 * @returns Object with size names mapped to pixel values
 */
export function calculateFixedScale(config: FixedScaleConfig): ComputedScale {
  const scale: ComputedScale = {};

  for (const [key, value] of Object.entries(config.values)) {
    if (typeof value === 'number' && value > 0) {
      scale[key] = value;
    } else {
      console.warn(`Invalid fixed scale value for "${key}": ${value}`);
    }
  }

  return scale;
}

/**
 * Create a fixed scale from an array of values
 *
 * @param values - Array of pixel values [smallest to largest]
 * @returns Fixed scale configuration
 */
export function createFixedScaleFromArray(values: number[]): FixedScaleConfig {
  const names = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
  const scaleValues: Record<string, number> = {};

  values.forEach((value, index) => {
    if (index < names.length) {
      scaleValues[names[index]] = value;
    } else {
      scaleValues[`${index - 4}xl`] = value;
    }
  });

  return {
    type: 'fixed',
    values: scaleValues,
  };
}

/**
 * Get default fixed scale configuration
 */
export function getDefaultFixedScale(): FixedScaleConfig {
  return {
    type: 'fixed',
    values: { ...DEFAULT_FIXED_SCALE_VALUES },
  };
}

/**
 * Merge custom values with default fixed scale
 *
 * @param customValues - Custom scale values to merge
 * @returns Fixed scale configuration with merged values
 */
export function mergeFixedScale(
  customValues: Record<string, number>
): FixedScaleConfig {
  return {
    type: 'fixed',
    values: {
      ...DEFAULT_FIXED_SCALE_VALUES,
      ...customValues,
    },
  };
}
