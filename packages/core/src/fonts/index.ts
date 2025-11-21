/**
 * Font management module exports
 */

// Metrics
export {
  SYSTEM_FONT_METRICS,
  getSystemFontMetrics,
  normalizeMetrics,
  calculateLineHeightFromMetrics,
  createDefaultMetrics,
  isDisplayFont,
  isBodyFont,
  findBestMatchingFallback,
} from './metrics';

// Fallback calculations
export {
  calculateFallbackAdjustments,
  calculateAdjustmentsFromConfig,
  estimateCLSImprovement,
  getRecommendedFallback,
  validateAdjustments,
} from './fallback';

// CSS generation
export {
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
} from './css-generator';

// Font loading
export {
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
} from './loader';
