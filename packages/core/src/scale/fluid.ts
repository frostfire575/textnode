/**
 * Fluid typography scale implementation
 *
 * Fluid typography uses CSS clamp() to create responsive font sizes
 * that scale smoothly between minimum and maximum viewport widths.
 *
 * Formula: clamp(minSize, preferredSize, maxSize)
 * Where preferredSize = minSize + (maxSize - minSize) * ((100vw - minVw) / (maxVw - minVw))
 *
 * This can be simplified to: clamp(minRem, calc(minRem + deltaRem * slope), maxRem)
 * Where slope = (100vw - minVwRem) / (maxVwRem - minVwRem)
 */

import type { FluidScaleConfig, ComputedScale } from '../types';

/** Default fluid scale step names */
const DEFAULT_STEP_NAMES = [
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
] as const;

/** Base multipliers for each step (relative to base size) */
const STEP_MULTIPLIERS: Record<string, number> = {
  xs: 0.75,
  sm: 0.875,
  base: 1,
  lg: 1.125,
  xl: 1.25,
  '2xl': 1.5,
  '3xl': 1.875,
  '4xl': 2.25,
  '5xl': 3,
  '6xl': 3.75,
};

/**
 * Calculate a fluid font size value using CSS clamp()
 *
 * @param minSize - Minimum font size in pixels
 * @param maxSize - Maximum font size in pixels
 * @param minViewport - Minimum viewport width in pixels
 * @param maxViewport - Maximum viewport width in pixels
 * @returns CSS clamp() expression
 */
export function calculateFluidSize(
  minSize: number,
  maxSize: number,
  minViewport: number,
  maxViewport: number
): string {
  // Convert to rem (assuming 16px base)
  const minRem = minSize / 16;
  const maxRem = maxSize / 16;
  const minVwRem = minViewport / 16;
  const maxVwRem = maxViewport / 16;

  // Calculate the slope and intercept for the linear interpolation
  // preferredSize = intercept + slope * 100vw
  const slope = (maxRem - minRem) / (maxVwRem - minVwRem);
  const intercept = minRem - slope * minVwRem;

  // Convert slope to vw units (1vw = viewport width / 100)
  const slopeVw = slope * 100;

  // Format numbers to reasonable precision
  const minRemStr = minRem.toFixed(4).replace(/\.?0+$/, '');
  const maxRemStr = maxRem.toFixed(4).replace(/\.?0+$/, '');
  const interceptStr = intercept.toFixed(4).replace(/\.?0+$/, '');
  const slopeVwStr = slopeVw.toFixed(4).replace(/\.?0+$/, '');

  // Build the preferred value expression
  const preferred =
    intercept >= 0
      ? `${interceptStr}rem + ${slopeVwStr}vw`
      : `${slopeVwStr}vw - ${Math.abs(intercept).toFixed(4).replace(/\.?0+$/, '')}rem`;

  return `clamp(${minRemStr}rem, ${preferred}, ${maxRemStr}rem)`;
}

/**
 * Calculate complete fluid scale
 *
 * @param config - Fluid scale configuration
 * @returns Object with step names mapped to clamp() expressions
 */
export function calculateFluidScale(config: FluidScaleConfig): ComputedScale {
  const { minViewport, maxViewport, minScale, maxScale, base = 16 } = config;
  const scale: ComputedScale = {};

  for (const step of DEFAULT_STEP_NAMES) {
    const multiplier = STEP_MULTIPLIERS[step];
    const minSize = base * multiplier * minScale;
    const maxSize = base * multiplier * maxScale;

    scale[step] = calculateFluidSize(minSize, maxSize, minViewport, maxViewport);
  }

  return scale;
}

/**
 * Calculate a single fluid value for a specific base size
 *
 * @param baseSize - Base size in pixels
 * @param config - Fluid scale configuration
 * @returns CSS clamp() expression
 */
export function calculateFluidValue(
  baseSize: number,
  config: FluidScaleConfig
): string {
  const { minViewport, maxViewport, minScale, maxScale } = config;
  const minSize = baseSize * minScale;
  const maxSize = baseSize * maxScale;

  return calculateFluidSize(minSize, maxSize, minViewport, maxViewport);
}

/**
 * Get the pixel value at a specific viewport width
 *
 * @param minSize - Minimum font size in pixels
 * @param maxSize - Maximum font size in pixels
 * @param minViewport - Minimum viewport width in pixels
 * @param maxViewport - Maximum viewport width in pixels
 * @param currentViewport - Current viewport width in pixels
 * @returns Computed size in pixels
 */
export function getFluidSizeAtViewport(
  minSize: number,
  maxSize: number,
  minViewport: number,
  maxViewport: number,
  currentViewport: number
): number {
  if (currentViewport <= minViewport) return minSize;
  if (currentViewport >= maxViewport) return maxSize;

  const progress = (currentViewport - minViewport) / (maxViewport - minViewport);
  return minSize + (maxSize - minSize) * progress;
}

/**
 * Parse a clamp() expression to extract min, max values
 */
export function parseClampExpression(
  clamp: string
): { min: number; max: number } | null {
  const match = clamp.match(/clamp\(([0-9.]+)rem,.*,\s*([0-9.]+)rem\)/);
  if (!match) return null;

  return {
    min: parseFloat(match[1]) * 16,
    max: parseFloat(match[2]) * 16,
  };
}
