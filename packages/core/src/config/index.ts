/**
 * Configuration module exports
 */

export {
  defineConfig,
  DEFAULT_FONT_DISPLAY,
  DEFAULT_MODULAR_SCALE,
  DEFAULT_FIXED_SCALE_VALUES,
  DEFAULT_FLUID_SCALE,
  DEFAULT_VARIANTS,
  DEFAULT_OPTIMIZATION,
  LETTER_SPACING_PRESETS,
  COMMON_FALLBACK_FONTS,
} from './schema';

export {
  validateConfig,
  assertValidConfig,
  ConfigValidationError,
  type ValidationResult,
} from './validator';
