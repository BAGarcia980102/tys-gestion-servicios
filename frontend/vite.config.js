import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 👇 Agrega esta configuración
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  // 👇 Esto hace que todas las rutas vuelvan a index.html
  build: {
    rollupOptions: {
      input: '/index.html',
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
