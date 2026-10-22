// @ts-check
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import blogSitemap from './src/modules/blog/lib/blog-sitemap.ts';

// Match the production redirect destination; an empty override supports local-only previews.
const site = process.env.SITE_URL?.trim() ?? 'https://www.techsouqhq.com';

if (site) {
  const url = new URL(site);

  if (!['http:', 'https:'].includes(url.protocol) || site.replace(/\/$/, '') !== url.origin) {
    throw new Error(
      'SITE_URL must be an absolute http(s) origin without a path, query, or fragment.',
    );
  }
}

export default defineConfig({
  site: site || undefined,
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), ...(site ? [blogSitemap()] : [])],
});
