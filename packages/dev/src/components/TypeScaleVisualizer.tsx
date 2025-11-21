/**
 * Type Scale Visualizer Component
 *
 * Visual preview of all font sizes in the type scale.
 */

import React, { useState, useMemo } from 'react';
import { useScale, useTypography } from '@textnode/react';

/**
 * Type Scale Visualizer props
 */
export interface TypeScaleVisualizerProps {
  /** Custom sample text */
  sampleText?: string;
  /** Show raw values */
  showValues?: boolean;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
}

/**
 * Type Scale Visualizer
 *
 * Displays all font sizes from the configured type scale.
 *
 * @example
 * ```tsx
 * {process.env.NODE_ENV === 'development' && (
 *   <TypeScaleVisualizer sampleText="The quick brown fox" />
 * )}
 * ```
 */
export function TypeScaleVisualizer({
  sampleText = 'The quick brown fox jumps over the lazy dog',
  showValues = true,
  backgroundColor = '#f8fafc',
  textColor = '#1e293b',
}: TypeScaleVisualizerProps): React.ReactElement {
  const { values, keys, base, ratio, isFluid } = useScale();
  const { config } = useTypography();
  const [selectedFont, setSelectedFont] = useState<string | null>(null);

  // Get font family CSS
  const fontFamilyStyle = useMemo(() => {
    if (!selectedFont || !config.fonts[selectedFont]) {
      return undefined;
    }
    const font = config.fonts[selectedFont];
    const fallback = font.fallback?.font || 'sans-serif';
    return `'${font.name}', '${font.name} Fallback', ${fallback}`;
  }, [selectedFont, config.fonts]);

  const fontKeys = Object.keys(config.fonts);

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor,
    color: textColor,
    padding: 24,
    borderRadius: 8,
    maxWidth: 800,
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 8,
  };

  const infoStyle: React.CSSProperties = {
    fontSize: 14,
    opacity: 0.7,
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  };

  const scaleItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    padding: '12px 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  };

  const labelStyle: React.CSSProperties = {
    width: 60,
    fontSize: 12,
    fontWeight: 500,
    opacity: 0.6,
    flexShrink: 0,
  };

  const valueStyle: React.CSSProperties = {
    width: 100,
    fontSize: 11,
    fontFamily: 'monospace',
    opacity: 0.5,
    flexShrink: 0,
  };

  const sampleStyle = (size: string | number): React.CSSProperties => ({
    fontSize: typeof size === 'number' ? `${size}px` : size,
    lineHeight: 1.4,
    fontFamily: fontFamilyStyle,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  });

  const fontSelectorStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
    marginTop: 12,
  };

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '4px 12px',
    fontSize: 12,
    border: '1px solid',
    borderColor: isActive ? '#3b82f6' : 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    backgroundColor: isActive ? '#3b82f6' : 'transparent',
    color: isActive ? 'white' : textColor,
    cursor: 'pointer',
  });

  // Sort keys by size (largest first for display)
  const sortedKeys = useMemo(() => {
    return [...keys].sort((a, b) => {
      const valA = values[a];
      const valB = values[b];
      const numA = typeof valA === 'number' ? valA : parseFloat(valA) || 0;
      const numB = typeof valB === 'number' ? valB : parseFloat(valB) || 0;
      return numB - numA;
    });
  }, [keys, values]);

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleStyle}>Type Scale</div>
        <div style={infoStyle}>
          <span>
            Base: <strong>{base}px</strong>
          </span>
          {ratio && (
            <span>
              Ratio: <strong>{ratio}</strong>
            </span>
          )}
          <span>
            Type: <strong>{isFluid ? 'Fluid' : config.scale.type}</strong>
          </span>
          <span>
            Steps: <strong>{keys.length}</strong>
          </span>
        </div>

        {/* Font selector */}
        {fontKeys.length > 0 && (
          <div style={fontSelectorStyle}>
            <button
              style={buttonStyle(selectedFont === null)}
              onClick={() => setSelectedFont(null)}
            >
              System
            </button>
            {fontKeys.map((key) => (
              <button
                key={key}
                style={buttonStyle(selectedFont === key)}
                onClick={() => setSelectedFont(key)}
              >
                {key}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scale items */}
      <div>
        {sortedKeys.map((key) => {
          const value = values[key];
          const displayValue =
            typeof value === 'number'
              ? `${value.toFixed(1)}px`
              : String(value).substring(0, 20) + '...';

          return (
            <div key={key} style={scaleItemStyle}>
              <div style={labelStyle}>{key}</div>
              {showValues && <div style={valueStyle}>{displayValue}</div>}
              <div style={sampleStyle(value)}>{sampleText}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

TypeScaleVisualizer.displayName = 'TypeScaleVisualizer';
