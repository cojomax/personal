// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from "@tailwindcss/vite";

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
    adapter: cloudflare({
        // Optimize images at build time instead of via a Cloudflare Images
        // binding at request time — avoids needing an "images" binding in
        // wrangler.jsonc (and the Cloudflare Images product) just to serve
        // static, build-known photos.
        imageService: 'compile'
    }),
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [icon()]
});
