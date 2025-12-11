# VS Code IntelliSense Setup for Design Tokens

## ✅ What's Configured

Your VS Code workspace is configured to provide autocomplete for:

- ✅ All Tailwind utility classes from your design tokens (`bg-primary`, `text-surface`, etc.)
- ✅ Typography classes (`text-display-large`, `font-body-medium`, etc.)
- ✅ Works in `.liquid` files
- ✅ Works in HTML, JS, and CSS files

## 📦 Required Extension

**Tailwind CSS IntelliSense** (already installed ✅)

This is the only extension you need! It provides:

- Autocomplete for all Tailwind utilities including your custom theme
- Hover previews showing the actual CSS
- Linting and validation
- Color decorators

## 🔧 How It Works

The Tailwind extension:

- Reads your `@theme` definitions from `tokens/build/tailwind.theme.css`
- Scans your `.liquid` files for class attributes
- Provides autocomplete for all available utilities
- Only classes you actually use get generated in the final CSS

## 💡 Usage

Just start typing in a `class` attribute:

```liquid
<div class='bg-|'>
  <!-- Autocomplete will suggest: bg-primary, bg-surface, bg-error, etc. -->
</div>

<h1 class='text-|'>
  <!-- Autocomplete will suggest: text-display-large, text-on-surface, etc. -->
</h1>
```

## 🔄 Refresh IntelliSense

After regenerating tokens with `npm run tokens:build`, IntelliSense updates automatically. If needed:

- **Reload VS Code**: `Cmd/Ctrl + Shift + P` → "Reload Window"

## 🎯 Configured Settings

Your `.vscode/settings.json` includes:

- `tailwindCSS.includeLanguages` - Enables Tailwind IntelliSense in Liquid files
- `tailwindCSS.experimental.classRegex` - Detects class attributes in Liquid syntax

## 🐛 Troubleshooting

### Autocomplete not working?

1. **Check Tailwind extension is active**

   ```bash
   code --list-extensions | grep tailwindcss
   ```

2. **Rebuild tokens**

   ```bash
   npm run tokens:build
   ```

3. **Reload VS Code**
   - `Cmd/Ctrl + Shift + P` → "Reload Window"

### No suggestions in Liquid files?

1. Check that file is recognized as `liquid` (bottom-right corner of VS Code)
2. Verify `tailwindCSS.includeLanguages` is set in `.vscode/settings.json`

## 📝 Notes

- **On-demand generation**: Tailwind v4 only generates CSS for classes you actually use
- **Hover previews**: Hover over class names to see the generated CSS
- **Color decorators**: Color values show visual color swatches in the editor
