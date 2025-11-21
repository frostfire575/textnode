/**
 * Typography Context
 *
 * Provides typography configuration and computed values
 * to all child components.
 */

import { createContext, useContext } from 'react';
import type {
  TextnodeConfig,
  ComputedScale,
  FontsConfig,
  VariantsConfig,
  ComputedVariantStyles,
} from '@textnode/core';

/**
 * Typography context value
 */
export interface TypographyContextValue {
  /** Original configuration */
  config: TextnodeConfig;
  /** Computed scale values */
  scale: ComputedScale;
  /** Font definitions */
  fonts: FontsConfig;
  /** Variant definitions */
  variants: VariantsConfig;
  /** Resolved variant styles */
  resolvedVariants: Record<string, ComputedVariantStyles>;
  /** Whether the context is initialized */
  initialized: boolean;
}

/**
 * Default context value
 */
const defaultContextValue: TypographyContextValue = {
  config: {
    fonts: {},
    scale: { type: 'fixed', values: { base: 16 } },
  },
  scale: { base: 16 },
  fonts: {},
  variants: {},
  resolvedVariants: {},
  initialized: false,
};

/**
 * Typography Context
 */
export const TypographyContext = createContext<TypographyContextValue>(defaultContextValue);

/**
 * Hook to access typography context
 */
export function useTypographyContext(): TypographyContextValue {
  const context = useContext(TypographyContext);

  if (!context.initialized) {
    console.warn(
      'useTypographyContext: No TypographyProvider found. ' +
        'Make sure to wrap your app with <TypographyProvider>.'
    );
  }

  return context;
}

/**
 * Display name for debugging
 */
TypographyContext.displayName = 'TypographyContext';
