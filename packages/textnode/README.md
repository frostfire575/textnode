# @textnode/textnode

Complete typography system for React and Next.js. Type scales, font loading, zero layout shift, and beautiful text rendering out of the box.

## Installation

```bash
npm install @textnode/textnode
# or
pnpm add @textnode/textnode
# or
yarn add @textnode/textnode
```

## Quick Start

```tsx
import { createTypographyConfig, TypographyProvider, Text, Heading } from '@textnode/textnode';

// Create your typography configuration
const config = createTypographyConfig({
  fonts: {
    sans: {
      family: 'Inter',
      fallbacks: ['system-ui', 'sans-serif'],
      weights: [400, 500, 600, 700],
    },
    mono: {
      family: 'JetBrains Mono',
      fallbacks: ['monospace'],
    },
  },
  scale: {
    type: 'modular',
    base: 16,
    ratio: 1.25, // Major third
  },
});

function App() {
  return (
    <TypographyProvider config={config}>
      <Heading level={1}>Welcome to textnode</Heading>
      <Text size="lg">Beautiful typography made easy.</Text>
      <Text variant="muted" size="sm">
        Zero layout shift, perfect font loading.
      </Text>
    </TypographyProvider>
  );
}
```

## Features

- **Type Scales** - Modular, fixed, or fluid scales with mathematical precision
- **Zero Layout Shift** - Automatic fallback font metrics prevent CLS
- **Font Loading** - Smart font loading with status tracking
- **React Components** - `<Text>` and `<Heading>` with full TypeScript support
- **Polymorphic** - Render as any HTML element with the `as` prop
- **Variants** - Pre-configured text styles for consistency
- **CSS Variables** - All values available as CSS custom properties

## Packages

This is the unified package that includes:

- **[@textnode/core](https://www.npmjs.com/package/@textnode/core)** - Core typography engine
- **[@textnode/react](https://www.npmjs.com/package/@textnode/react)** - React components and hooks

### Additional Packages

- **[@textnode/nextjs](https://www.npmjs.com/package/@textnode/nextjs)** - Next.js integration with App Router support
- **[@textnode/cli](https://www.npmjs.com/package/@textnode/cli)** - CLI for analyzing fonts and exporting tokens
- **[@textnode/dev](https://www.npmjs.com/package/@textnode/dev)** - Development tools and debug panel

## Type Scales

### Modular Scale

```tsx
const config = createTypographyConfig({
  scale: {
    type: 'modular',
    base: 16,
    ratio: 1.25, // Major third
  },
});
```

### Fixed Scale

```tsx
const config = createTypographyConfig({
  scale: {
    type: 'fixed',
    values: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
  },
});
```

### Fluid Scale

```tsx
const config = createTypographyConfig({
  scale: {
    type: 'fluid',
    minViewport: 320,
    maxViewport: 1200,
    minBase: 14,
    maxBase: 18,
    ratio: 1.25,
  },
});
```

## Components

### Text

```tsx
<Text>Default paragraph text</Text>
<Text size="lg">Large text</Text>
<Text weight="bold">Bold text</Text>
<Text variant="muted">Muted text</Text>
<Text as="span">Inline text</Text>
<Text font="mono">Monospace text</Text>
```

### Heading

```tsx
<Heading level={1}>Page Title (h1)</Heading>
<Heading level={2}>Section Title (h2)</Heading>
<Heading level={3}>Subsection (h3)</Heading>
<Heading as="div" level={1}>Styled as h1, rendered as div</Heading>
```

## Hooks

### useFontStatus

```tsx
import { useFontStatus } from 'textnode';

function MyComponent() {
  const { isLoaded, isLoading, error } = useFontStatus('Inter');

  if (isLoading) return <div>Loading font...</div>;
  if (error) return <div>Font failed to load</div>;

  return <div>Font loaded!</div>;
}
```

### useTypography

```tsx
import { useTypography } from 'textnode';

function MyComponent() {
  const { config, scale, fonts } = useTypography();

  return <div>Base size: {scale.base}px</div>;
}
```

## CSS Variables

All typography values are available as CSS custom properties:

```css
.custom-text {
  font-size: var(--textnode-font-size-lg);
  line-height: var(--textnode-line-height-lg);
  font-family: var(--textnode-font-sans);
}
```

## Documentation

- [Full Documentation](https://github.com/frostfire575/textnode#readme)
- [API Reference](https://github.com/frostfire575/textnode/blob/main/packages/core/README.md)
- [React Components](https://github.com/frostfire575/textnode/blob/main/packages/react/README.md)

## License

MIT
