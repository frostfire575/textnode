/**
 * Configuration schema and defaults
 */

import type {
  TextnodeConfig,
  ScaleConfig,
  VariantsConfig,
  OptimizationConfig,
  FontDisplay,
} from '../types';

/** Default font display strategy */
export const DEFAULT_FONT_DISPLAY: FontDisplay = 'swap';

/** Default modular scale configuration */
export const DEFAULT_MODULAR_SCALE: ScaleConfig = {
  type: 'modular',
  base: 16,
  ratio: 1.25, // Major Third
};

/** Default fixed scale values */
export const DEFAULT_FIXED_SCALE_VALUES: Record<string, number> = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
};

/** Default fluid scale configuration */
export const DEFAULT_FLUID_SCALE: ScaleConfig = {
  type: 'fluid',
  minViewport: 320,
  maxViewport: 1920,
  minScale: 0.875,
  maxScale: 1.25,
  base: 16,
};

/** Default variants configuration */
export const DEFAULT_VARIANTS: VariantsConfig = {
  h1: {
    fontSize: '5xl',
    fontWeight: 700,
    lineHeight: 1.2,
    fontFamily: 'heading',
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '4xl',
    fontWeight: 600,
    lineHeight: 1.25,
    fontFamily: 'heading',
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '3xl',
    fontWeight: 600,
    lineHeight: 1.3,
    fontFamily: 'heading',
  },
  h4: {
    fontSize: '2xl',
    fontWeight: 600,
    lineHeight: 1.35,
    fontFamily: 'heading',
  },
  h5: {
    fontSize: 'xl',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: 'heading',
  },
  h6: {
    fontSize: 'lg',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: 'heading',
  },
  body: {
    fontSize: 'base',
    fontWeight: 400,
    lineHeight: 1.5,
    fontFamily: 'body',
  },
  bodyLarge: {
    fontSize: 'lg',
    fontWeight: 400,
    lineHeight: 1.6,
    fontFamily: 'body',
  },
  bodySmall: {
    fontSize: 'sm',
    fontWeight: 400,
    lineHeight: 1.5,
    fontFamily: 'body',
  },
  caption: {
    fontSize: 'sm',
    fontWeight: 500,
    lineHeight: 1.4,
    fontFamily: 'body',
    letterSpacing: '0.01em',
  },
  overline: {
    fontSize: 'xs',
    fontWeight: 600,
    lineHeight: 1.5,
    fontFamily: 'body',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  code: {
    fontSize: 'sm',
    fontWeight: 400,
    lineHeight: 1.5,
    fontFamily: 'mono',
  },
};

/** Default optimization configuration */
export const DEFAULT_OPTIMIZATION: OptimizationConfig = {
  layoutShift: {
    prevention: 'balanced',
    fallbackMatching: true,
    preload: true,
    subset: false,
  },
};

/** Letter spacing preset values */
export const LETTER_SPACING_PRESETS: Record<string, string> = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

/** Common fallback fonts for matching */
export const COMMON_FALLBACK_FONTS = [
  'Arial',
  'Helvetica',
  'Verdana',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'sans-serif',
  'serif',
  'monospace',
] as const;

/**
 * Helper to create a complete config with defaults
 */
export function defineConfig(config: TextnodeConfig): TextnodeConfig {
  return {
    ...config,
    variants: {
      ...DEFAULT_VARIANTS,
      ...config.variants,
    },
    optimization: {
      ...DEFAULT_OPTIMIZATION,
      ...config.optimization,
      layoutShift: {
        ...DEFAULT_OPTIMIZATION.layoutShift,
        ...config.optimization?.layoutShift,
      },
    },
  };
}
