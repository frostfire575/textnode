/**
 * CLS Monitor Component
 *
 * Visual indicator for Cumulative Layout Shift.
 */

import React, { useMemo } from 'react';
import { useCLSTracking } from '../hooks/useCLSTracking';

/**
 * CLS Monitor props
 */
export interface CLSMonitorProps {
  /** Position on screen */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Alert threshold (default: 0.1) */
  threshold?: number;
  /** Compact mode (just the value) */
  compact?: boolean;
  /** Show history graph */
  showHistory?: boolean;
}

/**
 * CLS Monitor
 *
 * Displays real-time CLS tracking with visual indicators.
 *
 * @example
 * ```tsx
 * {process.env.NODE_ENV === 'development' && (
 *   <CLSMonitor position="top-right" threshold={0.1} />
 * )}
 * ```
 */
export function CLSMonitor({
  position = 'top-right',
  threshold = 0.1,
  compact = false,
  showHistory = false,
}: CLSMonitorProps): React.ReactElement {
  const { value, rating, entries, reset } = useCLSTracking();

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

  // Color based on rating
  const color = useMemo(() => {
    switch (rating) {
      case 'good':
        return '#10b981';
      case 'needs-improvement':
        return '#f59e0b';
      case 'poor':
        return '#ef4444';
    }
  }, [rating]);

  // Alert if over threshold
  const isAlert = value > threshold;

  const containerStyle: React.CSSProperties = {
    ...positionStyles,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: isAlert ? 'rgba(239, 68, 68, 0.95)' : 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    borderRadius: compact ? 20 : 8,
    padding: compact ? '6px 12px' : '12px 16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    minWidth: compact ? 'auto' : 160,
    transition: 'background-color 0.3s ease',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: compact ? 14 : 24,
    fontWeight: 700,
    color: compact ? 'white' : color,
    fontFamily: 'monospace',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  };

  const ratingStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: color,
    color: 'white',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 8,
  };

  const historyStyle: React.CSSProperties = {
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const barStyle = (entryValue: number): React.CSSProperties => ({
    height: 20,
    width: Math.min(100, (entryValue / 0.1) * 100) + '%',
    backgroundColor: entryValue > 0.1 ? '#ef4444' : entryValue > 0.05 ? '#f59e0b' : '#10b981',
    borderRadius: 2,
    marginBottom: 4,
  });

  const resetButtonStyle: React.CSSProperties = {
    marginTop: 12,
    padding: '4px 8px',
    fontSize: 10,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    backgroundColor: 'transparent',
    color: 'white',
    cursor: 'pointer',
    opacity: 0.7,
  };

  if (compact) {
    return (
      <div style={containerStyle} title={`CLS: ${value.toFixed(3)} (${rating})`}>
        <span style={{ marginRight: 6, opacity: 0.7 }}>CLS</span>
        <span style={valueStyle}>{value.toFixed(3)}</span>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>Layout Shift (CLS)</div>
      <div style={valueStyle}>{value.toFixed(3)}</div>
      <div style={ratingStyle}>{rating.replace('-', ' ')}</div>

      {showHistory && entries.length > 0 && (
        <div style={historyStyle}>
          <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 8 }}>
            Recent shifts ({entries.length})
          </div>
          {entries.slice(-5).map((entry, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, opacity: 0.5, width: 40 }}>
                {entry.value.toFixed(4)}
              </span>
              <div style={{ flex: 1 }}>
                <div style={barStyle(entry.value)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <button style={resetButtonStyle} onClick={reset}>
        Reset
      </button>
    </div>
  );
}

CLSMonitor.displayName = 'CLSMonitor';
