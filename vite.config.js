import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All /api requests from localhost:5173 are forwarded server-to-server
      // to the Render backend. The browser never sees a cross-origin request,
      // so CORS headers are not needed for local development.
      '/api': {
        target: 'https://boxboxindia.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      // Also proxy /uploads so resolveMediaUrl() works in local dev
      '/uploads': {
        target: 'https://boxboxindia.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
