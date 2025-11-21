/**
 * Font Loading Context
 *
 * Tracks the loading state of all fonts and provides
 * utilities for monitoring font loading progress.
 */

import { createContext, useContext } from 'react';
import type { FontLoadingState, AllFontsLoadingState } from '@textnode/core';

/**
 * Font context value
 */
export interface FontContextValue {
  /** Loading state for each font */
  fontStates: Record<string, FontLoadingState>;
  /** Overall loading state */
  allFontsState: AllFontsLoadingState;
  /** Load a specific font */
  loadFont: (fontKey: string) => Promise<void>;
  /** Reload all fonts */
  reloadFonts: () => Promise<void>;
}

/**
 * Default font loading state
 */
const defaultFontState: FontLoadingState = {
  loading: false,
  loaded: false,
  error: null,
};

/**
 * Default all fonts state
 */
const defaultAllFontsState: AllFontsLoadingState = {
  allLoaded: false,
  loadedFonts: [],
  loadingFonts: [],
  failedFonts: [],
  layoutStable: false,
};

/**
 * Default context value
 */
const defaultContextValue: FontContextValue = {
  fontStates: {},
  allFontsState: defaultAllFontsState,
  loadFont: async () => {
    console.warn('FontContext: No provider found');
  },
  reloadFonts: async () => {
    console.warn('FontContext: No provider found');
  },
};

/**
 * Font Context
 */
export const FontContext = createContext<FontContextValue>(defaultContextValue);

/**
 * Hook to access font context
 */
export function useFontContext(): FontContextValue {
  return useContext(FontContext);
}

/**
 * Display name for debugging
 */
FontContext.displayName = 'FontContext';

export { defaultFontState, defaultAllFontsState };
