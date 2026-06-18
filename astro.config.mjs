// @ts-check
import { defineConfig } from 'astro/config';
import minify from 'astro-minify-html-swc'
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()]
  integrations: [react(), minify()]
});