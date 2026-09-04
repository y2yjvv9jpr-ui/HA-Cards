import { defineConfig } from 'vite';

// Builds one self-contained ES module: dist/daniels-energy-cards.js
// Copy that single file to Home Assistant's /config/www/ folder.
export default defineConfig({
  build: {
    target: 'es2021',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'daniels-energy-cards.js',
    },
    rollupOptions: {
      // Bundle everything (incl. lit) so the card has no runtime imports.
      external: [],
      output: {
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
    minify: 'esbuild',
    emptyOutDir: true,
  },
});
