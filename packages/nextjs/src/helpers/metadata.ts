/**
 * Metadata helpers for Next.js
 *
 * Provides utilities for generating metadata and link tags.
 */

import type { TextnodeConfig } from '@textnode/core';

/**
 * Get MIME type for font format
 */
function getFontMimeType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'woff2':
      return 'font/woff2';
    case 'woff':
      return 'font/woff';
    case 'ttf':
      return 'font/ttf';
    case 'otf':
      return 'font/otf';
    default:
      return 'font/woff2';
  }
}

/**
 * Font preload link configuration
 */
export interface FontPreloadLink {
  rel: 'preload';
  href: string;
  as: 'font';
  type: string;
  crossOrigin: 'anonymous';
}

/**
 * Generate font preload links for Next.js metadata
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { generateFontPreloadMetadata } from '@textnode/nextjs';
 * import config from '../textnode.config';
 *
 * export const metadata: Metadata = {
 *   ...generateFontPreloadMetadata(config),
 *   title: 'My App',
 * };
 * ```
 */
export function generateFontPreloadMetadata(config: TextnodeConfig): {
  icons: { other: FontPreloadLink[] };
} {
  const preloadLinks: FontPreloadLink[] = [];

  for (const font of Object.values(config.fonts)) {
    if (font.preload) {
      for (const filePath of Object.values(font.files)) {
        if (filePath) {
          preloadLinks.push({
            rel: 'preload',
            href: filePath,
            as: 'font',
            type: getFontMimeType(filePath),
            crossOrigin: 'anonymous',
          });
        }
      }
    }
  }

  return {
    icons: {
      other: preloadLinks,
    },
  };
}

/**
 * Create link elements array for manual insertion
 *
 * @example
 * ```tsx
 * // For Pages Router or custom head handling
 * import { createPreloadLinkElements } from '@textnode/nextjs';
 * import Head from 'next/head';
 *
 * function MyApp() {
 *   const links = createPreloadLinkElements(config);
 *
 *   return (
 *     <>
 *       <Head>
 *         {links.map((link, i) => (
 *           <link key={i} {...link} />
 *         ))}
 *       </Head>
 *       <Component />
 *     </>
 *   );
 * }
 * ```
 */
export function createPreloadLinkElements(
  config: TextnodeConfig
): FontPreloadLink[] {
  const links: FontPreloadLink[] = [];

  for (const font of Object.values(config.fonts)) {
    if (font.preload) {
      for (const filePath of Object.values(font.files)) {
        if (filePath) {
          links.push({
            rel: 'preload',
            href: filePath,
            as: 'font',
            type: getFontMimeType(filePath),
            crossOrigin: 'anonymous',
          });
        }
      }
    }
  }

  return links;
}

/**
 * Get resource hints for fonts
 */
export function getFontResourceHints(config: TextnodeConfig): {
  preconnect: string[];
  dnsPrefetch: string[];
} {
  const preconnect: Set<string> = new Set();
  const dnsPrefetch: Set<string> = new Set();

  // Check for external font URLs
  for (const font of Object.values(config.fonts)) {
    for (const filePath of Object.values(font.files)) {
      if (filePath && (filePath.startsWith('http://') || filePath.startsWith('https://'))) {
        try {
          const url = new URL(filePath);
          preconnect.add(url.origin);
        } catch {
          // Invalid URL, skip
        }
      }
    }
  }

  return {
    preconnect: Array.from(preconnect),
    dnsPrefetch: Array.from(dnsPrefetch),
  };
}
