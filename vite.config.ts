import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [sveltekit(), purgeCss(), 
    Icons({
    compiler: 'svelte',
    autoInstall: true,
  })],
  worker: {
		plugins: () => [wasm(), topLevelAwait()]
	},
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', '.svelte-kit', 'static'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        '.svelte-kit/**',
        'static/**',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/types/**',
        '**/*.svelte',
        '**/index.ts',
        '**/lib/stores/**', // TODO: Fix coverage for stores
        '**/lib/score/verovioWorker.ts', // Worker files are not included in coverage
        '**/lib/types.ts', // Types are not included in coverage
      ],
      include: ['src/**/*.ts', 'src/**/*.js'],
    },
  },
});