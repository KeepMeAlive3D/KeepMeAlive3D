// vite.config.ts
/// <reference types="vite/client" />
import path from "path"
import react from "@vitejs/plugin-react"
import {defineConfig as defineViteConfig, mergeConfig} from 'vite';
import {defineConfig as defineVitestConfig} from 'vitest/config';

// https://vitejs.dev/config/
// Merge taken from: https://stackoverflow.com/a/77229505
const viteConfig = defineViteConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});

export default mergeConfig(viteConfig, vitestConfig);
