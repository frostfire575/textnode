/**
 * Font Debug Panel Component
 *
 * A floating panel showing font loading status and CLS information.
 */

import React, { useState, useMemo } from 'react';
import { useFontLoadingState } from '@textnode/react';
import { useCLSTracking } from '../hooks/useCLSTracking';

/**
 * Font Debug Panel props
 */
export interface FontDebugPanelProps {
  /** Panel position */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Initially collapsed */
  defaultCollapsed?: boolean;
  /** Show CLS monitor */
  showCLS?: boolean;
}

/**
 * Status indicator styles
 */
const StatusDot: React.FC<{ status: 'loading' | 'loaded' | 'error' }> = ({ status }) => {
  const colors = {
    loading: '#f59e0b',
    loaded: '#10b981',
    error: '#ef4444',
  };

  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: colors[status],
        marginRight: 8,
      }}
    />
  );
};

/**
 * Font Debug Panel
 *
 * Shows real-time font loading status and CLS metrics.
 *
 * @example
 * ```tsx
 * // Only show in development
 * {process.env.NODE_ENV === 'development' && (
 *   <FontDebugPanel position="bottom-right" />
 * )}
 * ```
 */
export function FontDebugPanel({
  position = 'bottom-right',
  defaultCollapsed = false,
  showCLS = true,
}: FontDebugPanelProps): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { fontStates, allLoaded, loadedFonts, loadingFonts, failedFonts } = useFontLoadingState();
  const cls = useCLSTracking();

  // Position styles
  const positionStyles = useMemo(() => {
    const base = { position: 'fixed' as const, zIndex: 9999 };
    switch (position) {
      case 'top-left':
        return { ...base, top: 16, left: 16 };
      case 'top-right':
        return { ...base, top: 16, right: 16 };
      case 'bottom-left':
        return { ...base, bottom: 16, left: 16 };
      case 'bottom-right':
      default:
        return { ...base, bottom: 16, right: 16 };
    }
  }, [position]);

  // CLS color
  const clsColor = useMemo(() => {
    switch (cls.rating) {
      case 'good':
        return '#10b981';
      case 'needs-improvement':
        return '#f59e0b';
      case 'poor':
        return '#ef4444';
    }
  }, [cls.rating]);

  const containerStyle: React.CSSProperties = {
    ...positionStyles,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    minWidth: isCollapsed ? 'auto' : 280,
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
  };

  const contentStyle: React.CSSProperties = {
    padding: isCollapsed ? 0 : '12px',
    maxHeight: isCollapsed ? 0 : 400,
    overflow: 'auto',
    transition: 'max-height 0.2s ease, padding 0.2s ease',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle} onClick={() => setIsCollapsed(!isCollapsed)}>
        <span style={{ fontWeight: 600 }}>
          🔤 Textnode
          {allLoaded && (
            <span style={{ marginLeft: 8, color: '#10b981' }}>✓</span>
          )}
        </span>
        <span style={{ opacity: 0.6 }}>{isCollapsed ? '▼' : '▲'}</span>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {!isCollapsed && (
          <>
            {/* Font Status */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, opacity: 0.7 }}>
                Fonts
              </div>

              {Object.entries(fontStates).map(([name, state]) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}
                >
                  <StatusDot
                    status={
                      state.error ? 'error' : state.loading ? 'loading' : 'loaded'
                    }
                  />
                  <span>{name}</span>
                  {state.error && (
                    <span style={{ marginLeft: 8, color: '#ef4444', fontSize: 10 }}>
                      Error
                    </span>
                  )}
                </div>
              ))}

              {Object.keys(fontStates).length === 0 && (
                <div style={{ opacity: 0.5, fontStyle: 'italic' }}>
                  No fonts configured
                </div>
              )}
            </div>

            {/* Summary */}
            <div
              style={{
                padding: '8px 0',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.7 }}>Loaded</span>
                <span>{loadedFonts.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.7 }}>Loading</span>
                <span>{loadingFonts.length}</span>
              </div>
              {failedFonts.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ opacity: 0.7 }}>Failed</span>
                  <span style={{ color: '#ef4444' }}>{failedFonts.length}</span>
                </div>
              )}
            </div>

            {/* CLS Monitor */}
            {showCLS && (
              <div
                style={{
                  padding: '8px 0',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 8, opacity: 0.7 }}>
                  Layout Shift (CLS)
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: clsColor,
                    }}
                  >
                    {cls.value.toFixed(3)}
                  </span>
                  <span
                    style={{
                      backgroundColor: clsColor,
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 10,
                      textTransform: 'uppercase',
                    }}
                  >
                    {cls.rating.replace('-', ' ')}
                  </span>
                </div>
                <div style={{ marginTop: 4, opacity: 0.5, fontSize: 10 }}>
                  {cls.entries.length} shift{cls.entries.length !== 1 ? 's' : ''} detected
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

FontDebugPanel.displayName = 'FontDebugPanel';
