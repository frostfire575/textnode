# @textnode/nextjs

> Next.js integration for the textnode typography system

Part of the [textnode](https://github.com/frostfire575/textnode) typography system.

## Features

- **App Router Support** - Works with Next.js 13, 14, and 15
- **Font Optimization** - Automatic preloading and optimization
- **Server Components** - SSR-compatible font CSS generation
- **Zero Layout Shift** - Fallback font metrics prevent CLS
- **Metadata Helpers** - Easy font preload link generation

## Installation

```bash
npm install @textnode/core @textnode/react @textnode/nextjs
```

## Quick Start

### App Router (app/)

```tsx
// app/layout.tsx
import { TypographyProvider } from '@textnode/react';
import { getTextnodeFonts, generateFontPreloadMetadata } from '@textnode/nextjs';
import config from '../textnode.config';

const fonts = getTextnodeFonts(config);

export const metadata = {
  ...generateFontPreloadMetadata(config),
  title: 'My App',
};

export default function RootLayout({ children }) {
  return (
    <html className={fonts.variable}>
      <body>
        <TypographyProvider config={config}>
          {children}
        </TypographyProvider>
      </body>
    </html>
  );
}
```

### With next.config.js Plugin

```js
// next.config.js
const { withTextnode } = require('@textnode/nextjs');

module.exports = withTextnode({
  // your next config
});
```

## API Reference

### `getTextnodeFonts(config)`

Get font class names for the html element.

```tsx
const fonts = getTextnodeFonts(config);
// { variable: 'textnode-fonts', fonts: { heading: 'font-heading', body: 'font-body' } }
```

### `generateFontPreloadMetadata(config)`

Generate preload links for Next.js metadata.

```tsx
export const metadata = {
  ...generateFontPreloadMetadata(config),
};
```

### `getPreloadLinks(config)`

Get preload link URLs as strings.

```tsx
const links = getPreloadLinks(config);
// ['/fonts/inter-700.woff2', '/fonts/source-sans-400.woff2']
```

### `getFontCSSVariables(config)`

Generate CSS custom properties string.

```tsx
const css = getFontCSSVariables(config);
// ':root { --font-heading: "Inter", ... }'
```

### `withTextnode(nextConfig)`

Next.js config wrapper for font optimization.

```js
module.exports = withTextnode({
  // enables font optimization
});
```

## Configuration Example

```typescript
// textnode.config.ts
import type { TextnodeConfig } from '@textnode/core';

const config: TextnodeConfig = {
  fonts: {
    heading: {
      name: 'Inter',
      files: {
        400: '/fonts/inter-400.woff2',
        700: '/fonts/inter-700.woff2',
      },
      fallback: { font: 'Arial' },
      preload: true,
      variable: '--font-heading',
    },
    body: {
      name: 'Source Sans Pro',
      files: { 400: '/fonts/source-sans-400.woff2' },
      fallback: { font: 'system-ui' },
      variable: '--font-body',
    },
  },
  scale: {
    type: 'modular',
    base: 16,
    ratio: 1.25,
  },
};

export default config;
```

## Related Packages

- [@textnode/core](https://www.npmjs.com/package/@textnode/core) - Core system
- [@textnode/react](https://www.npmjs.com/package/@textnode/react) - React components
- [@textnode/dev](https://www.npmjs.com/package/@textnode/dev) - Dev tools

## License

MIT
