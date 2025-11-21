/**
 * @textnode/dev
 *
 * Development tools for textnode typography system.
 *
 * This package provides:
 * - FontDebugPanel - Floating panel showing font loading status
 * - TypeScaleVisualizer - Visual preview of type scale
 * - CLSMonitor - Real-time CLS tracking
 * - useCLSTracking - Hook for CLS measurement
 *
 * Note: These components are intended for development use only.
 * They should not be included in production builds.
 */

// Components
export { FontDebugPanel, type FontDebugPanelProps } from './components/FontDebugPanel';
export { TypeScaleVisualizer, type TypeScaleVisualizerProps } from './components/TypeScaleVisualizer';
export { CLSMonitor, type CLSMonitorProps } from './components/CLSMonitor';

// Hooks
export { useCLSTracking, type CLSTrackingState } from './hooks/useCLSTracking';

// Re-export useful types
export type { FontLoadingState, AllFontsLoadingState } from '@textnode/core';
