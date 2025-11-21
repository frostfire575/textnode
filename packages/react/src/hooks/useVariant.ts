/**
 * useVariant Hook
 *
 * Get computed styles for a specific variant.
 */

import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { ComputedVariantStyles } from '@textnode/core';
import { useTypographyContext } from '../context/TypographyContext';

/**
 * Hook return type
 */
export interface UseVariantReturn {
  /** Computed variant styles */
  styles: ComputedVariantStyles;
  /** Styles as React CSSProperties */
  cssProperties: CSSProperties;
  /** Whether the variant exists */
  exists: boolean;
}

/**
 * Convert computed styles to CSSProperties
 */
function toReactCSS(styles: ComputedVariantStyles): CSSProperties {
  const css: CSSProperties = {};

  if (styles.fontSize) css.fontSize = styles.fontSize;
  if (styles.fontWeight) css.fontWeight = styles.fontWeight;
  if (styles.lineHeight) css.lineHeight = styles.lineHeight;
  if (styles.fontFamily) css.fontFamily = styles.fontFamily;
  if (styles.letterSpacing) css.letterSpacing = styles.letterSpacing;
  if (styles.textTransform) css.textTransform = styles.textTransform as CSSProperties['textTransform'];
  if (styles.fontStyle) css.fontStyle = styles.fontStyle as CSSProperties['fontStyle'];

  return css;
}

/**
 * useVariant Hook
 *
 * Get the computed styles for a specific text variant.
 *
 * @param variantName - The variant name from configuration
 *
 * @example
 * ```tsx
 * function CustomHeading({ children }) {
 *   const { cssProperties, exists } = useVariant('h1');
 *
 *   if (!exists) {
 *     console.warn('Variant "h1" not found');
 *   }
 *
 *   return <h1 style={cssProperties}>{children}</h1>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Combine with custom styles
 * function Article({ title, content }) {
 *   const heading = useVariant('h2');
 *   const body = useVariant('body');
 *
 *   return (
 *     <article>
 *       <h2 style={{ ...heading.cssProperties, marginBottom: '1rem' }}>
 *         {title}
 *       </h2>
 *       <div style={body.cssProperties}>
 *         {content}
 *       </div>
 *     </article>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Access raw style values
 * function FontInfo() {
 *   const { styles, exists } = useVariant('body');
 *
 *   if (!exists) return null;
 *
 *   return (
 *     <dl>
 *       <dt>Font Size</dt>
 *       <dd>{styles.fontSize}</dd>
 *       <dt>Font Weight</dt>
 *       <dd>{styles.fontWeight}</dd>
 *       <dt>Line Height</dt>
 *       <dd>{styles.lineHeight}</dd>
 *     </dl>
 *   );
 * }
 * ```
 */
export function useVariant(variantName: string): UseVariantReturn {
  const { resolvedVariants } = useTypographyContext();

  return useMemo(() => {
    const styles = resolvedVariants[variantName];
    const exists = !!styles;

    if (!exists) {
      return {
        styles: { fontSize: 16 },
        cssProperties: { fontSize: 16 },
        exists: false,
      };
    }

    return {
      styles,
      cssProperties: toReactCSS(styles),
      exists: true,
    };
  }, [resolvedVariants, variantName]);
}
