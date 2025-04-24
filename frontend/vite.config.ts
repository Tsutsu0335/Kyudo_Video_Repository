import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 3000,
    https: {
      key: fs.readFileSync("./certs/server.key"),
      cert: fs.readFileSync("./certs/server.crt"),
    }
  },
  resolve: {
    alias: [
      { find: '@components/', replacement: `${__dirname}/src/components/`},
    ],
  },
})
