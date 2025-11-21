/**
 * Text Component
 *
 * Versatile text component with variant support and style overrides.
 */

import React, { forwardRef, useMemo } from 'react';
import type { CSSProperties, ElementType, ReactNode, ComponentPropsWithRef } from 'react';
import {
  type FontWeight,
  type LetterSpacingPreset,
  getScaleValue,
  scaleValueToCSS,
  LETTER_SPACING_PRESETS,
} from '@textnode/core';
import { useTypographyContext } from '../context/TypographyContext';

/**
 * Polymorphic component types
 */
type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends ElementType,
  Props = object
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithRef<C>, PropsToOmit<C, Props>>;

/**
 * Text component specific props
 */
export interface TextOwnProps {
  /** Pre-configured style variant */
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
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Font style */
  italic?: boolean;
  /** Text decoration */
  decoration?: 'none' | 'underline' | 'line-through';
  /** Text truncation with ellipsis */
  truncate?: boolean;
  /** Maximum number of lines (requires truncate) */
  lines?: number;
  /** Apply text-wrap: balance */
  balance?: boolean;
  /** Children content */
  children?: ReactNode;
}

/**
 * Text component props
 */
export type TextProps<C extends ElementType = 'span'> = PolymorphicComponentProp<
  C,
  TextOwnProps
>;

/**
 * Text component ref type
 */
export type TextRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];

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
 * Text Component
 *
 * A versatile text component that supports variants and style overrides.
 *
 * @example
 * ```tsx
 * // Using a variant
 * <Text variant="h1">Heading</Text>
 *
 * // With overrides
 * <Text variant="body" size="lg" weight={600}>Bold large text</Text>
 *
 * // As different element
 * <Text as="p" variant="body">Paragraph</Text>
 *
 * // With truncation
 * <Text truncate lines={2}>Long text that will be truncated...</Text>
 * ```
 */
function TextInner<C extends ElementType = 'span'>(
  {
    as,
    variant,
    font,
    size,
    weight,
    leading,
    tracking,
    color,
    align,
    transform,
    italic,
    decoration,
    truncate,
    lines,
    balance,
    style,
    className,
    children,
    ...rest
  }: TextProps<C>,
  ref: TextRef<C>
) {
  const { scale, fonts, resolvedVariants } = useTypographyContext();

  // Compute styles
  const computedStyle = useMemo<CSSProperties>(() => {
    const styles: CSSProperties = {};

    // Start with variant styles if specified
    if (variant && resolvedVariants[variant]) {
      const variantStyles = resolvedVariants[variant];
      if (variantStyles.fontSize) styles.fontSize = variantStyles.fontSize;
      if (variantStyles.fontWeight) styles.fontWeight = variantStyles.fontWeight;
      if (variantStyles.lineHeight) styles.lineHeight = variantStyles.lineHeight;
      if (variantStyles.fontFamily) styles.fontFamily = variantStyles.fontFamily;
      if (variantStyles.letterSpacing) styles.letterSpacing = variantStyles.letterSpacing;
      if (variantStyles.textTransform)
        styles.textTransform = variantStyles.textTransform as CSSProperties['textTransform'];
      if (variantStyles.fontStyle)
        styles.fontStyle = variantStyles.fontStyle as CSSProperties['fontStyle'];
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
    if (transform !== undefined) styles.textTransform = transform;
    if (italic) styles.fontStyle = 'italic';
    if (decoration !== undefined) styles.textDecoration = decoration;

    // Text balancing
    if (balance) {
      (styles as Record<string, unknown>).textWrap = 'balance';
    }

    // Truncation styles
    if (truncate) {
      if (lines && lines > 1) {
        // Multi-line truncation
        styles.display = '-webkit-box';
        (styles as Record<string, unknown>).WebkitLineClamp = lines;
        (styles as Record<string, unknown>).WebkitBoxOrient = 'vertical';
        styles.overflow = 'hidden';
      } else {
        // Single line truncation
        styles.overflow = 'hidden';
        styles.textOverflow = 'ellipsis';
        styles.whiteSpace = 'nowrap';
      }
    }

    // Merge with passed style prop
    return { ...styles, ...style };
  }, [
    variant,
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
    transform,
    italic,
    decoration,
    truncate,
    lines,
    balance,
    style,
  ]);

  const Component = as || 'span';

  return (
    <Component ref={ref} style={computedStyle} className={className} {...rest}>
      {children}
    </Component>
  );
}

/**
 * Text Component with forwardRef
 *
 * Uses double cast through unknown for proper polymorphic component typing.
 * This pattern is standard for polymorphic forwardRef components in React.
 */
// @ts-expect-error - Polymorphic forwardRef typing requires runtime cast
export const Text = forwardRef(TextInner) as unknown as <C extends ElementType = 'span'>(
  props: TextProps<C> & { ref?: TextRef<C> }
) => React.ReactElement | null;

(Text as React.FC).displayName = 'Text';
