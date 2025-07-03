import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: {},
  },
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.entry"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // PDF-related dependencies
          pdf: [
            "pdfjs-dist",
            "react-pdf",
            "@react-pdf-viewer/core",
            "@react-pdf-viewer/default-layout",
          ],
          // Animation and effects
          animations: ["framer-motion", "react-tsparticles", "tsparticles"],
          // HeyGen streaming avatar
          avatar: ["@heygen/streaming-avatar"],
          // React and routing
          react: ["react", "react-dom", "react-router-dom"],
          // UI utilities
          ui: ["react-icons", "date-fns", "zustand"],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Slightly increase the warning limit
  },
});
