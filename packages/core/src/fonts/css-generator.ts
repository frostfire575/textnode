/**
 * CSS generation for fonts
 *
 * Generates @font-face declarations and related CSS for
 * font loading and layout shift prevention.
 */

import type {
  FontDefinition,
  FontsConfig,
  FontMetrics,
  FallbackAdjustments,
  FontWeight,
} from '../types';
import { calculateAdjustmentsFromConfig } from './fallback';
import { createDefaultMetrics } from './metrics';

/**
 * Get MIME type for font format
 */
function getFontMimeType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'woff2':
      return 'font/woff2';
    case 'woff':
      return 'font/woff';
    case 'ttf':
      return 'font/ttf';
    case 'otf':
      return 'font/otf';
    default:
      return 'font/woff2';
  }
}

/**
 * Get format hint for src
 */
function getFontFormatHint(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'woff2':
      return 'woff2';
    case 'woff':
      return 'woff';
    case 'ttf':
      return 'truetype';
    case 'otf':
      return 'opentype';
    default:
      return 'woff2';
  }
}

/**
 * Generate @font-face declaration for a single font weight
 */
export function generateFontFace(
  fontName: string,
  weight: FontWeight,
  filePath: string,
  options: {
    display?: string;
    style?: string;
  } = {}
): string {
  const { display = 'swap', style = 'normal' } = options;
  const format = getFontFormatHint(filePath);

  return `@font-face {
  font-family: '${fontName}';
  src: url('${filePath}') format('${format}');
  font-weight: ${weight};
  font-style: ${style};
  font-display: ${display};
}`;
}

/**
 * Generate fallback @font-face with metric overrides
 */
export function generateFallbackFontFace(
  fontName: string,
  fallbackFont: string,
  adjustments: FallbackAdjustments
): string {
  return `@font-face {
  font-family: '${fontName} Fallback';
  src: local('${fallbackFont}');
  ascent-override: ${adjustments.ascentOverride};
  descent-override: ${adjustments.descentOverride};
  line-gap-override: ${adjustments.lineGapOverride};
  size-adjust: ${adjustments.sizeAdjust};
}`;
}

/**
 * Generate CSS variable for font family
 */
export function generateFontVariable(
  variableName: string,
  fontName: string,
  fallbackFont?: string
): string {
  const fallback = fallbackFont
    ? `'${fontName} Fallback', ${fallbackFont}`
    : 'sans-serif';
  return `${variableName}: '${fontName}', ${fallback};`;
}

/**
 * Generate CSS class for using a font
 */
export function generateFontClass(
  className: string,
  fontName: string,
  fallbackFont?: string
): string {
  const fallback = fallbackFont
    ? `'${fontName} Fallback', ${fallbackFont}`
    : 'sans-serif';
  return `.${className} {
  font-family: '${fontName}', ${fallback};
}`;
}

/**
 * Generate preload link tag
 */
export function generatePreloadLink(filePath: string): string {
  const mimeType = getFontMimeType(filePath);
  return `<link rel="preload" href="${filePath}" as="font" type="${mimeType}" crossorigin>`;
}

/**
 * Generate all CSS for a font definition
 */
export function generateFontCSS(
  fontKey: string,
  font: FontDefinition,
  metrics?: FontMetrics
): string {
  const parts: string[] = [];
  const fontMetrics = metrics || createDefaultMetrics(font.name);

  // Generate @font-face for each weight
  for (const [weight, filePath] of Object.entries(font.files)) {
    if (filePath) {
      parts.push(
        generateFontFace(font.name, parseInt(weight, 10) as FontWeight, filePath, {
          display: font.display,
          style: font.style,
        })
      );
    }
  }

  // Generate fallback @font-face if configured
  if (font.fallback) {
    const adjustments = calculateAdjustmentsFromConfig(fontMetrics, font.fallback);
    parts.push(generateFallbackFontFace(font.name, font.fallback.font, adjustments));
  }

  // Generate CSS variable if configured
  if (font.variable) {
    parts.push(`:root {
  ${generateFontVariable(font.variable, font.name, font.fallback?.font)}
}`);
  }

  // Generate utility class
  parts.push(generateFontClass(`font-${fontKey}`, font.name, font.fallback?.font));

  return parts.join('\n\n');
}

/**
 * Generate all CSS for complete fonts configuration
 */
export function generateAllFontsCSS(
  fonts: FontsConfig,
  metricsMap?: Record<string, FontMetrics>
): string {
  const parts: string[] = [];

  for (const [key, font] of Object.entries(fonts)) {
    const metrics = metricsMap?.[key];
    parts.push(generateFontCSS(key, font, metrics));
  }

  return parts.join('\n\n');
}

/**
 * Generate preload links for all fonts marked for preloading
 */
export function generatePreloadLinks(fonts: FontsConfig): string[] {
  const links: string[] = [];

  for (const font of Object.values(fonts)) {
    if (font.preload) {
      for (const filePath of Object.values(font.files)) {
        if (filePath) {
          links.push(generatePreloadLink(filePath));
        }
      }
    }
  }

  return links;
}

/**
 * Generate CSS custom properties for all fonts
 */
export function generateFontVariables(fonts: FontsConfig): string {
  const variables: string[] = [];

  for (const [key, font] of Object.entries(fonts)) {
    const varName = font.variable || `--font-${key}`;
    const fallback = font.fallback?.font || 'sans-serif';
    variables.push(
      `  ${varName}: '${font.name}', '${font.name} Fallback', ${fallback};`
    );
  }

  return `:root {\n${variables.join('\n')}\n}`;
}

/**
 * Generate inline critical CSS for fonts
 * This is a minimal set of styles to prevent FOUT
 */
export function generateCriticalFontCSS(fonts: FontsConfig): string {
  const parts: string[] = [];

  // Only generate fallback font-faces for critical path
  for (const font of Object.values(fonts)) {
    if (font.fallback && font.preload) {
      const metrics = createDefaultMetrics(font.name);
      const adjustments = calculateAdjustmentsFromConfig(metrics, font.fallback);
      parts.push(generateFallbackFontFace(font.name, font.fallback.font, adjustments));
    }
  }

  return parts.join('\n\n');
}
