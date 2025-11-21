/**
 * useScale Hook
 *
 * Access type scale values and utilities.
 */

import { useMemo, useCallback } from 'react';
import {
  type ComputedScale,
  type ScaleConfig,
  getScaleValue as coreGetScaleValue,
  scaleValueToCSS,
  isFluidScale,
} from '@textnode/core';
import { useTypographyContext } from '../context/TypographyContext';

/**
 * Hook return type
 */
export interface UseScaleReturn {
  /** Get a scale value by key */
  getValue: (key: string, fallback?: number | string) => number | string;
  /** Get a scale value as CSS string */
  getCSS: (key: string, unit?: 'px' | 'rem' | 'em') => string;
  /** All scale values */
  values: ComputedScale;
  /** Scale configuration */
  config: ScaleConfig;
  /** Base font size */
  base: number | string;
  /** Scale ratio (if modular scale) */
  ratio?: number;
  /** Whether the scale uses fluid (responsive) values */
  isFluid: boolean;
  /** All available scale keys */
  keys: string[];
}

/**
 * useScale Hook
 *
 * Access type scale values and get computed sizes.
 *
 * @example
 * ```tsx
 * function Component() {
 *   const { getValue, getCSS, values, base } = useScale();
 *
 *   // Get raw value
 *   const h1Size = getValue('5xl'); // 48
 *
 *   // Get as CSS
 *   const h1CSS = getCSS('5xl', 'rem'); // '3rem'
 *
 *   // Use directly
 *   return (
 *     <div style={{ fontSize: getCSS('lg') }}>
 *       Larger text
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // List all scale values
 * function ScalePreview() {
 *   const { values, keys, isFluid } = useScale();
 *
 *   return (
 *     <div>
 *       <p>Scale type: {isFluid ? 'Fluid' : 'Fixed'}</p>
 *       {keys.map(key => (
 *         <div key={key} style={{ fontSize: values[key] }}>
 *           {key}: {values[key]}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useScale(): UseScaleReturn {
  const { scale, config } = useTypographyContext();

  // Get scale config
  const scaleConfig = config.scale;

  // Compute base value
  const base = useMemo(() => {
    if (scaleConfig.type === 'modular' || scaleConfig.type === 'fluid') {
      return scaleConfig.base ?? 16;
    }
    return scale['base'] ?? 16;
  }, [scaleConfig, scale]);

  // Get ratio for modular scale
  const ratio = useMemo(() => {
    if (scaleConfig.type === 'modular') {
      return scaleConfig.ratio;
    }
    return undefined;
  }, [scaleConfig]);

  // Check if fluid
  const isFluid = useMemo(() => isFluidScale(scale), [scale]);

  // Get all keys
  const keys = useMemo(() => Object.keys(scale), [scale]);

  // Get value function
  const getValue = useCallback(
    (key: string, fallback?: number | string): number | string => {
      return coreGetScaleValue(scale, key, fallback);
    },
    [scale]
  );

  // Get CSS function
  const getCSS = useCallback(
    (key: string, unit: 'px' | 'rem' | 'em' = 'px'): string => {
      const value = coreGetScaleValue(scale, key);
      return scaleValueToCSS(value, unit);
    },
    [scale]
  );

  return {
    getValue,
    getCSS,
    values: scale,
    config: scaleConfig,
    base,
    ratio,
    isFluid,
    keys,
  };
}
