# Textnode

Complete typography system for React/Next.js with custom font management, type scales, and zero layout shift.

## Features

- **Zero Layout Shift** - Automatic fallback font matching prevents CLS during font loading
- **Lazy Font Loading** - Load fonts on-demand to reduce initial bundle size
- **Type Scale System** - Modular, fixed, or fluid typography scales
- **React Components** - Ready-to-use `<Text>` and `<Heading>` components
- **Full TypeScript Support** - Complete type safety with autocomplete
- **Next.js Integration** - Seamless plugin for App Router and Pages Router
- **Developer Tools** - Debug panel, type scale visualizer, and CLS monitor
- **CLI Tools** - Font analysis, config generation, and token export

## Installation

```bash
# Using pnpm (recommended)
pnpm add @textnode/core @textnode/react

# Using npm
npm install @textnode/core @textnode/react

# Using yarn
yarn add @textnode/core @textnode/react
```

### For Next.js

```bash
pnpm add @textnode/nextjs
```

### For development tools

```bash
pnpm add -D @textnode/dev @textnode/cli
```

## Quick Start

### 1. Create a configuration file

```typescript
// textnode.config.ts
import { defineConfig } from '@textnode/core';

export default defineConfig({
  fonts: {
    heading: {
      name: 'Poppins',
      files: {
        400: './fonts/poppins-regular.woff2',
        600: './fonts/poppins-semibold.woff2',
        700: './fonts/poppins-bold.woff2',
      },
      fallback: {
        font: 'Arial',
        auto: true, // Auto-calculate fallback metrics
      },
      display: 'swap',
      preload: true,
    },
    body: {
      name: 'Inter',
      files: {
        400: './fonts/inter-regular.woff2',
        500: './fonts/inter-medium.woff2',
      },
      fallback: {
        font: 'system-ui',
        auto: true,
      },
      display: 'swap',
      preload: true,
    },
  },

  scale: {
    type: 'modular',
    base: 16,
    ratio: 1.25, // Major Third
  },

  variants: {
    h1: {
      fontSize: '5xl',
      fontWeight: 700,
      lineHeight: 1.2,
      fontFamily: 'heading',
    },
    h2: {
      fontSize: '4xl',
      fontWeight: 600,
      lineHeight: 1.25,
      fontFamily: 'heading',
    },
    body: {
      fontSize: 'base',
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: 'body',
    },
  },
});
```

### 2. Wrap your app with the provider

```tsx
// app/layout.tsx (Next.js App Router)
import { TypographyProvider } from '@textnode/react';
import config from '../textnode.config';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TypographyProvider config={config}>
          {children}
        </TypographyProvider>
      </body>
    </html>
  );
}
```

### 3. Use the components

```tsx
import { Text, Heading } from '@textnode/react';

function Page() {
  return (
    <article>
      <Heading level={1}>Welcome to Textnode</Heading>
      <Text variant="body">
        A complete typography system for modern web applications.
      </Text>
      <Text variant="body" size="lg" weight={500}>
        With full TypeScript support and zero layout shift.
      </Text>
    </article>
  );
}
```

## Components

### Text

A versatile text component with variant support.

```tsx
<Text variant="body">Default body text</Text>
<Text variant="caption" color="gray">Small caption</Text>
<Text as="p" size="lg" weight={600}>Larger bold text</Text>
<Text truncate lines={2}>Long text that will be truncated...</Text>
```

**Props:**
- `variant` - Pre-configured style variant
- `as` - HTML element to render (default: `span`)
- `font` - Font family key
- `size` - Size from scale or pixel value
- `weight` - Font weight (100-900)
- `leading` - Line height
- `tracking` - Letter spacing
- `truncate` - Enable text truncation
- `lines` - Max lines for multi-line truncation
- `balance` - Enable CSS text-wrap: balance

### Heading

Semantic heading component (h1-h6).

```tsx
<Heading level={1}>Page Title</Heading>
<Heading level={2} variant="h1">Large Subheading</Heading>
<Heading level={3} balance>Balanced Heading Text</Heading>
```

**Props:**
- `level` - Heading level (1-6, required)
- `variant` - Style variant (defaults to `h{level}`)
- `balance` - Enable CSS text-wrap: balance
- Plus all Text props

## Hooks

### useTypography

Access the complete typography system.

```tsx
const { fonts, scale, variants, config } = useTypography();
```

### useFont

Track specific font loading state.

```tsx
const { loaded, loading, error, load } = useFont('heading');
```

With lazy loading enabled, `useFont()` automatically triggers font loading:

```tsx
// Enable lazy loading on provider
<TypographyProvider config={config} lazyLoad={true}>
  <App />
</TypographyProvider>

// Font loads when this component renders
function CodeBlock({ children }) {
  const { loaded } = useFont('mono'); // Auto-loads in lazy mode
  return <pre style={{ opacity: loaded ? 1 : 0.5 }}>{children}</pre>;
}
```

### useFontLoadingState

Track all fonts loading state.

```tsx
const { allLoaded, loadedFonts, loadingFonts, layoutStable } = useFontLoadingState();
```

### useScale

Access type scale values.

```tsx
const { getValue, getCSS, values, base, ratio } = useScale();
const h1Size = getCSS('5xl', 'rem'); // '3rem'
```

### useVariant

Get computed styles for a variant.

```tsx
const { styles, cssProperties, exists } = useVariant('h1');
```

## Type Scale Options

### Modular Scale

Uses a ratio to generate sizes.

```typescript
scale: {
  type: 'modular',
  base: 16,
  ratio: 1.25, // Major Third
}
```

### Fixed Scale

Explicit pixel values.

```typescript
scale: {
  type: 'fixed',
  values: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  }
}
```

### Fluid Scale

Responsive sizes using CSS `clamp()`.

```typescript
scale: {
  type: 'fluid',
  minViewport: 320,
  maxViewport: 1920,
  minScale: 0.875,
  maxScale: 1.25,
}
```

## Next.js Integration

```javascript
// next.config.js
const { withTextnode } = require('@textnode/nextjs');

module.exports = withTextnode({
  // Your Next.js config
});
```

## CLI Commands

```bash
# Initialize configuration
textnode init

# Analyze font metrics
textnode analyze ./fonts/my-font.woff2

# Export design tokens
textnode export --format css-vars
textnode export --format tailwind
textnode export --format json
```

## Development Tools

```tsx
import { FontDebugPanel, TypeScaleVisualizer, CLSMonitor } from '@textnode/dev';

// Only in development
{process.env.NODE_ENV === 'development' && (
  <>
    <FontDebugPanel position="bottom-right" />
    <CLSMonitor position="top-right" />
  </>
)}
```

## Packages

| Package | Description |
|---------|-------------|
| `@textnode/core` | Core typography system (framework-agnostic) |
| `@textnode/react` | React components and hooks |
| `@textnode/nextjs` | Next.js plugin and integration |
| `@textnode/cli` | CLI tools for font management |
| `@textnode/dev` | Development tools and visualizers |

## License

MIT
