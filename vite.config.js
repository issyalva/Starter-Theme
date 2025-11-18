import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
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
        // Output JS file
        entryFileNames: 'theme.min.js',
        // Output CSS file
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'theme.min.css';
          }
          return assetInfo.name || 'assets/[name][extname]';
        },
        // Don't create separate chunk files
        manualChunks: undefined,
      },
    },

    // Don't generate source maps in production
    sourcemap: false,
  },
  plugins: [tailwindcss()],
});
