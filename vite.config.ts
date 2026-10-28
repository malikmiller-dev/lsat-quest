import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/lsat-quest/',
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  test: { include: ['src/**/*.test.{ts,tsx}'], environment: 'node' },
});
