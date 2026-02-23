# Shopify Starter Theme

A Shopify theme built with a modern design token system and component architecture. Features Tailwind CSS v4 integration with Figma design tokens, modular TypeScript components, and a flexible styling system.

> Based on [Shopify Skeleton Theme](https://github.com/Shopify/skeleton-theme) – a minimal, carefully structured foundation designed with modularity and best practices in mind.

## Features

- 🎨 **Design Token System** – Figma tokens synced via Style Dictionary to Tailwind CSS
- ⚡ **Tailwind CSS v4** – CSS-first architecture with `@theme` directive for on-demand class generation
- 🧩 **Component Library** – Modular TypeScript components (accordion, dialog, drawer, modal, disclosure)
- 🔧 **Vite Build System** – Fast builds with watch mode and hot reload
- 📱 **Responsive Typography** – Automatic mobile/desktop variants from design tokens
- 🌍 **i18n Ready** – Translation system with locale files

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)
- [VS Code](https://code.visualstudio.com/) (recommended)

### Installation

1. **Clone and install dependencies**

   ```bash
   git clone <your-repo-url>
   cd your-theme-name
   npm install
   ```

2. **Start development**

   ```bash
   npm run dev
   ```

   This runs Shopify theme preview and Vite in watch mode.

3. **Build for production**
   ```bash
   npm run build
   ```

## Design Token System

This theme uses a **Figma → Style Dictionary → Tailwind CSS** pipeline for design tokens.

### Quick Usage

Use semantic token classes in your Liquid templates:

```liquid
<!-- Colors -->
<div class='bg-primary text-on-primary'>Primary button</div>
<div class='bg-surface text-on-surface border-outline'>Card</div>

<!-- Typography -->
<h1 class='text-display-large font-display-large'>Heading</h1>
<p class='text-body-medium leading-body-medium'>Body text</p>
```

### Update Tokens

1. Export design tokens from Figma (Tokens Studio) to `tokens/figma-tokens.json`
2. Run `npm run tokens:build`
3. Tailwind automatically generates classes for tokens you use

📖 **See [DESIGN-TOKENS.md](./DESIGN-TOKENS.md) for complete documentation**

## Component System

### TypeScript Components

Located in `src/components/`:

- **Accordion** (`accordion-group.ts`, `accordion-item.ts`)
- **Dialog** (`dialog-base.ts`, `drawer.ts`, `modal.ts`)
- **Disclosure** (`disclosure.ts`)

Components use TypeScript for type safety and are bundled via Vite to `assets/`.

### Custom element typing (TypeScript)

When adding a new autonomous custom element (for example, `ui-tabs`), register its tag in `src/types/custom-elements.d.ts` via `HTMLElementTagNameMap`.

This gives strong type inference for DOM queries like `querySelector('ui-tabs')` and `querySelectorAll('ui-tabs')`, reducing the need for `as` casts in component code.

Rule of thumb: if a new `ui-*` element is queried from TypeScript, add it to `HTMLElementTagNameMap` in the same PR as `customElements.define(...)`.

### Component conventions (TypeScript)

Use these conventions for predictable, maintainable components:

- **Class layout order**
  - Private fields (`state`, caches, cleanup arrays)
  - `connectedCallback()`
  - `disconnectedCallback()`
  - Public API (`show`, `hide`, `toggle`) when applicable
  - Private setup/helpers (`_setupX`, `_applyState`, etc.)
  - `customElements.define(...)` at file bottom
- **Handler naming**
  - Use `onX` names for event callbacks (for example, `onToggleOpen`, `onBackdropClick`)
- **Cleanup pattern**
  - Register teardown functions in `private _cleanupFns: (() => void)[] = []`
  - Use `private _addCleanup(cleanup: () => void)` to register teardown callbacks
  - Use `private _runCleanup()` in `disconnectedCallback()` to execute and clear cleanup callbacks
  - In `disconnectedCallback()`, run all cleanup functions, then clear arrays/caches
- **Typing and queries**
  - Prefer inferred custom element types from `HTMLElementTagNameMap`
  - Use `as` casts only when inference is not available (for example, generic slot selectors)
- **Lifecycle expectation**
  - Guard lifecycle setup with `private _isMounted = false` to prevent duplicate setup on re-attach
  - Keep `connectedCallback()` focused on setup and `disconnectedCallback()` focused on full teardown

### Liquid Components

**Blocks** (`blocks/`) – Small, reusable UI components:

- `text.liquid` – Text block with styling options
- `group.liquid` – Layout container (horizontal/vertical)

**Sections** (`sections/`) – Full-width page modules:

- `custom-section.liquid` – Example section with background image
- Template sections: `product.liquid`, `collection.liquid`, `cart.liquid`, etc.

**Snippets** (`snippets/`) – Reusable code fragments:

- `image.liquid` – Responsive image component
- `css-variables.liquid` – Global CSS variables from settings
- `meta-tags.liquid` – SEO and social meta tags

## Development

### Available Scripts

```bash
npm run dev              # Start Shopify dev + Vite watch
npm run build            # Build tokens + Vite production bundle
npm run tokens:build     # Generate tokens from Figma export
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

### File Structure

```
.
├── assets/              # Compiled CSS/JS + static files
├── blocks/              # Reusable UI components
├── config/              # Theme settings
├── layout/              # Page layouts
├── locales/             # Translation files
├── sections/            # Full-width page components
├── snippets/            # Reusable Liquid fragments
├── src/                 # Source files (CSS, JS)
│   ├── components/      # TypeScript components
│   └── main.css         # Main CSS entry (imports Tailwind + tokens)
├── templates/           # JSON page templates
├── tokens/              # Design token files
│   ├── figma-tokens.json       # Source tokens from Figma
│   └── build/                  # Generated CSS (git ignored)
├── style-dictionary.config.js  # Token transformation config
└── vite.config.js              # Vite build configuration
```

## VS Code Setup

Recommended extensions:

- [Shopify Liquid](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

See [.vscode/INTELLISENSE.md](./.vscode/INTELLISENSE.md) for configuration details.

## Architecture

### Styling Approach

**Design tokens** define your visual language (colors, typography, spacing) in Figma. **Style Dictionary** transforms these into Tailwind theme extensions. **Tailwind** generates utility classes on-demand based on what you use in templates.

Benefits:

- Single source of truth (Figma)
- Only ships CSS for classes you use
- Full IntelliSense support
- Easy to update entire design system

### Component Architecture

Follow Shopify's component model:

- **Blocks** for small, nestable pieces (buttons, text, images)
- **Sections** for full-width layouts (hero, product grid)
- **Snippets** for non-editable reusable code

Use `{% schema %}` to make blocks/sections customizable in the theme editor.

## Documentation

- [Design Token System](./DESIGN-TOKENS.md)
- [VS Code IntelliSense Setup](./.vscode/INTELLISENSE.md)
- [Shopify Theme Architecture](https://shopify.dev/docs/storefronts/themes/architecture)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

## License

[MIT](./LICENSE.md)
