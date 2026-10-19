# Techsouq

Techsouq's public-facing landing page, built with Astro and Tailwind CSS. The current version is a local preview for a digital product studio.

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

Run `pnpm format` to format the project, or `pnpm format:check` to check formatting without changing files. Prettier supports Astro components and sorts Tailwind classes using the site's stylesheet. Markdown prose stays on one source line per paragraph.

Generated output, dependencies, and coverage are excluded from both tools. Prettier also leaves the package-manager lockfile and supplied SVG brand assets unchanged.

## Project inquiry preview

The project inquiry is a local preview. Entered details are not delivered or stored. Connect a real contact destination before publishing the site.

## Future content

The Markdown and MDX blog collection schema in `src/content.config.ts` and reusable `src/layouts/blog-post.astro` article layout are retained for future writing. Demo articles and their public blog, RSS, and about routes have been removed; the landing page is the only content route currently provided.

No public domain or deployment is configured. Add the confirmed production URL and publishing setup when the site is ready to launch.
