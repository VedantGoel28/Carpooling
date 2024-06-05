import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "https://peer-to-peer-carpooling.onrender.com",
    port: process.env.PORT || 10000,
  }
})
