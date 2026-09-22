import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // En producción (build) GitHub Pages sirve el repo en /MO/.
  // En desarrollo local se mantiene la raíz / para no cambiar el flujo de trabajo.
  base: command === 'build' ? '/MO/' : '/',
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    host: true, // Escucha en la red local (0.0.0.0), no solo localhost
  },
}))
