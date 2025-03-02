import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    allowedHosts: ['296d-2409-40c2-401f-15cc-b0ab-8be-54c9-1f75.ngrok-free.app']
  }
})