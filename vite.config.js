import { globSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const input = globSync('examples/**/*.html', {cwd: resolve(__dirname)})
    .map(name => resolve(__dirname, name))

export default defineConfig({
  build: {
    rollupOptions: {
      input,
    },
    sourcemap: true,
  },
  server: {
    host: '0.0.0.0',
    port: 9514
  },
})
