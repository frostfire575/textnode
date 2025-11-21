# @textnode/cli

> CLI tools for the textnode typography system

Part of the [textnode](https://github.com/frostfire575/textnode) typography system.

## Features

- **Project Initialization** - Interactive setup wizard
- **Font Analysis** - Analyze font files and metrics
- **Design Token Export** - CSS, SCSS, Tailwind, JSON output
- **Type Scale Preview** - Visualize your type scale

## Installation

```bash
# Global installation
npm install -g @textnode/cli

# Or use with npx
npx @textnode/cli init
```

## Commands

### `textnode init`

Initialize a new textnode project with interactive prompts.

```bash
textnode init
```

Creates a `textnode.config.ts` file with your chosen settings:
- Font configuration
- Type scale selection
- Variant definitions

### `textnode analyze`

Analyze your font configuration and display metrics.

```bash
textnode analyze
textnode analyze --config ./textnode.config.ts
```

Output includes:
- Font family names
- Available weights
- Fallback font suggestions
- Estimated file sizes

### `textnode export`

Export your typography configuration as design tokens.

```bash
# Export as CSS custom properties
textnode export --format css-vars

# Export as SCSS variables
textnode export --format scss

# Export as Tailwind config
textnode export --format tailwind

# Export as JSON
textnode export --format json

# Write to file
textnode export --format css-vars --output ./tokens.css
```

#### CSS Variables Output

```css
:root {
  /* Type Scale */
  --text-xs: 10.24px;
  --text-sm: 12.8px;
  --text-base: 16px;
  --text-lg: 20px;
  --text-xl: 25px;

  /* Font Families */
  --font-heading: 'Inter', 'Inter Fallback', Arial;
  --font-body: 'Source Sans Pro', 'Source Sans Pro Fallback', system-ui;
}
```

#### Tailwind Output

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['Inter', 'Inter Fallback', 'Arial'],
        body: ['Source Sans Pro', 'Source Sans Pro Fallback', 'system-ui'],
      },
      fontSize: {
        xs: '0.64rem',
        sm: '0.8rem',
        base: '1rem',
        lg: '1.25rem',
        xl: '1.563rem',
      },
    },
  },
};
```

## Options

| Option | Description |
|--------|-------------|
| `--config, -c` | Path to config file |
| `--format, -f` | Output format (css-vars, scss, tailwind, json) |
| `--output, -o` | Output file path |
| `--help` | Show help |
| `--version` | Show version |

## Example Workflow

```bash
# 1. Initialize project
textnode init

# 2. Review configuration
textnode analyze

# 3. Export tokens for your CSS
textnode export --format css-vars --output ./styles/tokens.css

# 4. Or generate Tailwind config
textnode export --format tailwind --output ./tailwind.typography.js
```

## Related Packages

- [@textnode/core](https://www.npmjs.com/package/@textnode/core) - Core system
- [@textnode/react](https://www.npmjs.com/package/@textnode/react) - React components
- [@textnode/nextjs](https://www.npmjs.com/package/@textnode/nextjs) - Next.js integration

## License

MIT
