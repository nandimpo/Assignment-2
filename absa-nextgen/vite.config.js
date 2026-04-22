import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Assignment-2/", // 👈 THIS FIXES YOUR 404
});
