/**
 * Font loader helpers for Next.js
 *
 * Provides utilities for loading fonts in Next.js applications.
 */

import type { TextnodeConfig, FontsConfig } from '@textnode/core';
import { generatePreloadLinks, generateFontVariables } from '@textnode/core';

/**
 * Font class names object
 */
export interface FontClassNames {
  /** CSS variable class to apply to html element */
  variable: string;
  /** Individual font classes */
  fonts: Record<string, string>;
}

/**
 * Get font class names from configuration
 *
 * Returns class names to apply to your root element for font CSS variables.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { getTextnodeFonts } from '@textnode/nextjs';
 * import config from '../textnode.config';
 *
 * const fonts = getTextnodeFonts(config);
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html className={fonts.variable}>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
export function getTextnodeFonts(config: TextnodeConfig): FontClassNames {
  const fontClasses: Record<string, string> = {};

  for (const key of Object.keys(config.fonts)) {
    fontClasses[key] = `font-${key}`;
  }

  return {
    variable: 'textnode-fonts',
    fonts: fontClasses,
  };
}

/**
 * Generate preload link elements for Next.js
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { getPreloadLinks } from '@textnode/nextjs';
 * import config from '../textnode.config';
 *
 * export default function RootLayout({ children }) {
 *   const preloadLinks = getPreloadLinks(config);
 *
 *   return (
 *     <html>
 *       <head>
 *         {preloadLinks}
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
export function getPreloadLinks(config: TextnodeConfig): string[] {
  return generatePreloadLinks(config.fonts);
}

/**
 * Generate CSS variables string for fonts
 *
 * @example
 * ```tsx
 * // For inline styles or CSS-in-JS
 * const cssVars = getFontCSSVariables(config);
 * // Returns: ':root { --font-heading: "Poppins", ... }'
 * ```
 */
export function getFontCSSVariables(config: TextnodeConfig): string {
  return generateFontVariables(config.fonts);
}

/**
 * Get font file paths that should be preloaded
 */
export function getPreloadFontPaths(fonts: FontsConfig): string[] {
  const paths: string[] = [];

  for (const font of Object.values(fonts)) {
    if (font.preload) {
      for (const filePath of Object.values(font.files)) {
        if (filePath) {
          paths.push(filePath);
        }
      }
    }
  }

  return paths;
}

/**
 * Check if font should be preloaded
 */
export function shouldPreloadFont(
  config: TextnodeConfig,
  fontKey: string
): boolean {
  const font = config.fonts[fontKey];
  return font?.preload === true;
}
