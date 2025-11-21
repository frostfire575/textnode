# @textnode/react

> React components and hooks for the textnode typography system

Part of the [textnode](https://github.com/frostfire575/textnode) typography system.

## Features

- **Text & Heading Components** - Polymorphic components with variant support
- **Typography Provider** - Context-based configuration
- **Font Loading Hooks** - Track font loading state
- **Zero CLS** - Automatic fallback font matching
- **TypeScript First** - Full type safety

## Installation

```bash
npm install @textnode/core @textnode/react
```

## Quick Start

```tsx
import { TypographyProvider, Text, Heading } from '@textnode/react';

const config = {
  fonts: {
    heading: {
      name: 'Inter',
      files: { 700: '/fonts/inter-700.woff2' },
      fallback: { font: 'Arial' },
    },
    body: {
      name: 'Source Sans Pro',
      files: { 400: '/fonts/source-sans-400.woff2' },
      fallback: { font: 'system-ui' },
    },
  },
  scale: { type: 'modular', base: 16, ratio: 1.25 },
};

function App() {
  return (
    <TypographyProvider config={config}>
      <Heading level={1}>Welcome to Textnode</Heading>
      <Text variant="body">Beautiful typography made easy.</Text>
    </TypographyProvider>
  );
}
```

## Components

### `<Heading>`

Semantic heading component (h1-h6) with variant support.

```tsx
<Heading level={1}>Page Title</Heading>
<Heading level={2} variant="h1">Large Subheading</Heading>
<Heading level={1} balance>Long Title That Wraps Nicely</Heading>
```

### `<Text>`

Versatile text component with polymorphic `as` prop.

```tsx
<Text>Default span</Text>
<Text as="p" variant="body">Paragraph</Text>
<Text size="lg" weight={600}>Large bold text</Text>
<Text truncate lines={2}>Long text that gets truncated...</Text>
```

## Hooks

### `useFontLoadingState()`

```tsx
const { allLoaded, loadingFonts, failedFonts } = useFontLoadingState();

if (!allLoaded) return <Loading />;
```

### `useTypography()`

```tsx
const { scale, fonts, variants } = useTypography();
```

### `useVariant()`

```tsx
const bodyStyles = useVariant('body');
// { fontSize: '16px', lineHeight: 1.6, fontFamily: '...' }
```

## Props Reference

### Text Props

| Prop | Type | Description |
|------|------|-------------|
| `as` | `ElementType` | Render as different element |
| `variant` | `string` | Pre-configured style variant |
| `size` | `string \| number` | Font size from scale or px |
| `weight` | `number` | Font weight |
| `leading` | `number \| string` | Line height |
| `tracking` | `string` | Letter spacing preset |
| `truncate` | `boolean` | Enable text truncation |
| `lines` | `number` | Max lines before truncation |
| `balance` | `boolean` | Apply text-wrap: balance |

## Related Packages

- [@textnode/core](https://www.npmjs.com/package/@textnode/core) - Core system
- [@textnode/nextjs](https://www.npmjs.com/package/@textnode/nextjs) - Next.js integration
- [@textnode/dev](https://www.npmjs.com/package/@textnode/dev) - Dev tools

## License

MIT
