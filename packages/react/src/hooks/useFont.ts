/**
 * useFont Hook
 *
 * Track loading state for a specific font.
 */

import { useMemo, useCallback, useEffect } from 'react';
import { useFontContext } from '../context/FontContext';
import type { FontLoadingState } from '@textnode/core';

/**
 * Options for useFont hook
 */
export interface UseFontOptions {
  /**
   * If true, automatically load the font when the hook is first called.
   * In lazy mode, this triggers both CSS injection and font loading.
   * Default: true in lazy mode, false in eager mode
   */
  eager?: boolean;
}

/**
 * Hook return type
 */
export interface UseFontReturn extends FontLoadingState {
  /** Manually trigger font load */
  load: () => Promise<void>;
  /** Whether this font has been requested (CSS injected) */
  requested: boolean;
}

/**
 * useFont Hook
 *
 * Track the loading state of a specific font and optionally
 * trigger manual loading.
 *
 * @param fontKey - The font key from configuration
 * @param options - Hook options
 *
 * @example
 * ```tsx
 * function Component() {
 *   const { loaded, loading, error, load } = useFont('heading');
 *
 *   if (loading) return <div>Loading font...</div>;
 *   if (error) return <div>Font failed to load</div>;
 *
 *   return <div>Font ready!</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With lazyLoad={true} on provider, font loads automatically on first use
 * function CodeBlock({ children }) {
 *   const { loaded } = useFont('mono'); // Automatically triggers load in lazy mode
 *
 *   return (
 *     <pre style={{ opacity: loaded ? 1 : 0.5 }}>
 *       {children}
 *     </pre>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Disable auto-load in lazy mode
 * function CodeBlock({ children }) {
 *   const { loaded, load } = useFont('mono', { eager: false });
 *
 *   // Manually trigger load when needed
 *   const handleFocus = () => { if (!loaded) load(); };
 *
 *   return <pre onFocus={handleFocus}>{children}</pre>;
 * }
 * ```
 */
export function useFont(fontKey: string, options: UseFontOptions = {}): UseFontReturn {
  const { fontStates, loadFont, lazyLoad, requestFont, requestedFonts } = useFontContext();

  // In lazy mode, default eager to true (auto-load on first use)
  // In non-lazy mode, default eager to false (don't auto-load)
  const eager = options.eager ?? lazyLoad;

  const state = useMemo<FontLoadingState>(() => {
    return (
      fontStates[fontKey] || {
        loading: false,
        loaded: false,
        error: null,
      }
    );
  }, [fontStates, fontKey]);

  const requested = requestedFonts.has(fontKey);

  const load = useCallback(async () => {
    if (lazyLoad) {
      // In lazy mode, use requestFont which handles CSS injection + loading
      await requestFont(fontKey);
    } else {
      // In eager mode, just load the font (CSS already injected)
      await loadFont(fontKey);
    }
  }, [loadFont, requestFont, fontKey, lazyLoad]);

  // Auto-load font when eager is true and font hasn't been loaded/requested yet
  useEffect(() => {
    if (eager && !state.loaded && !state.loading && !requested) {
      load();
    }
  }, [eager, state.loaded, state.loading, requested, load]);

  return {
    ...state,
    load,
    requested,
  };
}
