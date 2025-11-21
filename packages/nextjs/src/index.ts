/**
 * @textnode/nextjs
 *
 * Next.js plugin and integration for textnode typography system.
 *
 * This package provides:
 * - withTextnode - Next.js config wrapper
 * - Font loading helpers for App Router
 * - Font loading helpers for Pages Router
 * - Metadata generation utilities
 */

// Plugin
export { withTextnode, type TextnodePluginOptions, type NextConfigWithTextnode } from './plugin';

// Font helpers
export {
  getTextnodeFonts,
  getPreloadLinks,
  getFontCSSVariables,
  getPreloadFontPaths,
  shouldPreloadFont,
  type FontClassNames,
} from './helpers/font-loader';

// Metadata helpers
export {
  generateFontPreloadMetadata,
  createPreloadLinkElements,
  getFontResourceHints,
  type FontPreloadLink,
} from './helpers/metadata';

// Re-export React components and hooks for convenience
export {
  TypographyProvider,
  Text,
  Heading,
  useTypography,
  useFont,
  useFontLoadingState,
  useScale,
  useVariant,
  defineConfig,
} from '@textnode/react';

// Re-export core types
export type {
  TextnodeConfig,
  FontDefinition,
  FontsConfig,
  ScaleConfig,
  VariantDefinition,
  VariantsConfig,
} from '@textnode/core';
