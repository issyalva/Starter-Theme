import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // Output to assets folder for Shopify theme
    outDir: 'assets',
    emptyOutDir: false, // Don't delete existing assets
    
    // Minify for production
    minify: 'terser',
    
    rollupOptions: {
      input: resolve(__dirname, 'src/main.js'),
      output: {
        // Output a single JS file with a simple name
        entryFileNames: 'theme.min.js',
        // Don't create separate chunk files
        manualChunks: undefined,
      },
    },
    
    // Don't generate source maps in production
    sourcemap: false,
  },
});
