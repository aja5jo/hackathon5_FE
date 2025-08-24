import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  // 환경변수를 HTML에 주입
  envPrefix: 'VITE_',
  server: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
