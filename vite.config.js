import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // CRA emitted to build/; kept the same so existing deploy config
    // (vercel.json, any CI) doesn't need changing.
    outDir: 'build',
  },
});
