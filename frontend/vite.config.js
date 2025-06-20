// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const allowedHost = process.env.MINIAPP_HOST;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    allowedHosts: allowedHost ? [allowedHost] : 'all',
  },
});
