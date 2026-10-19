## File naming

Use kebab-case filenames for components and layouts, such as `hero-graphic.astro` and `blog-post.astro`. Keep imported component identifiers and template tags in PascalCase.

## Imports

Use `@/` for shared code in `src/common/`, such as `@/components/layout/header.astro`, `@/constants/site.ts`, and `@/styles/global.css`. Use `@/modules/` for feature code in `src/modules/`, such as `@/modules/blog/pages/list/index.astro`. Both aliases are configured in `tsconfig.json` and apply to Astro, TypeScript, client scripts, and MDX. Import page entrypoints directly without barrel files.

## Project structure

Follow Hostleaf's shared-code and feature-module conventions while preserving Astro's routing and content conventions:

- Put shared UI in `src/common/components/`, including arrow-icon, brand, formatted-date, and section-label. Put base-head, header, and footer in `src/common/components/layout/`.
- Keep site constants in `src/common/constants/site.ts` and global styles in `src/common/styles/global.css`.
- Implement the homepage in `src/modules/marketing/pages/landing/index.astro`; colocate approach, hero-graphic, inquiry-form, services, and service-illustration in its `components/` directory.
- Keep reusable blog components in `src/modules/blog/components/`, collection and reading-time helpers in `src/modules/blog/lib/posts.ts`, and calculation or validation helpers in `src/modules/blog/utils/`.
- Implement blog pages in `src/modules/blog/pages/list/index.astro` and `src/modules/blog/pages/detail/index.astro`. Keep the article layout in the detail page's `components/blog-post.astro`.
- Keep `src/pages/` as thin route delegates. The dynamic article route retains `getStaticPaths()` and URL parameter mapping; module pages own rendering and related-post preparation.
- Preserve `src/content.config.ts`, `src/content/blog/`, `src/assets/blog/`, and `public/` in their existing locations. Add directories only when needed by an implementation.

## Tests

Colocate calculation and validation tests under `src/modules/blog/utils/__test__/` with `.test.ts` filenames. Use relative `.ts` imports in tests for compatibility with Node's built-in test runner and TypeScript stripping. Run them with `pnpm test`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
