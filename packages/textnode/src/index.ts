/**
 * @textnode/textnode - Complete typography system for React and Next.js
 *
 * This is the unified package that re-exports everything from @textnode/core and @textnode/react.
 * For most users, this is the only package you need to install.
 *
 * @example
 * ```tsx
 * import { createTypographyConfig, TypographyProvider, Text, Heading } from '@textnode/textnode';
 *
 * const config = createTypographyConfig({
 *   fonts: {
 *     sans: { family: 'Inter', fallbacks: ['system-ui', 'sans-serif'] }
 *   },
 *   scale: { type: 'modular', base: 16, ratio: 1.25 }
 * });
 *
 * function App() {
 *   return (
 *     <TypographyProvider config={config}>
 *       <Heading level={1}>Hello World</Heading>
 *       <Text>Beautiful typography made easy.</Text>
 *     </TypographyProvider>
 *   );
 * }
 * ```
 */

// Re-export everything from @textnode/core
export * from '@textnode/core';

// Re-export everything from @textnode/react
export * from '@textnode/react';
