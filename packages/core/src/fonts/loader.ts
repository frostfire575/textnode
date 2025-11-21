/**
 * Font loading utilities
 *
 * Provides functions for loading fonts in the browser
 * and tracking their loading state.
 */

import type { FontDefinition, FontsConfig, FontLoadingState, FontWeight } from '../types';

/**
 * Check if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if FontFace API is supported
 */
export function isFontFaceAPISupported(): boolean {
  return isBrowser() && 'FontFace' in window;
}

/**
 * Load a single font file using FontFace API
 */
export async function loadFontFile(
  familyName: string,
  weight: FontWeight,
  filePath: string,
  style: string = 'normal'
): Promise<FontFace | null> {
  if (!isFontFaceAPISupported()) {
    console.warn('FontFace API not supported');
    return null;
  }

  try {
    const font = new FontFace(familyName, `url(${filePath})`, {
      weight: String(weight),
      style,
    });

    const loadedFont = await font.load();
    document.fonts.add(loadedFont);

    return loadedFont;
  } catch (error) {
    console.error(`Failed to load font ${familyName} (${weight}):`, error);
    throw error;
  }
}

/**
 * Load all weights for a font definition
 */
export async function loadFont(font: FontDefinition): Promise<FontFace[]> {
  const loadedFonts: FontFace[] = [];
  const style = font.style || 'normal';

  for (const [weight, filePath] of Object.entries(font.files)) {
    if (filePath) {
      const loadedFont = await loadFontFile(
        font.name,
        parseInt(weight, 10) as FontWeight,
        filePath,
        style
      );
      if (loadedFont) {
        loadedFonts.push(loadedFont);
      }
    }
  }

  return loadedFonts;
}

/**
 * Load multiple fonts concurrently
 */
export async function loadFonts(
  fonts: FontsConfig,
  onProgress?: (loaded: string[], total: number) => void
): Promise<Record<string, FontFace[]>> {
  const result: Record<string, FontFace[]> = {};
  const fontEntries = Object.entries(fonts);
  const total = fontEntries.length;
  const loaded: string[] = [];

  await Promise.all(
    fontEntries.map(async ([key, font]) => {
      try {
        result[key] = await loadFont(font);
        loaded.push(key);
        onProgress?.(loaded, total);
      } catch (error) {
        console.error(`Failed to load font "${key}":`, error);
        result[key] = [];
      }
    })
  );

  return result;
}

/**
 * Check if a font is loaded
 */
export function isFontLoaded(familyName: string, weight?: FontWeight): boolean {
  if (!isBrowser()) return false;

  const fontString = weight
    ? `${weight} 16px "${familyName}"`
    : `16px "${familyName}"`;

  return document.fonts.check(fontString);
}

/**
 * Wait for a font to be ready
 */
export async function waitForFont(
  familyName: string,
  weight?: FontWeight,
  timeout: number = 3000
): Promise<boolean> {
  if (!isBrowser()) return false;

  const fontString = weight
    ? `${weight} 16px "${familyName}"`
    : `16px "${familyName}"`;

  return Promise.race([
    document.fonts.load(fontString).then(() => true),
    new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), timeout)
    ),
  ]);
}

/**
 * Create a font loading state tracker
 */
export function createFontLoadingTracker(
  fonts: FontsConfig
): Map<string, FontLoadingState> {
  const tracker = new Map<string, FontLoadingState>();

  for (const key of Object.keys(fonts)) {
    tracker.set(key, {
      loading: false,
      loaded: false,
      error: null,
    });
  }

  return tracker;
}

/**
 * Inject CSS into document head
 */
export function injectCSS(css: string, id?: string): HTMLStyleElement | null {
  if (!isBrowser()) return null;

  // Check if already injected
  if (id) {
    const existing = document.getElementById(id);
    if (existing) {
      existing.textContent = css;
      return existing as HTMLStyleElement;
    }
  }

  const style = document.createElement('style');
  style.textContent = css;
  if (id) style.id = id;
  document.head.appendChild(style);

  return style;
}

/**
 * Inject preload link into document head
 */
export function injectPreloadLink(href: string): HTMLLinkElement | null {
  if (!isBrowser()) return null;

  // Check if already preloaded
  const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
  if (existing) return existing as HTMLLinkElement;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.href = href;
  link.crossOrigin = 'anonymous';

  // Determine type from extension
  const ext = href.split('.').pop()?.toLowerCase();
  if (ext === 'woff2') link.type = 'font/woff2';
  else if (ext === 'woff') link.type = 'font/woff';

  document.head.appendChild(link);

  return link;
}

/**
 * Preload fonts marked for preloading
 */
export function preloadFonts(fonts: FontsConfig): void {
  if (!isBrowser()) return;

  for (const font of Object.values(fonts)) {
    if (font.preload) {
      for (const filePath of Object.values(font.files)) {
        if (filePath) {
          injectPreloadLink(filePath);
        }
      }
    }
  }
}

/**
 * Subscribe to font loading events
 */
export function onFontsReady(callback: () => void): () => void {
  if (!isBrowser()) {
    callback();
    return () => {};
  }

  if (document.fonts.status === 'loaded') {
    callback();
    return () => {};
  }

  const handler = () => {
    callback();
  };

  document.fonts.ready.then(handler);

  return () => {
    // No cleanup needed for promise-based API
  };
}

/**
 * Get current loading status of all document fonts
 */
export function getFontsStatus(): 'loading' | 'loaded' {
  if (!isBrowser()) return 'loaded';
  return document.fonts.status;
}

/**
 * Append CSS to an existing style element or create one
 * Used for lazy loading to incrementally add font CSS
 */
export function appendCSS(css: string, id: string): HTMLStyleElement | null {
  if (!isBrowser()) return null;

  const existing = document.getElementById(id) as HTMLStyleElement | null;
  if (existing) {
    // Append to existing styles
    existing.textContent = (existing.textContent || '') + '\n\n' + css;
    return existing;
  }

  // Create new style element
  return injectCSS(css, id);
}

/**
 * Check if CSS for a specific font has been injected
 * Looks for the @font-face declaration in the style element
 */
export function isFontCSSInjected(fontName: string, styleId: string): boolean {
  if (!isBrowser()) return false;

  const styleElement = document.getElementById(styleId);
  if (!styleElement) return false;

  const css = styleElement.textContent || '';
  return css.includes(`font-family: '${fontName}'`);
}
