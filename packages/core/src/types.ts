/**
 * Core type definitions for the textnode typography system
 */

// ============================================================================
// Font Types
// ============================================================================

/** Supported font file formats */
export type FontFormat = 'woff2' | 'woff' | 'ttf' | 'otf';

/** Font display strategy */
export type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';

/** Font weight values */
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/** Font style */
export type FontStyle = 'normal' | 'italic' | 'oblique';

/** Font file mapping - weight to file path */
export type FontFiles = Partial<Record<FontWeight, string>>;

/** Fallback font configuration */
export interface FallbackConfig {
  /** System font to use as fallback */
  font: string;
  /** Auto-calculate metrics from custom font */
  auto?: boolean;
  /** Manual metric overrides */
  ascentOverride?: string;
  descentOverride?: string;
  lineGapOverride?: string;
  sizeAdjust?: string;
}

/** Single font definition */
export interface FontDefinition {
  /** Display name of the font */
  name: string;
  /** Font file paths by weight */
  files: FontFiles;
  /** Fallback configuration */
  fallback?: FallbackConfig;
  /** Font display strategy */
  display?: FontDisplay;
  /** Preload this font */
  preload?: boolean;
  /** CSS variable name for this font */
  variable?: string;
  /** Font style (normal, italic) */
  style?: FontStyle;
}

/** Font definitions map */
export type FontsConfig = Record<string, FontDefinition>;

// ============================================================================
// Scale Types
// ============================================================================

/** Type scale type options */
export type ScaleType = 'modular' | 'fixed' | 'fluid' | 'custom';

/** Common scale ratios for modular scales */
export type ModularRatio =
  | 1.067 // Minor Second
  | 1.125 // Major Second
  | 1.2   // Minor Third
  | 1.25  // Major Third
  | 1.333 // Perfect Fourth
  | 1.414 // Augmented Fourth
  | 1.5   // Perfect Fifth
  | 1.618 // Golden Ratio
  | number; // Custom ratio

/** Base scale configuration */
interface BaseScaleConfig {
  type: ScaleType;
}

/** Modular scale configuration */
export interface ModularScaleConfig extends BaseScaleConfig {
  type: 'modular';
  /** Base font size in pixels */
  base: number;
  /** Scale ratio */
  ratio: ModularRatio;
}

/** Fixed scale configuration */
export interface FixedScaleConfig extends BaseScaleConfig {
  type: 'fixed';
  /** Fixed values by key */
  values: Record<string, number>;
}

/** Fluid scale configuration */
export interface FluidScaleConfig extends BaseScaleConfig {
  type: 'fluid';
  /** Minimum viewport width in pixels */
  minViewport: number;
  /** Maximum viewport width in pixels */
  maxViewport: number;
  /** Minimum scale multiplier */
  minScale: number;
  /** Maximum scale multiplier */
  maxScale: number;
  /** Base size in pixels */
  base?: number;
}

/** Custom scale configuration */
export interface CustomScaleConfig extends BaseScaleConfig {
  type: 'custom';
  /** Custom values by key */
  values: Record<string, string | number>;
}

/** Union of all scale configurations */
export type ScaleConfig =
  | ModularScaleConfig
  | FixedScaleConfig
  | FluidScaleConfig
  | CustomScaleConfig;

/** Default scale keys */
export type DefaultScaleKey =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';

// ============================================================================
// Variant Types
// ============================================================================

/** Letter spacing presets */
export type LetterSpacingPreset =
  | 'tighter'
  | 'tight'
  | 'normal'
  | 'wide'
  | 'wider'
  | 'widest';

/** Text style variant definition */
export interface VariantDefinition {
  /** Font size - scale key or number */
  fontSize: string | number;
  /** Font weight */
  fontWeight?: FontWeight;
  /** Line height */
  lineHeight?: number | string;
  /** Font family key from fonts config */
  fontFamily?: string;
  /** Letter spacing */
  letterSpacing?: LetterSpacingPreset | string;
  /** Text transform */
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Font style */
  fontStyle?: FontStyle;
}

/** Variants configuration map */
export type VariantsConfig = Record<string, VariantDefinition>;

/** Default variant names */
export type DefaultVariantName =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'bodyLarge'
  | 'bodySmall'
  | 'caption'
  | 'overline'
  | 'code';

// ============================================================================
// Optimization Types
// ============================================================================

/** Layout shift prevention strategy */
export type LayoutShiftPrevention = 'aggressive' | 'balanced' | 'minimal' | 'none';

/** Optimization configuration */
export interface OptimizationConfig {
  layoutShift?: {
    /** Prevention strategy */
    prevention?: LayoutShiftPrevention;
    /** Enable fallback metric matching */
    fallbackMatching?: boolean;
    /** Preload critical fonts */
    preload?: boolean;
    /** Enable font subsetting */
    subset?: boolean;
  };
}

// ============================================================================
// License Types
// ============================================================================

/** Font license types */
export type LicenseType =
  | 'OFL'      // Open Font License
  | 'Apache'   // Apache License
  | 'MIT'      // MIT License
  | 'GPL'      // GPL License
  | 'Commercial'
  | 'Custom'
  | string;

/** Font license information */
export interface LicenseInfo {
  /** License type */
  type: LicenseType;
  /** Can be used commercially */
  commercial?: boolean;
  /** URL to license or font source */
  url?: string;
  /** Additional notes */
  notes?: string;
}

/** Licenses configuration */
export type LicensesConfig = Record<string, LicenseInfo>;

// ============================================================================
// Theme Types
// ============================================================================

/** Theme-specific font mapping */
export interface ThemeFonts {
  [key: string]: string;
}

/** Single theme configuration */
export interface ThemeConfig {
  fonts?: ThemeFonts;
}

/** Multiple themes configuration */
export type ThemesConfig = Record<string, ThemeConfig>;

// ============================================================================
// Main Configuration
// ============================================================================

/** Complete textnode configuration */
export interface TextnodeConfig {
  /** Font definitions */
  fonts: FontsConfig;
  /** Type scale configuration */
  scale: ScaleConfig;
  /** Text style variants */
  variants?: VariantsConfig;
  /** Optimization settings */
  optimization?: OptimizationConfig;
  /** Font license information */
  licenses?: LicensesConfig;
  /** Theme configurations */
  themes?: ThemesConfig;
}

// ============================================================================
// Font Metrics Types
// ============================================================================

/** Extracted font metrics from font file */
export interface FontMetrics {
  /** Font family name */
  familyName: string;
  /** PostScript name */
  postscriptName?: string;
  /** Ascent value (in font units) */
  ascent: number;
  /** Descent value (in font units, usually negative) */
  descent: number;
  /** Line gap (in font units) */
  lineGap: number;
  /** Units per em */
  unitsPerEm: number;
  /** Cap height (in font units) */
  capHeight?: number;
  /** x-height (in font units) */
  xHeight?: number;
  /** Font weight */
  weight?: number;
  /** Is italic */
  isItalic?: boolean;
  /** Number of glyphs */
  numGlyphs?: number;
}

/** Calculated fallback adjustments */
export interface FallbackAdjustments {
  /** CSS ascent-override value */
  ascentOverride: string;
  /** CSS descent-override value */
  descentOverride: string;
  /** CSS line-gap-override value */
  lineGapOverride: string;
  /** CSS size-adjust value */
  sizeAdjust: string;
}

// ============================================================================
// Computed Types
// ============================================================================

/** Computed scale values */
export type ComputedScale = Record<string, number | string>;

/** Computed variant styles */
export interface ComputedVariantStyles {
  fontSize: string | number;
  fontWeight?: number;
  lineHeight?: number | string;
  fontFamily?: string;
  letterSpacing?: string;
  textTransform?: string;
  fontStyle?: string;
}

/** Font loading state */
export interface FontLoadingState {
  /** Font is currently loading */
  loading: boolean;
  /** Font has loaded successfully */
  loaded: boolean;
  /** Loading error if any */
  error: Error | null;
}

/** All fonts loading state */
export interface AllFontsLoadingState {
  /** All fonts have loaded */
  allLoaded: boolean;
  /** Names of loaded fonts */
  loadedFonts: string[];
  /** Names of currently loading fonts */
  loadingFonts: string[];
  /** Names of fonts that failed to load */
  failedFonts: string[];
  /** Layout is stable (no more shifts expected) */
  layoutStable: boolean;
}

// ============================================================================
// Export/Token Types
// ============================================================================

/** Export format options */
export type ExportFormat = 'css-vars' | 'tailwind' | 'json' | 'figma' | 'scss';

/** Exported design tokens */
export interface DesignTokens {
  fonts: Record<string, string>;
  scale: Record<string, string | number>;
  variants: Record<string, ComputedVariantStyles>;
}
