# Shopify Starter Theme

A Shopify theme with a simple CSS-first foundation, a minimal reset, and TypeScript-powered UI components.

> Based on [Shopify Skeleton Theme](https://github.com/Shopify/skeleton-theme) – a minimal, carefully structured foundation designed with modularity and best practices in mind.

## Features

- 🎨 **CSS Foundation** – Minimal reset and a path toward a reusable styleguide
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

## Styling Direction

The theme now starts with a minimal reset and room for a future styleguide built on CSS variables and semantic component styles.

Planned layers:

- `reset.css` for browser normalization and low-level defaults
- a future `styleguide.css` for typography, spacing, color, buttons, and form primitives
- optional utility systems later if needed, rather than as the source of truth

## Component System

### TypeScript Components

Located in `src/components/`:

- **Accordion** (`accordion-group.ts`, `accordion-item.ts`)
- **Dialog** (`dialog-base.ts`, `drawer.ts`, `modal.ts`)
- **Disclosure** (`disclosure.ts`)
- **DropdownMenu** (`dropdown-menu.ts`)
- **MegaMenu** (`mega-menu.ts`)

Components use TypeScript for type safety and are bundled via Vite to `assets/`.

See `src/types/custom-elements.d.ts` for custom element tag typings used by the TypeScript components.

## Development

### Available Scripts

```bash
npm run dev              # Start Shopify dev + Vite watch
npm run build            # Build production bundle
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
│   └── main.css         # Main CSS entry
├── templates/           # JSON page templates
└── vite.config.js              # Vite build configuration
```

## VS Code Setup

Recommended extensions:

- [Shopify Liquid](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) if you later reintroduce Tailwind utilities

## Architecture

### Styling approach

The current approach is to keep styling decisions in plain CSS first, then layer on more structure only where the theme needs it.

Benefits:

- Easier to evolve without tool lock-in
- Clear separation between reset, foundation, and component styles
- Optional migration path to Tailwind or BEM later

## Documentation

- [Reset stylesheet](./src/styles/reset.css)
- [Tailwind CSS v4](https://tailwindcss.com/docs) if you decide to add it back later
