import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // strictPort: the backend's CORS_ORIGINS allow-list expects exactly this origin.
  server: { port: 5173, strictPort: true },
  test: { environment: 'jsdom' },
});
