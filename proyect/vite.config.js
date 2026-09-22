import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/MO/', // GitHub Pages sirve el repo en https://joserraul.github.io/MO/
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    host: true, // Escucha en la red local (0.0.0.0), no solo localhost
  },
})
