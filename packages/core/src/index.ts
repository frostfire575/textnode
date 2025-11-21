/**
 * @textnode/core
 *
 * Core typography system - framework agnostic
 *
 * This package provides the foundational utilities for the textnode
 * typography system including:
 * - Configuration management
 * - Type scale calculations
 * - Font metric analysis
 * - Layout shift prevention
 * - CSS generation
 */

// Re-export all types
export type {
  // Font types
  FontFormat,
  FontDisplay,
  FontWeight,
  FontStyle,
  FontFiles,
  FallbackConfig,
  FontDefinition,
  FontsConfig,
  // Scale types
  ScaleType,
  ModularRatio,
  ModularScaleConfig,
  FixedScaleConfig,
  FluidScaleConfig,
  CustomScaleConfig,
  ScaleConfig,
  DefaultScaleKey,
  // Variant types
  LetterSpacingPreset,
  VariantDefinition,
  VariantsConfig,
  DefaultVariantName,
  // Optimization types
  LayoutShiftPrevention,
  OptimizationConfig,
  // License types
  LicenseType,
  LicenseInfo,
  LicensesConfig,
  // Theme types
  ThemeFonts,
  ThemeConfig,
  ThemesConfig,
  // Main config
  TextnodeConfig,
  // Font metrics
  FontMetrics,
  FallbackAdjustments,
  // Computed types
  ComputedScale,
  ComputedVariantStyles,
  FontLoadingState,
  AllFontsLoadingState,
  // Export types
  ExportFormat,
  DesignTokens,
} from './types';

// Configuration
export {
  defineConfig,
  validateConfig,
  assertValidConfig,
  ConfigValidationError,
  DEFAULT_FONT_DISPLAY,
  DEFAULT_MODULAR_SCALE,
  DEFAULT_FIXED_SCALE_VALUES,
  DEFAULT_FLUID_SCALE,
  DEFAULT_VARIANTS,
  DEFAULT_OPTIMIZATION,
  LETTER_SPACING_PRESETS,
  COMMON_FALLBACK_FONTS,
} from './config';
export type { ValidationResult } from './config';

// Scale calculations
export {
  calculateScale,
  calculateModularScale,
  calculateModularStep,
  calculateModularScaleRange,
  calculateFixedScale,
  calculateFluidScale,
  calculateFluidSize,
  calculateFluidValue,
  getScaleValue,
  scaleValueToCSS,
  getScaleKeys,
  isFluidScale,
  scaleToPixels,
  NAMED_RATIOS,
  getRatioName,
  getDefaultFixedScale,
  mergeFixedScale,
  createFixedScaleFromArray,
  getFluidSizeAtViewport,
  parseClampExpression,
} from './scale';

// Font management
export {
  // Metrics
  SYSTEM_FONT_METRICS,
  getSystemFontMetrics,
  normalizeMetrics,
  calculateLineHeightFromMetrics,
  createDefaultMetrics,
  isDisplayFont,
  isBodyFont,
  findBestMatchingFallback,
  // Fallback
  calculateFallbackAdjustments,
  calculateAdjustmentsFromConfig,
  estimateCLSImprovement,
  getRecommendedFallback,
  validateAdjustments,
  // CSS generation
  generateFontFace,
  generateFallbackFontFace,
  generateFontVariable,
  generateFontClass,
  generatePreloadLink,
  generateFontCSS,
  generateAllFontsCSS,
  generatePreloadLinks,
  generateFontVariables,
  generateCriticalFontCSS,
  generateSingleFontCSS,
  generateSelectedFontsCSS,
  // Font loading
  isBrowser,
  isFontFaceAPISupported,
  loadFontFile,
  loadFont,
  loadFonts,
  isFontLoaded,
  waitForFont,
  createFontLoadingTracker,
  injectCSS,
  injectPreloadLink,
  preloadFonts,
  onFontsReady,
  getFontsStatus,
  appendCSS,
  isFontCSSInjected,
} from './fonts';

// Variant resolution
export {
  resolveVariant,
  resolveAllVariants,
  stylesToCSSProperties,
  stylesToCSSString,
  generateVariantClasses,
  mergeVariantStyles,
} from './variants';
