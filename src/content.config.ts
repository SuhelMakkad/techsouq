import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),

      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.string(),

      heroImage: image(),
      heroImageAlt: z.string().min(1),
      socialImage: z.string().startsWith('/images/blog/'),
    }),
});

export const collections = { blog };
