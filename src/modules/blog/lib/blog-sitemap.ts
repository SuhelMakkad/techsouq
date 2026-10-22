import { readFile } from 'node:fs/promises';

import sitemap from '@astrojs/sitemap';
import type { AstroIntegration } from 'astro';

// This integration also runs in astro.config.mjs, before the site's aliases are loaded.
import { articleLastmod } from '../utils/article-lastmod.ts';

export default function blogSitemap(): AstroIntegration {
  const articleDates = new Map<string, string>();
  const integration = sitemap({
    serialize(item) {
      const lastmod = articleDates.get(new URL(item.url).pathname);

      return lastmod ? { ...item, lastmod } : item;
    },
  });

  const writeSitemap = integration.hooks['astro:build:done'];

  return {
    ...integration,
    hooks: {
      ...integration.hooks,
      'astro:build:done': async (context) => {
        articleDates.clear();

        // Use the rendered, schema-validated article dates instead of parsing MDX again.
        // Validate before the sitemap hook, which otherwise logs and swallows serialize errors.
        for (const { pathname } of context.pages) {
          const path = pathname.replace(/^\/+|\/+$/g, '');

          if (!path.startsWith('blog/')) continue;

          const html = await readFile(new URL(`${path}/index.html`, context.dir), 'utf8');

          try {
            articleDates.set(`/${path}/`, articleLastmod(html));
          } catch (error) {
            throw new Error(`Cannot generate sitemap metadata for /${path}/`, { cause: error });
          }
        }

        await writeSitemap?.(context);
      },
    },
  };
}
