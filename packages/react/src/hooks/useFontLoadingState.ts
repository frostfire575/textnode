/**
 * useFontLoadingState Hook
 *
 * Track loading state for all fonts.
 */

import { useFontContext } from '../context/FontContext';
import type { AllFontsLoadingState, FontLoadingState } from '@textnode/core';

/**
 * Hook return type
 */
export interface UseFontLoadingStateReturn extends AllFontsLoadingState {
  /** Loading state for each individual font */
  fontStates: Record<string, FontLoadingState>;
  /** Reload all fonts */
  reloadFonts: () => Promise<void>;
}

/**
 * useFontLoadingState Hook
 *
 * Track the loading state of all fonts in the configuration.
 *
 * @example
 * ```tsx
 * function FontStatus() {
 *   const {
 *     allLoaded,
 *     loadedFonts,
 *     loadingFonts,
 *     failedFonts,
 *     layoutStable
 *   } = useFontLoadingState();
 *
 *   return (
 *     <div>
 *       {allLoaded ? 'All fonts ready!' : 'Loading fonts...'}
 *       <div>Loaded: {loadedFonts.join(', ')}</div>
 *       <div>Loading: {loadingFonts.join(', ')}</div>
 *       {failedFonts.length > 0 && (
 *         <div>Failed: {failedFonts.join(', ')}</div>
 *       )}
 *       <div>Layout stable: {layoutStable ? 'Yes' : 'No'}</div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditional rendering based on fonts
 * function App() {
 *   const { allLoaded, layoutStable } = useFontLoadingState();
 *
 *   // Wait for layout to stabilize before showing content
 *   if (!layoutStable) {
 *     return <LoadingScreen />;
 *   }
 *
 *   return <MainContent />;
 * }
 * ```
 */
export function useFontLoadingState(): UseFontLoadingStateReturn {
  const { fontStates, allFontsState, reloadFonts } = useFontContext();

  return {
    ...allFontsState,
    fontStates,
    reloadFonts,
  };
}
