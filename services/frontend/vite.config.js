import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/auth': {
        target: 'http://auth-service:4001',
        changeOrigin: true,
      },
      '/api/restaurants': {
        target: 'http://restaurant-service:4002',
        changeOrigin: true,
      },
      '/api/menu': {
        target: 'http://menu-service:4003',
        changeOrigin: true,
      },
      '/api/orders': {
        target: 'http://order-service:4004',
        changeOrigin: true,
      },
    }
  }
})