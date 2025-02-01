// vite.config.ts
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';

export default defineConfig({
    plugins: [dts({
        // Output the declarations in the same directory as your bundle.
        outDir: 'dist',
        // Entry point for types
        entryRoot: path.resolve(__dirname, 'src')
    })],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'Dreamplet',
            fileName: (format) => `dreamplet.${format}.js`
        },
        rollupOptions: {
            external: [], // list any external dependencies if needed
            output: {
                globals: {}
            }
        }
    }
});
