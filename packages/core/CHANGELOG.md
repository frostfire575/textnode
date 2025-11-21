# @textnode/core

## 0.3.0

### Minor Changes

- feat: add on-demand lazy font loading

  Add `lazyLoad` prop to `TypographyProvider` that enables on-demand font loading. When enabled, fonts are only loaded when `useFont()` is called, preventing unnecessary CSS generation and font downloads for unused fonts.

  New features:
  - `lazyLoad` prop on TypographyProvider (default: false)
  - `useFont()` auto-loads fonts in lazy mode on first use
  - `UseFontOptions.eager` to control auto-loading behavior
  - `generateSingleFontCSS`/`generateSelectedFontsCSS` for selective CSS generation
  - `appendCSS`/`isFontCSSInjected` utilities for incremental CSS injection

## 0.2.1

### Patch Changes

- docs: update npm package metadata
  - Enhanced package descriptions
  - Added comprehensive keywords for discoverability
  - Added repository, homepage, and bugs URLs
  - Added author information
  - Created detailed README for each package

## 0.2.0

### Minor Changes

- Initial release of textnode typography system
  - @textnode/core: Type scales, font management, CSS generation
  - @textnode/react: React components (Text, Heading) and hooks
  - @textnode/nextjs: Next.js plugin with font optimization
  - @textnode/cli: CLI tools for init, analyze, and export
  - @textnode/dev: Debug panel, visualizers, CLS monitor
