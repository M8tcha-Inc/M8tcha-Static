// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://m8tcha.com',
  // Custom domain serves from the site root (not /M8tcha-Static/)
  base: '/',
});
