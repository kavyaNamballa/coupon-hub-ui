import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";

config();

const PORT = parseInt(process.env.VITE_PORT) || 9999;

export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:8080",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
    host: process.env.VITE_HOST,
    port: PORT,
    strictPort: true,
    allowedHosts: [process.env.VITE_ALLOWED_HOST],
  },
});
