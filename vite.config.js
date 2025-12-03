import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Set base path for chunk imports in Shopify
  base: '/assets/',

  build: {
    // Output to assets folder for Shopify theme
    outDir: 'assets',
    emptyOutDir: false, // Don't delete existing assets

    // Minify for production
    minify: 'terser',

    rollupOptions: {
      input: {
        js: resolve(__dirname, 'src/main.js'),
        css: resolve(__dirname, 'src/main.css'),
      },
      output: {
        // Output main JS file
        entryFileNames: 'theme.min.js',

        // Output dynamic import chunks with prefix for easy .gitignore
        chunkFileNames: 'chunk.[name].js',

        // Output CSS file
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'theme.min.css';
          }
          return assetInfo.name || 'assets/[name][extname]';
        },
      },
    },

    // Don't generate source maps in production
    sourcemap: false,
  },
  plugins: [tailwindcss()],
});
