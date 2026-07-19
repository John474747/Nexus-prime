import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// PORT and BASE_PATH are Replit-specific; fall back to safe defaults for
// Vercel builds and other CI environments where they are not set.
const port = Number(process.env.PORT ?? 3000);
const basePath = process.env.BASE_PATH ?? '/';

const isReplit = Boolean(process.env.REPL_ID);

export default defineConfig(async () => ({
  base: basePath,
  plugins: [
    react(),
    tailwindcss({ optimize: false }),
    ...(isReplit
      ? [
          (await import('@replit/vite-plugin-runtime-error-modal')).default(),
          (await import('@replit/vite-plugin-cartographer')).cartographer({
            root: path.resolve(import.meta.dirname, '..'),
          }),
          (await import('@replit/vite-plugin-dev-banner')).devBanner(),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, '..', '..', 'attached_assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
}));
