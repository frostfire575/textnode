# @textnode/core

> Complete typography system for the web - framework agnostic

Part of the [textnode](https://github.com/frostfire575/textnode) typography system.

## Features

- **Type Scales** - Modular, fixed, and fluid (CSS clamp) scales
- **Font Management** - CSS @font-face generation with fallback matching
- **Lazy Loading Support** - Utilities for on-demand font CSS generation
- **Zero Layout Shift** - Automatic fallback font metrics for CLS prevention
- **Design Tokens** - Export to CSS variables, SCSS, Tailwind, or JSON
- **TypeScript First** - Full type safety and IntelliSense support

## Installation

```bash
npm install @textnode/core
```

## Quick Start

```typescript
import {
  calculateScale,
  generateAllFontsCSS,
  resolveAllVariants,
  DEFAULT_VARIANTS,
} from '@textnode/core';

// Define your configuration
const config = {
  fonts: {
    heading: {
      name: 'Inter',
      files: { 400: '/fonts/inter-400.woff2', 700: '/fonts/inter-700.woff2' },
      fallback: { font: 'Arial' },
      preload: true,
    },
    body: {
      name: 'Source Sans Pro',
      files: { 400: '/fonts/source-sans-400.woff2' },
      fallback: { font: 'system-ui' },
    },
  },
  scale: {
    type: 'modular',
    base: 16,
    ratio: 1.25, // Major Third
  },
};

// Calculate type scale
const scale = calculateScale(config.scale);
// { xs: 10.24, sm: 12.8, base: 16, lg: 20, xl: 25, '2xl': 31.25, ... }

// Generate CSS
const css = generateAllFontsCSS(config.fonts);
```

## Type Scales

### Modular Scale
```typescript
const scale = {
  type: 'modular',
  base: 16,
  ratio: 1.25,    // or 'majorThird', 'perfectFourth', 'goldenRatio'
  stepsDown: 2,
  stepsUp: 6,
};
```

### Fixed Scale
```typescript
const scale = {
  type: 'fixed',
  values: {
    xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30,
  },
};
```

### Fluid Scale (CSS Clamp)
```typescript
const scale = {
  type: 'fluid',
  minViewport: 320,
  maxViewport: 1200,
  minBase: 14,
  maxBase: 18,
  ratio: 1.2,
};
```

## Lazy Loading Utilities

For on-demand font loading, generate CSS for specific fonts only:

```typescript
import {
  generateSingleFontCSS,
  generateSelectedFontsCSS,
  appendCSS,
} from '@textnode/core';

// Generate CSS for one font
const monoCSS = generateSingleFontCSS('mono', config.fonts.mono);

// Generate CSS for multiple specific fonts
const selectedCSS = generateSelectedFontsCSS(config.fonts, ['heading', 'body']);

// Append CSS to existing style element (for incremental loading)
appendCSS(monoCSS, 'textnode-styles');
```

## Related Packages

- [@textnode/react](https://www.npmjs.com/package/@textnode/react) - React components
- [@textnode/nextjs](https://www.npmjs.com/package/@textnode/nextjs) - Next.js integration
- [@textnode/cli](https://www.npmjs.com/package/@textnode/cli) - CLI tools
- [@textnode/dev](https://www.npmjs.com/package/@textnode/dev) - Dev tools

## License

MIT
