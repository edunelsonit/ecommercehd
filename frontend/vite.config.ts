import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss()
  ],

  server: {
    host: true, // This enables the --host behavior automatically
    //strictPort: true,
    origin: 'http://0.0.0.0:5173',
    //port: 5173,
    proxy: {
      // Any request starting with /api will be sent to the backend
      '/api': {
        target: 'http://localhost:5000', // Your backend URL
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
