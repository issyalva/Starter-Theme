# Shopify Starter Theme

A Shopify theme with a modern design token pipeline and TypeScript-powered UI components. It uses Tailwind CSS v4, Style Dictionary, and Vite for a fast build workflow.

> Based on [Shopify Skeleton Theme](https://github.com/Shopify/skeleton-theme) – a minimal, carefully structured foundation designed with modularity and best practices in mind.

## Features

- 🎨 **Design Token System** – Figma tokens synced via Style Dictionary to Tailwind CSS
- ⚡ **Tailwind CSS v4** – CSS-first architecture with `@theme` directive for on-demand class generation
- 🧩 **Component Library** – Modular TypeScript components (accordion, dialog, drawer, modal, disclosure)
- 🔧 **Vite Build System** – Fast production builds and watch mode
- 🌍 **Localization Ready** – Locale files and translation filters

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

This runs Shopify theme preview and Vite watch mode concurrently.

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

See `src/types/custom-elements.d.ts` for custom element tag typings used by the TypeScript components.

## Development

### Available Scripts

```bash
npm run dev              # Start Shopify dev + Vite watch
npm run build            # Build tokens + Vite production bundle
npm run tokens:build     # Generate tokens from Figma export
npm run tokens:watch     # Watch and rebuild tokens
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
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

### Styling approach

**Design tokens** define your visual language (colors, typography, spacing) in Figma. **Style Dictionary** transforms these into Tailwind theme extensions. **Tailwind** generates utility classes on-demand based on what you use in templates.

Benefits:

- Single source of truth (Figma)
- Only ships CSS for classes you use
- Full IntelliSense support
- Easy to update entire design system

## Documentation

- [Design Token System](./DESIGN-TOKENS.md)
- [VS Code IntelliSense Setup](./.vscode/INTELLISENSE.md)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
