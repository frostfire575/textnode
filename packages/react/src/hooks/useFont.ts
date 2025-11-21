/**
 * useFont Hook
 *
 * Track loading state for a specific font.
 */

import { useMemo, useCallback } from 'react';
import { useFontContext } from '../context/FontContext';
import type { FontLoadingState } from '@textnode/core';

/**
 * Hook return type
 */
export interface UseFontReturn extends FontLoadingState {
  /** Manually trigger font load */
  load: () => Promise<void>;
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
 * // Lazy loading
 * function CodeBlock({ children }) {
 *   const { loaded, load } = useFont('mono');
 *
 *   useEffect(() => {
 *     // Load mono font when code block is rendered
 *     if (!loaded) load();
 *   }, [loaded, load]);
 *
 *   return <pre>{children}</pre>;
 * }
 * ```
 */
export function useFont(fontKey: string): UseFontReturn {
  const { fontStates, loadFont } = useFontContext();

  const state = useMemo<FontLoadingState>(() => {
    return (
      fontStates[fontKey] || {
        loading: false,
        loaded: false,
        error: null,
      }
    );
  }, [fontStates, fontKey]);

  const load = useCallback(async () => {
    await loadFont(fontKey);
  }, [loadFont, fontKey]);

  return {
    ...state,
    load,
  };
}
