/**
 * Typography Provider
 *
 * Main provider component that initializes the typography system
 * and provides context to all child components.
 */

import React, { useMemo, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import {
  type TextnodeConfig,
  type FontLoadingState,
  type AllFontsLoadingState,
  calculateScale,
  resolveAllVariants,
  generateAllFontsCSS,
  generateSingleFontCSS,
  injectCSS,
  appendCSS,
  preloadFonts,
  loadFonts,
  isBrowser,
  DEFAULT_VARIANTS,
} from '@textnode/core';
import {
  TypographyContext,
  type TypographyContextValue,
} from '../context/TypographyContext';
import {
  FontContext,
  type FontContextValue,
  defaultFontState,
} from '../context/FontContext';

/**
 * Typography Provider props
 */
export interface TypographyProviderProps {
  /** Textnode configuration */
  config: TextnodeConfig;
  /** Children to render */
  children: ReactNode;
  /** Whether to auto-load fonts (default: true) */
  autoLoad?: boolean;
  /** Whether to preload fonts marked for preloading (default: true) */
  preload?: boolean;
  /** Whether to inject font CSS (default: true) */
  injectStyles?: boolean;
  /** CSS style ID for injected styles */
  styleId?: string;
  /**
   * Enable lazy/on-demand font loading (default: false)
   *
   * When true:
   * - CSS is NOT injected for all fonts on mount
   * - Fonts are NOT loaded on mount
   * - CSS is injected only when a font is first requested via useFont()
   * - Font is loaded only when requested
   *
   * This is useful when you have many fonts configured but only use
   * a subset of them, avoiding unnecessary CSS generation and font downloads.
   *
   * @example
   * ```tsx
   * <TypographyProvider config={config} lazyLoad={true}>
   *   <App />
   * </TypographyProvider>
   *
   * // In a component - font loads on first render
   * function CodeBlock() {
   *   const { loaded } = useFont('mono'); // Triggers CSS injection + load
   *   return <pre>{children}</pre>;
   * }
   * ```
   */
  lazyLoad?: boolean;
}

/**
 * Typography Provider Component
 *
 * Wraps your application to provide typography context including:
 * - Computed type scale values
 * - Font loading state management
 * - Automatic CSS injection
 * - Font preloading
 *
 * @example
 * ```tsx
 * import { TypographyProvider } from '@textnode/react';
 * import config from './textnode.config';
 *
 * function App() {
 *   return (
 *     <TypographyProvider config={config}>
 *       <YourApp />
 *     </TypographyProvider>
 *   );
 * }
 * ```
 */
export function TypographyProvider({
  config,
  children,
  autoLoad = true,
  preload = true,
  injectStyles = true,
  styleId = 'textnode-styles',
  lazyLoad = false,
}: TypographyProviderProps): React.ReactElement {
  // Font loading state
  const [fontStates, setFontStates] = useState<Record<string, FontLoadingState>>(() => {
    const states: Record<string, FontLoadingState> = {};
    for (const key of Object.keys(config.fonts)) {
      states[key] = { ...defaultFontState };
    }
    return states;
  });

  // Track which fonts have been requested (for lazy loading)
  const [requestedFonts, setRequestedFonts] = useState<Set<string>>(() => new Set());

  // Track which fonts have had their CSS injected (for lazy loading)
  const injectedFontsRef = useRef<Set<string>>(new Set());

  // Compute scale values
  const scale = useMemo(() => calculateScale(config.scale), [config.scale]);

  // Merge variants with defaults
  const variants = useMemo(
    () => ({
      ...DEFAULT_VARIANTS,
      ...config.variants,
    }),
    [config.variants]
  );

  // Resolve all variants to computed styles
  const resolvedVariants = useMemo(
    () => resolveAllVariants(variants, scale, config.fonts),
    [variants, scale, config.fonts]
  );

  // Compute all fonts loading state
  const allFontsState = useMemo<AllFontsLoadingState>(() => {
    const states = Object.entries(fontStates);
    const loadedFonts = states.filter(([, s]) => s.loaded).map(([k]) => k);
    const loadingFonts = states.filter(([, s]) => s.loading).map(([k]) => k);
    const failedFonts = states.filter(([, s]) => s.error !== null).map(([k]) => k);

    return {
      allLoaded: loadedFonts.length === states.length && loadingFonts.length === 0,
      loadedFonts,
      loadingFonts,
      failedFonts,
      layoutStable: loadedFonts.length === states.length,
    };
  }, [fontStates]);

  // Load a specific font
  const loadFont = useCallback(
    async (fontKey: string) => {
      const font = config.fonts[fontKey];
      if (!font) {
        console.warn(`Font "${fontKey}" not found in configuration`);
        return;
      }

      setFontStates((prev) => ({
        ...prev,
        [fontKey]: { loading: true, loaded: false, error: null },
      }));

      try {
        await loadFonts({ [fontKey]: font });
        setFontStates((prev) => ({
          ...prev,
          [fontKey]: { loading: false, loaded: true, error: null },
        }));
      } catch (error) {
        setFontStates((prev) => ({
          ...prev,
          [fontKey]: {
            loading: false,
            loaded: false,
            error: error instanceof Error ? error : new Error(String(error)),
          },
        }));
      }
    },
    [config.fonts]
  );

  // Reload all fonts
  const reloadFonts = useCallback(async () => {
    const fontKeys = Object.keys(config.fonts);
    await Promise.all(fontKeys.map(loadFont));
  }, [config.fonts, loadFont]);

  // Request a font (for lazy loading - injects CSS and loads font)
  const requestFont = useCallback(
    async (fontKey: string) => {
      const font = config.fonts[fontKey];
      if (!font) {
        console.warn(`Font "${fontKey}" not found in configuration`);
        return;
      }

      // Skip if already requested
      if (injectedFontsRef.current.has(fontKey)) {
        // Font CSS already injected, just ensure it's loaded
        const currentState = fontStates[fontKey];
        if (!currentState?.loaded && !currentState?.loading) {
          await loadFont(fontKey);
        }
        return;
      }

      // Mark as requested
      injectedFontsRef.current.add(fontKey);
      setRequestedFonts((prev) => new Set(prev).add(fontKey));

      // Inject CSS for this specific font
      if (isBrowser() && injectStyles) {
        const css = generateSingleFontCSS(fontKey, font);
        appendCSS(css, styleId);
      }

      // Load the font
      await loadFont(fontKey);
    },
    [config.fonts, fontStates, loadFont, injectStyles, styleId]
  );

  // Inject CSS on mount (only in non-lazy mode)
  useEffect(() => {
    if (!isBrowser() || !injectStyles || lazyLoad) return;

    const css = generateAllFontsCSS(config.fonts);
    injectCSS(css, styleId);
  }, [config.fonts, injectStyles, styleId, lazyLoad]);

  // Preload fonts on mount (only in non-lazy mode)
  useEffect(() => {
    if (!isBrowser() || !preload || lazyLoad) return;
    preloadFonts(config.fonts);
  }, [config.fonts, preload, lazyLoad]);

  // Auto-load fonts on mount (only in non-lazy mode)
  useEffect(() => {
    if (!isBrowser() || !autoLoad || lazyLoad) return;

    const loadAllFonts = async () => {
      const fontKeys = Object.keys(config.fonts);

      // Mark all as loading
      setFontStates((prev) => {
        const next = { ...prev };
        for (const key of fontKeys) {
          next[key] = { loading: true, loaded: false, error: null };
        }
        return next;
      });

      // Load fonts
      try {
        await loadFonts(config.fonts, (loaded) => {
          setFontStates((prev) => {
            const next = { ...prev };
            for (const key of loaded) {
              next[key] = { loading: false, loaded: true, error: null };
            }
            return next;
          });
        });
      } catch (error) {
        console.error('Failed to load fonts:', error);
      }
    };

    loadAllFonts();
  }, [config.fonts, autoLoad, lazyLoad]);

  // Typography context value
  const typographyValue = useMemo<TypographyContextValue>(
    () => ({
      config,
      scale,
      fonts: config.fonts,
      variants,
      resolvedVariants,
      initialized: true,
    }),
    [config, scale, variants, resolvedVariants]
  );

  // Font context value
  const fontValue = useMemo<FontContextValue>(
    () => ({
      fontStates,
      allFontsState,
      loadFont,
      reloadFonts,
      lazyLoad,
      requestFont,
      requestedFonts,
    }),
    [fontStates, allFontsState, loadFont, reloadFonts, lazyLoad, requestFont, requestedFonts]
  );

  return (
    <TypographyContext.Provider value={typographyValue}>
      <FontContext.Provider value={fontValue}>{children}</FontContext.Provider>
    </TypographyContext.Provider>
  );
}

TypographyProvider.displayName = 'TypographyProvider';
