import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// add configuration to proxy requests from /backend to http://localhost:10115/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:10115',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})