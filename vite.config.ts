import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [sveltekit(), purgeCss(), Icons({
    compiler: 'svelte',
    autoInstall: true,
  })],
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
      ],
      include: ['src/**/*.ts', 'src/**/*.js'],
    },
  },
});