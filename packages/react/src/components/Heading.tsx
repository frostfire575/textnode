/**
 * Heading Component
 *
 * Semantic heading component (h1-h6) with variant support.
 */

import { forwardRef, useMemo } from 'react';
import type { CSSProperties, ReactNode, HTMLAttributes } from 'react';
import {
  type FontWeight,
  type LetterSpacingPreset,
  getScaleValue,
  scaleValueToCSS,
  LETTER_SPACING_PRESETS,
} from '@textnode/core';
import { useTypographyContext } from '../context/TypographyContext';

/**
 * Heading level type
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Heading element type
 */
type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Heading component props
 */
export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level (1-6, required for accessibility) */
  level: HeadingLevel;
  /** Style variant (defaults to h{level}) */
  variant?: string;
  /** Font family key from configuration */
  font?: string;
  /** Font size from scale or number (px) */
  size?: string | number;
  /** Font weight */
  weight?: FontWeight;
  /** Line height */
  leading?: number | string;
  /** Letter spacing (preset or CSS value) */
  tracking?: LetterSpacingPreset | string;
  /** Text color */
  color?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Apply text-wrap: balance for better line breaks */
  balance?: boolean;
  /** Text truncation with ellipsis */
  truncate?: boolean;
  /** Maximum number of lines (requires truncate) */
  lines?: number;
  /** Children content */
  children?: ReactNode;
}

/**
 * Resolve letter spacing value
 */
function resolveTracking(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value in LETTER_SPACING_PRESETS) {
    return LETTER_SPACING_PRESETS[value];
  }
  return value;
}

/**
 * Map level to element
 */
function levelToElement(level: HeadingLevel): HeadingElement {
  return `h${level}` as HeadingElement;
}

/**
 * Heading Component
 *
 * A semantic heading component that renders the correct HTML element
 * based on the level prop while allowing flexible styling.
 *
 * @example
 * ```tsx
 * // Basic usage - automatically uses h1 variant
 * <Heading level={1}>Page Title</Heading>
 *
 * // With custom variant (style of h1, semantic h2)
 * <Heading level={2} variant="h1">Large Subheading</Heading>
 *
 * // With text balancing
 * <Heading level={1} balance>
 *   A Long Heading That Should Break Nicely
 * </Heading>
 *
 * // With overrides
 * <Heading level={3} weight={700} color="blue">
 *   Custom Styled Heading
 * </Heading>
 * ```
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level,
      variant,
      font,
      size,
      weight,
      leading,
      tracking,
      color,
      align,
      balance = false,
      truncate,
      lines,
      style,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const { scale, fonts, resolvedVariants } = useTypographyContext();

    // Use variant or default to h{level}
    const effectiveVariant = variant || `h${level}`;

    // Compute styles
    const computedStyle = useMemo<CSSProperties>(() => {
      const styles: CSSProperties = {};

      // Start with variant styles
      if (resolvedVariants[effectiveVariant]) {
        const variantStyles = resolvedVariants[effectiveVariant];
        if (variantStyles.fontSize) styles.fontSize = variantStyles.fontSize;
        if (variantStyles.fontWeight) styles.fontWeight = variantStyles.fontWeight;
        if (variantStyles.lineHeight) styles.lineHeight = variantStyles.lineHeight;
        if (variantStyles.fontFamily) styles.fontFamily = variantStyles.fontFamily;
        if (variantStyles.letterSpacing) styles.letterSpacing = variantStyles.letterSpacing;
      }

      // Apply overrides
      if (font && fonts[font]) {
        const fontDef = fonts[font];
        const fallback = fontDef.fallback?.font || 'sans-serif';
        styles.fontFamily = `'${fontDef.name}', '${fontDef.name} Fallback', ${fallback}`;
      }

      if (size !== undefined) {
        if (typeof size === 'number') {
          styles.fontSize = `${size}px`;
        } else {
          const scaleValue = getScaleValue(scale, size);
          styles.fontSize = scaleValueToCSS(scaleValue);
        }
      }

      if (weight !== undefined) styles.fontWeight = weight;
      if (leading !== undefined) styles.lineHeight = leading;
      if (tracking !== undefined) styles.letterSpacing = resolveTracking(tracking);
      if (color !== undefined) styles.color = color;
      if (align !== undefined) styles.textAlign = align;

      // Text balancing for better line breaks
      if (balance) {
        (styles as Record<string, unknown>).textWrap = 'balance';
      }

      // Truncation styles
      if (truncate) {
        if (lines && lines > 1) {
          styles.display = '-webkit-box';
          (styles as Record<string, unknown>).WebkitLineClamp = lines;
          (styles as Record<string, unknown>).WebkitBoxOrient = 'vertical';
          styles.overflow = 'hidden';
        } else {
          styles.overflow = 'hidden';
          styles.textOverflow = 'ellipsis';
          styles.whiteSpace = 'nowrap';
        }
      }

      // Reset margin (optional, can be overridden)
      styles.margin = 0;

      // Merge with passed style prop
      return { ...styles, ...style };
    }, [
      effectiveVariant,
      resolvedVariants,
      font,
      fonts,
      size,
      scale,
      weight,
      leading,
      tracking,
      color,
      align,
      balance,
      truncate,
      lines,
      style,
    ]);

    const Element = levelToElement(level);

    return (
      <Element ref={ref} style={computedStyle} className={className} {...rest}>
        {children}
      </Element>
    );
  }
);

Heading.displayName = 'Heading';
