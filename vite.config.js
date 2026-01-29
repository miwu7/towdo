const path = require('path');
const { webcrypto } = require('crypto');
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

// 兼容旧版 Node：为 Vite 提供 webcrypto.getRandomValues
if (!globalThis.crypto && webcrypto) {
  globalThis.crypto = webcrypto;
}

module.exports = defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  css: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
