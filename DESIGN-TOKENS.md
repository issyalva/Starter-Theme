# Design Tokens

Design tokens exported from Figma using Tokens Studio and integrated with Tailwind CSS.

## 📁 Structure

```
tokens/
  ├── figma-tokens.json              # Raw tokens from Figma Tokens Studio
  └── build/                         # Generated files (git ignored)
      ├── tokens.css                 # CSS variables
      └── tailwind.theme.css         # Tailwind v4 @theme extension
```

## 🎨 Usage

Use standard Tailwind syntax with your token names:

```liquid
<!-- Color utilities -->
<div class='bg-primary text-on-primary'>Primary background</div>
<div class='bg-surface text-on-surface border-outline'>Surface with border</div>

<!-- Typography utilities -->
<h1 class='text-display-large font-display-large'>Large display text</h1>
<p class='text-body-large leading-body-large'>Body text with line height</p>
```

### Available Tokens

**Global Tokens** - Base design values (colors, spacing, typography scales)

**Semantic Tokens** - Context-specific design system tokens:

- System colors: `primary`, `secondary`, `tertiary`, `error`
- Surface colors: `surface`, `background`, `outline` (with variants)
- Typography scales: `display`, `headline`, `title`, `body`, `label`

**Colors** (use with Tailwind prefixes):

- `bg-{color}`, `text-{color}`, `border-{color}`
- Examples: `bg-primary`, `text-on-surface`, `border-outline`

**Typography** (responsive with mobile/desktop variants):

- Font sizes: `text-display-large`, `text-body-medium`, `text-label-small`
- Font weights: `font-display-large`, `font-body-medium`, `font-label-small`
- Line heights: `leading-display-large`, `leading-body-medium`, `leading-label-small`

## 🚀 How It Works

1. **Export** - Design tokens from Figma to `tokens/figma-tokens.json`
2. **Build** - Style Dictionary generates `tokens/build/tailwind.theme.css` with Tailwind v4 `@theme` directive
3. **Import** - Tailwind imports the theme extension
4. **Generate** - Tailwind generates CSS only for classes you actually use

## 🔄 Workflow

1. **Design in Figma** - Update tokens using Tokens Studio plugin, export to `tokens/figma-tokens.json`
2. **Build Tokens** - `npm run tokens:build`
3. **Build Theme** - `npm run build` (tokens auto-rebuild)
4. **Development** - `npm run dev` (watches for changes)

## 🎓 Token Mapping

Figma token names are automatically simplified when converted to Tailwind classes:

| Figma Token                        | Tailwind Class    | CSS Output                               |
| ---------------------------------- | ----------------- | ---------------------------------------- |
| `color-sys-light-primary`          | `bg-primary`      | `background-color: var(--color-primary)` |
| `typography-body-large-fontSize`   | `text-body-large` | `font-size: 1rem`                        |
| `typography-body-large-fontWeight` | `font-body-large` | `font-weight: 400`                       |

## 📚 Resources

- [Tailwind CSS](https://tailwindcss.com/docs/theme)
- [Style Dictionary](https://styledictionary.com/)
- [Tokens Studio](https://tokens.studio/)
