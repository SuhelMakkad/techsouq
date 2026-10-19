# Techsouq

Techsouq's public-facing website and practical product-development blog, built with Astro, MDX, and Tailwind CSS. The blog includes a software cost calculator, customer portal brief builder, and website redirect-map planner.

## Local development

Use pnpm and a Node.js version matching the `engines.node` range in `package.json`. The project is verified with Node.js 24.18.0. Run commands from the project root.

```sh
pnpm install
pnpm exec astro dev --background
```

The development server normally runs at `http://localhost:4321`. Manage it with:

```sh
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
```

Build the site with `pnpm build`. The static output is written to `dist/`.

## Code quality

Run `pnpm lint` to check JavaScript, TypeScript, and Astro files. Use `pnpm lint:fix` to apply available automatic fixes.

Run `pnpm test` for the interactive tools' calculation, brief-generation, and redirect-validation tests. These use Node's built-in test runner and TypeScript stripping; no test framework is required.

Run `pnpm format` to format the project, or `pnpm format:check` to check formatting without changing files. Prettier supports Astro components and sorts Tailwind classes using the site's stylesheet. Markdown prose stays on one source line per paragraph.

Generated output, dependencies, and coverage are excluded from both tools. Prettier also leaves the package-manager lockfile and supplied SVG brand assets unchanged.

## Project inquiry preview

The project inquiry is a local preview. Entered details are not delivered or stored. Connect a real contact destination before publishing the site.

## Writing blog articles

Add a kebab-case `.mdx` file to `src/content/blog/`. Its filename becomes its stable `/blog/<filename>/` URL. The collection schema is in `src/content.config.ts`; public routes and navigation are generated from the collection. Use `@/` imports for components, and keep each prose paragraph on one source line.

Required frontmatter:

```yaml
title: A specific, useful article title
description: A clear explanation of the question this article helps answer.
pubDate: 2026-10-19
category: Product planning
heroImage: ../../assets/blog/article-slug.svg
heroImageAlt: A descriptive explanation of the graphic.
socialImage: /images/blog/article-slug.png
```

Use the actual publication date. Add `updatedDate` only after a substantive revision. The visible author and structured-data author are Techsouq. Reading time and the linked contents list are derived from the article; related posts appear automatically.

Explain assumptions, label fictional examples, and cite original sources beside factual claims. Add useful graphics and preserve complete explanations without JavaScript. Interactive components live in `src/components/blog/`, with tested calculation and validation helpers in `src/lib/blog/`. Tools run entirely in the browser and do not send or retain reader input after a refresh.

Original cover SVGs live in `src/assets/blog/`, with matching 1200 × 630 PNG social images in `public/images/blog/`. If you change a cover, regenerate its PNG using the installed Sharp package:

```sh
node --input-type=module <<'JS'
import sharp from 'sharp';

await sharp('src/assets/blog/article-slug.svg')
  .resize(1200, 630)
  .png()
  .toFile('public/images/blog/article-slug.png');
JS
```

## Production URLs and search indexing

The configured production origin is `https://techsouqhq.com`. Set `SITE_URL` in the build environment to override it. It must be an absolute HTTP(S) origin without a path, credentials, query, or fragment. Configuration reads the process environment; export the variable in your shell or hosting build settings.

```sh
SITE_URL=https://techsouqhq.com pnpm build
```

An explicit empty value supports local-only verification: `SITE_URL='' pnpm build`. This omits canonical URLs, absolute social-image URLs, sitemap generation, and the robots sitemap reference instead of substituting a fictitious domain. The site still renders normally. A missing variable uses the configured production origin.

Production builds include `/sitemap-index.xml`, `/sitemap-0.xml`, and `/robots.txt`. Articles include canonical URLs, social previews, `BlogPosting` structured data, and breadcrumbs. There is no RSS feed or search analytics integration in this version.

After deployment, verify the homepage, blog index, and all article URLs return successful responses; confirm the canonical and social-image URLs use the intended origin. Check that robots rules permit crawling and the sitemap contains all articles. Use Google's Rich Results Test to inspect an article, verify the production property in Search Console, and submit `/sitemap-index.xml`. Monitor indexing, query impressions, and clicks to assess which articles need improvement; a sitemap submission does not guarantee indexing or rankings.
