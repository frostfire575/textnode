/**
 * useCLSTracking Hook
 *
 * Track Cumulative Layout Shift using PerformanceObserver.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * CLS entry from PerformanceObserver
 */
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

/**
 * CLS tracking state
 */
export interface CLSTrackingState {
  /** Current CLS value */
  value: number;
  /** CLS entries history */
  entries: Array<{ timestamp: number; value: number }>;
  /** Rating based on Core Web Vitals */
  rating: 'good' | 'needs-improvement' | 'poor';
  /** Is tracking active */
  isTracking: boolean;
}

/**
 * Get CLS rating based on Core Web Vitals thresholds
 */
function getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= 0.1) return 'good';
  if (value <= 0.25) return 'needs-improvement';
  return 'poor';
}

/**
 * useCLSTracking Hook
 *
 * Track CLS in real-time using PerformanceObserver.
 *
 * @example
 * ```tsx
 * function CLSDisplay() {
 *   const { value, rating, entries } = useCLSTracking();
 *
 *   return (
 *     <div>
 *       <p>CLS: {value.toFixed(3)}</p>
 *       <p>Rating: {rating}</p>
 *       <p>Shifts: {entries.length}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCLSTracking(): CLSTrackingState & {
  /** Reset CLS tracking */
  reset: () => void;
  /** Start tracking */
  start: () => void;
  /** Stop tracking */
  stop: () => void;
} {
  const [state, setState] = useState<CLSTrackingState>({
    value: 0,
    entries: [],
    rating: 'good',
    isTracking: false,
  });

  const observerRef = useRef<PerformanceObserver | null>(null);
  const clsValueRef = useRef(0);

  const reset = useCallback(() => {
    clsValueRef.current = 0;
    setState({
      value: 0,
      entries: [],
      rating: 'good',
      isTracking: state.isTracking,
    });
  }, [state.isTracking]);

  const stop = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    setState((prev) => ({ ...prev, isTracking: false }));
  }, []);

  const start = useCallback(() => {
    // Check if PerformanceObserver is available
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not available');
      return;
    }

    // Stop existing observer
    stop();

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as LayoutShiftEntry;

          // Only count shifts without recent user input
          if (!layoutShift.hadRecentInput) {
            clsValueRef.current += layoutShift.value;

            setState((prev) => ({
              value: clsValueRef.current,
              entries: [
                ...prev.entries,
                {
                  timestamp: Date.now(),
                  value: layoutShift.value,
                },
              ],
              rating: getCLSRating(clsValueRef.current),
              isTracking: true,
            }));
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      observerRef.current = observer;

      setState((prev) => ({ ...prev, isTracking: true }));
    } catch (error) {
      console.warn('Failed to start CLS tracking:', error);
    }
  }, [stop]);

  // Start tracking on mount
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  return {
    ...state,
    reset,
    start,
    stop,
  };
}
