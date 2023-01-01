import { defineConfig } from 'vite';
import fs from 'fs/promises';
import react from '@vitejs/plugin-react';
import svgLoader from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    outDir: './dist',
  },
  server: {
    port: 3006,
  },
  plugins: [
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx,js}',
    }),
    svgLoader(),
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    // loader: "tsx",
    // include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await fs.readFile(args.path, 'utf8'),
            }));
          },
        },
      ],
    },
  },
});
