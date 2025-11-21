# @textnode/dev

> Development tools for the textnode typography system

Part of the [textnode](https://github.com/frostfire575/textnode) typography system.

## Features

- **Font Debug Panel** - Inspect font loading state in real-time
- **Type Scale Visualizer** - Preview all scale values visually
- **CLS Monitor** - Track Cumulative Layout Shift scores
- **Font Loading Inspector** - Debug font loading issues

## Installation

```bash
npm install -D @textnode/dev
```

## Components

### `<FontDebugPanel>`

Interactive panel showing font loading status.

```tsx
import { FontDebugPanel } from '@textnode/dev';

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && <FontDebugPanel />}
    </>
  );
}
```

**Features:**
- Real-time font loading status
- Shows loaded, loading, and failed fonts
- Displays font file paths
- Toggleable visibility

### `<TypeScaleVisualizer>`

Visual preview of your type scale.

```tsx
import { TypeScaleVisualizer } from '@textnode/dev';

function DesignSystemPage() {
  return (
    <TypeScaleVisualizer
      showPixelValues
      showRatios
      sampleText="The quick brown fox"
    />
  );
}
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showPixelValues` | `boolean` | `true` | Show px values |
| `showRatios` | `boolean` | `false` | Show scale ratios |
| `sampleText` | `string` | `'Aa'` | Preview text |
| `darkMode` | `boolean` | `false` | Dark theme |

### `<CLSMonitor>`

Track and display Cumulative Layout Shift.

```tsx
import { CLSMonitor } from '@textnode/dev';

function App() {
  return (
    <>
      <YourApp />
      <CLSMonitor position="bottom-right" />
    </>
  );
}
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `string` | `'bottom-right'` | Panel position |
| `threshold` | `number` | `0.1` | Warning threshold |
| `showHistory` | `boolean` | `true` | Show shift history |

## Hooks

### `useCLSTracking()`

Programmatic CLS tracking.

```tsx
import { useCLSTracking } from '@textnode/dev';

function MyComponent() {
  const { score, shifts, isGood } = useCLSTracking();

  return (
    <div>
      CLS Score: {score.toFixed(4)}
      Status: {isGood ? '✅ Good' : '⚠️ Needs work'}
    </div>
  );
}
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `score` | `number` | Current CLS score |
| `shifts` | `array` | Individual shift events |
| `isGood` | `boolean` | Score < 0.1 |
| `needsImprovement` | `boolean` | 0.1 < Score < 0.25 |
| `isPoor` | `boolean` | Score > 0.25 |

## Usage Tips

### Development Only

Always conditionally render dev tools:

```tsx
{process.env.NODE_ENV === 'development' && <FontDebugPanel />}
```

### Keyboard Shortcuts

- `Ctrl+Shift+T` - Toggle type scale visualizer
- `Ctrl+Shift+F` - Toggle font debug panel
- `Ctrl+Shift+C` - Toggle CLS monitor

### Custom Styling

All components accept `className` and `style` props:

```tsx
<FontDebugPanel
  className="my-debug-panel"
  style={{ zIndex: 9999 }}
/>
```

## Related Packages

- [@textnode/core](https://www.npmjs.com/package/@textnode/core) - Core system
- [@textnode/react](https://www.npmjs.com/package/@textnode/react) - React components
- [@textnode/nextjs](https://www.npmjs.com/package/@textnode/nextjs) - Next.js integration

## License

MIT
