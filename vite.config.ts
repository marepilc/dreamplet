import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(process.cwd(), 'src/index.ts'),
      name: 'Dreamplet',
      fileName: 'dreamplet'
    },
    rollupOptions: {
      external: ['canvaskit-wasm', 'gsap'],
      output: {
        globals: {
          'canvaskit-wasm': 'CanvasKitInit',
          gsap: 'gsap'
        }
      }
    }
  },
  plugins: [dts({ insertTypesEntry: true })]
})
