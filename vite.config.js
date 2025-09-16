// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// // import mkcert from 'vite-plugin-mkcert'

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     port: 3000,
//     // https: {
//     //   key: 'cert/cert.key',
//     //   cert: 'cert/cert.crt',
//     // }
//   },
//   plugins: [react()],
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
 base: "/",
 plugins: [react()],
 preview: {
  port: 3000,
  strictPort: true,
 },
 server: {
  port: 3000,
  strictPort: true,
  host: true,
  // origin: "http://localhost:3000",
  // origin: "http://0.0.0.0:3000",
 },
});
