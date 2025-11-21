/**
 * Modular scale calculations
 *
 * A modular scale is based on a ratio that determines the relationship
 * between font sizes. Each step up multiplies by the ratio, each step
 * down divides by the ratio.
 *
 * Common ratios:
 * - 1.067: Minor Second
 * - 1.125: Major Second
 * - 1.2: Minor Third
 * - 1.25: Major Third
 * - 1.333: Perfect Fourth
 * - 1.414: Augmented Fourth
 * - 1.5: Perfect Fifth
 * - 1.618: Golden Ratio
 */

import type { ModularScaleConfig, ComputedScale } from '../types';

/** Named ratios for convenience */
export const NAMED_RATIOS = {
  minorSecond: 1.067,
  majorSecond: 1.125,
  minorThird: 1.2,
  majorThird: 1.25,
  perfectFourth: 1.333,
  augmentedFourth: 1.414,
  perfectFifth: 1.5,
  goldenRatio: 1.618,
} as const;

/** Default scale steps mapping */
const DEFAULT_STEP_NAMES = [
  'xs',   // -2
  'sm',   // -1
  'base', // 0
  'lg',   // 1
  'xl',   // 2
  '2xl',  // 3
  '3xl',  // 4
  '4xl',  // 5
  '5xl',  // 6
  '6xl',  // 7
] as const;

/**
 * Calculate a single modular scale value
 *
 * @param base - Base font size in pixels
 * @param ratio - Scale ratio
 * @param step - Step from base (positive = larger, negative = smaller)
 * @returns Calculated size in pixels
 */
export function calculateModularStep(
  base: number,
  ratio: number,
  step: number
): number {
  return base * Math.pow(ratio, step);
}

/**
 * Calculate modular scale values for standard step names
 *
 * @param config - Modular scale configuration
 * @returns Object with step names mapped to pixel values
 */
export function calculateModularScale(config: ModularScaleConfig): ComputedScale {
  const { base, ratio } = config;
  const scale: ComputedScale = {};

  // Generate scale values
  // xs is -2 steps, sm is -1, base is 0, lg is +1, etc.
  DEFAULT_STEP_NAMES.forEach((name, index) => {
    const step = index - 2; // xs = -2, sm = -1, base = 0, lg = 1, etc.
    scale[name] = Math.round(calculateModularStep(base, ratio, step) * 100) / 100;
  });

  return scale;
}

/**
 * Calculate custom modular scale with specified steps
 *
 * @param base - Base font size in pixels
 * @param ratio - Scale ratio
 * @param stepsUp - Number of steps above base
 * @param stepsDown - Number of steps below base
 * @returns Array of calculated values [smallest to largest]
 */
export function calculateModularScaleRange(
  base: number,
  ratio: number,
  stepsUp: number = 5,
  stepsDown: number = 2
): number[] {
  const values: number[] = [];

  // Add steps below base
  for (let i = stepsDown; i > 0; i--) {
    values.push(calculateModularStep(base, ratio, -i));
  }

  // Add base
  values.push(base);

  // Add steps above base
  for (let i = 1; i <= stepsUp; i++) {
    values.push(calculateModularStep(base, ratio, i));
  }

  return values.map((v) => Math.round(v * 100) / 100);
}

/**
 * Get the ratio name for a given ratio value
 */
export function getRatioName(ratio: number): string | null {
  for (const [name, value] of Object.entries(NAMED_RATIOS)) {
    if (Math.abs(value - ratio) < 0.001) {
      return name;
    }
  }
  return null;
}
