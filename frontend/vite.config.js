// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const allowedHost = process.env.MINIAPP_HOST || 'localhost';
console.log("🌐 MINIAPP_HOST autorisé :", allowedHost);

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // ✅ autorise l’accès depuis ngrok
    port: 5173,
    strictPort: true,
    allowedHosts: [allowedHost],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
