import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "hub-pwa-192x192.png",
        "hub-pwa-512x512.png",
        "robots.txt",
      ],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      manifest: {
        name: "hub-portal",
        short_name: "hub-portal",
        description: "پورتال هاب بانک سینا",
        theme_color: "#ffffff",
        icons: [
          {
            src: "hub-pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "hub-pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    port: 5177,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
