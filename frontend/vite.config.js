import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "react/jsx-runtime": path.resolve("./node_modules/react/jsx-runtime.js"),
    },
  },
});
