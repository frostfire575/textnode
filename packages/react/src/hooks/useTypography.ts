/**
 * useTypography Hook
 *
 * Access the complete typography system from context.
 */

import { useTypographyContext, type TypographyContextValue } from '../context/TypographyContext';

/**
 * Hook return type
 */
export interface UseTypographyReturn {
  /** Font definitions from configuration */
  fonts: TypographyContextValue['fonts'];
  /** Computed type scale values */
  scale: TypographyContextValue['scale'];
  /** Variant definitions */
  variants: TypographyContextValue['variants'];
  /** Resolved variant styles */
  resolvedVariants: TypographyContextValue['resolvedVariants'];
  /** Original configuration */
  config: TypographyContextValue['config'];
  /** Whether the system is initialized */
  initialized: boolean;
}

/**
 * useTypography Hook
 *
 * Access the complete typography system including fonts, scale,
 * variants, and configuration.
 *
 * @example
 * ```tsx
 * function Component() {
 *   const {
 *     fonts,
 *     scale,
 *     variants,
 *     config
 *   } = useTypography();
 *
 *   return (
 *     <div style={{ fontFamily: fonts.heading?.name }}>
 *       Content with heading font
 *     </div>
 *   );
 * }
 * ```
 */
export function useTypography(): UseTypographyReturn {
  const context = useTypographyContext();

  return {
    fonts: context.fonts,
    scale: context.scale,
    variants: context.variants,
    resolvedVariants: context.resolvedVariants,
    config: context.config,
    initialized: context.initialized,
  };
}
