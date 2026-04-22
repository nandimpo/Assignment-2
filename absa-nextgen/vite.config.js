import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Assignment-2/",
  server: {
    open: "/Assignment-2/",
  },
});
