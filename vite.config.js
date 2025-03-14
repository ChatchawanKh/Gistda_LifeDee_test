import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    https: {
      key: 'cert/cert.key',
      cert: 'cert/cert.crt',
    }
  },
  plugins: [react()],
});
