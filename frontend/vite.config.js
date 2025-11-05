import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Sprawdź czy jesteśmy w produkcji
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // Konfiguracja dla produkcji
  define: {
    'process.env': {
      VITE_API_URL: isProduction 
        ? JSON.stringify('https://symulator-produkcji-backend.onrender.com')
        : JSON.stringify('http://localhost:8000')
    }
  }
})
