/**
 * @textnode/react
 *
 * React components and hooks for the textnode typography system.
 *
 * This package provides:
 * - TypographyProvider - Context provider for typography configuration
 * - Text - Versatile text component with variant support
 * - Heading - Semantic heading component (h1-h6)
 * - Hooks for accessing typography, fonts, scale, and variants
 */

// Components
export {
  TypographyProvider,
  type TypographyProviderProps,
} from './components/TypographyProvider';
export { Text, type TextProps, type TextOwnProps } from './components/Text';
export { Heading, type HeadingProps, type HeadingLevel } from './components/Heading';

// Hooks
export { useTypography, type UseTypographyReturn } from './hooks/useTypography';
export { useFont, type UseFontReturn, type UseFontOptions } from './hooks/useFont';
export { useFontLoadingState, type UseFontLoadingStateReturn } from './hooks/useFontLoadingState';
export { useScale, type UseScaleReturn } from './hooks/useScale';
export { useVariant, type UseVariantReturn } from './hooks/useVariant';

// Context (for advanced usage)
export {
  TypographyContext,
  useTypographyContext,
  type TypographyContextValue,
} from './context/TypographyContext';
export {
  FontContext,
  useFontContext,
  type FontContextValue,
} from './context/FontContext';

// Re-export core types for convenience
export type {
  TextnodeConfig,
  FontDefinition,
  FontsConfig,
  ScaleConfig,
  VariantDefinition,
  VariantsConfig,
  ComputedScale,
  ComputedVariantStyles,
  FontLoadingState,
  AllFontsLoadingState,
  FontWeight,
} from '@textnode/core';

// Re-export defineConfig helper
export { defineConfig } from '@textnode/core';
