# Techsouq blog generation guide

Use this guide to research, write, implement, and review future Techsouq articles. Read [AGENTS.md](../AGENTS.md) and the [README](../README.md) first for current repository conventions and development commands. This guide describes the implementation as of 19 October 2026; check the source before relying on a path or behavior after a refactor.

## Audience and editorial goal

Write for founders and business owners in the global English-speaking market who are deciding how to build, buy, improve, or replace a business website or software system. Connect topics to Techsouq's website, web application, and custom software services through the problem being solved.

Every article should help a reader make a specific decision or produce something useful: a cost comparison, a scoped brief, a migration map, an acceptance checklist, or another practical artifact. Search visibility is a goal, but do not promise rankings or invent search volumes, client results, market benchmarks, or delivery estimates.

Before drafting, finish this sentence: “After reading this, a reader facing **[specific situation]** can **[observable action]**, using **[example, tool, or method]**.” If the answer is only “understand the importance of something,” narrow the topic.

## 1. Research before writing

1. Review existing articles and choose a distinct reader question. Improve an existing article when the proposed topic would mostly repeat its answer.
2. Search the question and related wording. Inspect relevant results to understand the task people are trying to complete, the assumptions other articles leave unexplained, and what a useful example could add. Record observed intent separately from any measured keyword data; only report volumes when an actual source provides them.
3. Find primary sources for consequential claims: official product documentation, original research, standards, or guidance from the responsible organization. Read the relevant sections rather than relying on search snippets or another blog's summary.
4. Recheck information that changes, including prices, product capabilities, platform limits, and search guidance. Record the date checked and the scope of each source. Government procurement guidance can inform a planning method without becoming a requirement for every private business.
5. Choose an original worked example and a useful visual or interactive artifact. Decide what the article deliberately leaves out before drafting.

Keep a small research record in the working notes. It should distinguish evidence from our interpretation and illustrative assumptions:

| Claim or question | Primary source and relevant section | Date checked | Scope, caveat, or assumption |
| --- | --- | --- | --- |
| What does the source actually support? | Exact page URL, not a search-results page | Actual review date | What it does not establish; what we infer |

Cite sources next to the claims they support with descriptive links. End the article with a short “Sources and further reading” section and an honest sources-checked date. A source list is not a substitute for explaining which recommendation a source supports. Paraphrase carefully; avoid reproducing substantial passages, tables, or graphics from other publishers.

The existing articles' source lists are useful starting points, not a permanent substitute for checking the documentation again:

| Existing article | What to learn from it |
| --- | --- |
| [Custom software vs off-the-shelf](../src/content/blog/custom-software-vs-off-the-shelf-cost.mdx) | Compare the same workflow, separate cash spending from staff capacity, expose assumptions, and test a different time horizon. |
| [Customer portal MVP scope](../src/content/blog/customer-portal-mvp-scope.mdx) | Follow one complete journey, make permissions explicit, define exclusions, and turn requirements into observable acceptance checks. |
| [Website redesign SEO checklist](../src/content/blog/website-redesign-seo-checklist.mdx) | Work through concrete URL decisions and separate checks a planning tool can perform from live launch verification. |

## 2. Complete a short article brief

Use this template before writing prose. It is a working brief, not extra frontmatter.

```text
Reader and situation:
Primary question / search intent:
Related search wording, with evidence if available:
Decision or artifact the reader will leave with:
Distinct contribution compared with existing Techsouq articles and search results:

Working title:
Stable kebab-case slug:
Category:
Scope and explicit exclusions:

Primary sources and claims they support:
Original worked example and clearly labelled assumptions:
Interactive tool, if useful; inputs, outputs, rules, and limits:
Static explanation and example that work without JavaScript:
Cover and explanatory graphic:

Relevant internal links:
Useful next step and restrained service link:
Validation needed for the content, tool, and graphics:
```

Prefer a specific planning or buying question over a broad trend overview. Interactivity must help the reader apply the method; do not force a quiz, calculator, or score onto a topic that a good table or diagram already explains.

## 3. Write a substantive article

Use the following sequence as a starting point, adapting headings to the reader's task:

1. **Answer the question early.** Describe the situation, the decision, and the main qualification in concrete language. Avoid a generic introduction about how fast technology is changing.
2. **Define the comparison or workflow.** Explain what is in scope, who is involved, and what success means before listing features or costs.
3. **Work through a realistic example.** Show the inputs, reasoning, and result. Label a fictional business, scenario, or USD amount as illustrative; never imply it is a Techsouq client engagement or an industry average.
4. **Let readers apply it.** Introduce the tool or template, explain each input, and show how to interpret the output. Keep formulas, units, assumptions, and an example result visible in static HTML.
5. **Discuss the cases that change the answer.** Cover failure scenarios, uncertainty, exclusions, and tradeoffs relevant to this decision. Explain when a simpler or existing solution is sufficient.
6. **Give a practical next step.** Provide an acceptance check, a question to ask a supplier, or an artifact to take into planning. Link to a relevant Techsouq article and, where helpful, a service section.
7. **Document sources and assumptions.** Make it easy for a reader to verify facts and distinguish them from our original example.

Use plain English, concrete verbs, readable tables, and meaningful headings. Explain technical terms when the reader needs them. There is no required SEO word count: write enough to finish the reader's task without repeating the same advice. Avoid keyword stuffing, unsupported superlatives, invented quotations, and filler FAQs.

Keep financial language precise. Staff hours released are not automatically cash saved; a cost comparison is not a revenue forecast. Use consistent currency and time units, state exclusions, and check every number across the prose, table, graphic, and tool. For security or implementation guidance, describe observable behavior rather than claiming that a checklist guarantees security.

## 4. Add the article to the current Astro structure

| Purpose | Location |
| --- | --- |
| Article content | `src/content/blog/<slug>.mdx` |
| Frontmatter schema | `src/content.config.ts` |
| Original cover SVG | `src/assets/blog/<slug>.svg` |
| Social preview PNG | `public/images/blog/<slug>.png` |
| Reusable interactive or explanatory components | `src/modules/blog/components/` |
| Pure calculation, generation, or validation helpers | `src/modules/blog/utils/` |
| Helper tests | `src/modules/blog/utils/__test__/<name>.test.ts` |
| Collection ordering and reading time | `src/modules/blog/lib/posts.ts` |
| Article layout and contents list | `src/modules/blog/pages/detail/components/blog-post.astro` |
| Shared head metadata | `src/common/components/layout/base-head.astro` |

Use kebab-case filenames and PascalCase component identifiers. `@/` maps to `src/common/`; `@/modules/` maps to `src/modules/`. For example, import a blog tool from `@/modules/blog/components/cost-calculator.astro`, not `@/components/cost-calculator.astro`. Keep `src/pages/` as thin route delegates; a normal new article does not need a new route file.

Use this frontmatter shape, replacing all example values and using the actual publication date:

```yaml
---
title: 'A specific question with a useful answer'
description: 'Explain the reader problem and the practical help this article provides.'
pubDate: 2026-10-19
category: 'Product planning'
heroImage: '../../assets/blog/article-slug.svg'
heroImageAlt: 'Describe the actual graphic and the relationship it illustrates.'
socialImage: '/images/blog/article-slug.png'
---
```

The current categories are `Business systems`, `Product planning`, and `Websites & search`. Reuse an appropriate category; add another only when it represents a meaningful editorial grouping. The schema accepts a string rather than enforcing a fixed category list.

The layout supplies the title as the page's `h1`, the Techsouq byline, dates, cover, reading time, and related articles. Start the MDX body with prose and use `##` for main sections and `###` for subsections. The linked contents list is generated from level-two headings. Do not add another `h1`, a duplicate contents list, or a second page layout.

When a component is useful, place its import after the frontmatter and render it next to the relevant explanation. This existing component example is appropriate only for a cost-comparison article:

```mdx
import CostCalculator from '@/modules/blog/components/cost-calculator.astro';

## Compare your options

Explain the inputs, assumptions, and worked example here.

<CostCalculator />

Explain how to use the result in a decision here.
```

Keep each prose paragraph on one source line. Do not manually wrap Markdown to a fixed width. Preserve structural newlines for headings, lists, tables, and code blocks.

**Publishing behavior:** every matching Markdown or MDX file in the collection is built as an article. There is no draft flag or future-date scheduling filter. Keep unfinished drafts outside `src/content/blog/`; adding `draft: true` or a future `pubDate` does not hide them. Posts sort by publication date descending, with the ID breaking ties. The homepage shows the first three, and the article layout currently shows the first two other posts as related reading; it does not choose them by topic. Add contextual links in the article body yourself.

## 5. Build useful interactive tools

Use Astro components, native controls, and small TypeScript scripts. Put reusable business rules in pure helpers under `utils/` so they can be tested independently. Follow the existing tools' structure; do not add a UI framework, backend, account requirement, or data collection merely to support an article.

Render reader-provided values as text, for example with `textContent` or a textarea's `value`, rather than interpolating them into HTML. Keep controls and result updates scoped to their component so multiple tools do not interfere with one another.

For each tool, define:

- **Inputs:** clear labels, units, example values, valid ranges, and whether empty and zero have different meanings. Use `fieldset` and `legend` for related controls.
- **Rules:** explicit formulas or deterministic generation logic. Reject invalid or non-finite numeric values and explain what needs fixing. Do not invent readiness scores, accuracy percentages, delivery estimates, or benchmark thresholds.
- **Outputs:** readable results, meaningful labels, an explanation of their limits, and copy or download controls when readers need to reuse the artifact. Preserve manual edits to a generated brief until the reader explicitly regenerates it.
- **Accessibility:** native keyboard operation, visible focus, associated error messages, and appropriate live announcements for updated results. Do not rely on color alone to communicate a difference or error.
- **Fallbacks:** a complete static explanation, worked example, and useful table or diagram without JavaScript. Hide or clearly explain controls that cannot operate without it. Offer selectable text when clipboard access fails, and announce success only after an operation succeeds.
- **Privacy:** keep reader inputs in page memory. Do not add network submission, local storage, analytics capture of inputs, or sensitive-data requirements. Describe the actual behavior accurately.

Choose a tool that fits the task: a calculator for comparing quantities, a guided brief for making scope explicit, or a planner for checking a set of decisions. Explain the boundary of validation. For example, an entered redirect map can reveal duplicate sources or loops, but cannot establish that a deployed server returns the intended HTTP status.

Write meaningful tests for new or changed logic. Cover normal cases, boundary values, invalid inputs, and regressions that would mislead a reader. Test formula arithmetic and units; test blank and zero values separately; test generation with missing optional answers. For CSV exports, cover commas, quotes, line breaks, and spreadsheet formula interpretation where applicable. Test copy and download behavior in a real browser as well as testing the pure helper. Tests use relative `.ts` imports and Node's built-in runner; see the existing `__test__/` files.

## 6. Create graphics that explain something

Use the site's blue, ink, white, and pale background palette. The current tokens in `src/common/styles/global.css` include brand `#2061ef`, ink `#18202f`, and canvas `#f7f8fb`, with Manrope typography. Reuse the supplied brand assets when a logo is needed rather than drawing a replacement.

Prefer original SVGs for diagrams, comparisons, and labelled workflows because their text and geometry can be reviewed precisely. Show responsibilities, decision branches, units, or relationships that clarify the article. Include the failure or request-changes path when it matters. Charts must reflect the example data and use honest scales. Use generated or licensed raster imagery only when it adds something a diagram cannot, and verify its rights and visual accuracy. Never present a generated image as evidence of a real client, interface, or result.

Create a 1200 × 630 cover with an appropriate `viewBox`, readable labels, and room around the edges. Write alt text that describes the useful content, not a string of keywords. Ensure the same description makes sense for its social preview. Inline SVG diagrams need accessible names or equivalent adjacent text; keep their meaning available without JavaScript. Do not make tiny embedded text the reader's only source of a conclusion.

Store the cover source in `src/assets/blog/` and its social PNG in `public/images/blog/`. Generate the PNG using the installed Sharp dependency, replacing `article-slug` with the real slug:

```sh
node --input-type=module <<'JS'
import sharp from 'sharp';

await sharp('src/assets/blog/article-slug.svg')
  .resize(1200, 630)
  .png()
  .toFile('public/images/blog/article-slug.png');
JS
```

Inspect the SVG in the article and the generated PNG independently. Check wrapping, clipping, contrast, data labels, and mobile legibility. Regenerate the PNG whenever its source changes. Commit intentional article assets; keep temporary screenshots and build artifacts out of source commits.

## 7. Use the existing SEO foundations

Write a distinct, descriptive title and description that match the visible article. Choose a durable slug and use trailing-slash internal article links, such as `/blog/customer-portal-mvp-scope/`. Link naturally to relevant articles and existing service anchors such as `/#services`. The layout already includes a service link; avoid repeating a sales pitch after every section.

The shared head and article layout generate canonical URLs, social tags, article dates, `BlogPosting` data, and breadcrumbs from the visible content and frontmatter. Do not duplicate these in MDX or add unsupported ratings, FAQs, credentials, or author claims. The author is Techsouq. Use `updatedDate` only for a substantive revision, not to make an unchanged article look fresh.

The sitemap reads publication and revision dates from each rendered article's `BlogPosting` data. Its `<lastmod>` is the latest of `pubDate`, `updatedDate` when present, and the recorded shared metadata correction in `src/modules/blog/utils/article-lastmod.ts`. New posts and substantive revisions get their own dates automatically. Do not advance the shared date for a new post, routine rebuild, typo, or styling change; change it only for a significant change affecting existing article pages and document why. The homepage and blog listing intentionally omit `<lastmod>`. The sitemap index also records the latest modification date among its article entries.

The production origin is controlled by `SITE_URL` in `astro.config.mjs`. An unset variable currently defaults to `https://www.techsouqhq.com`, matching the hosting redirect destination. Keep production overrides aligned with that destination. An explicit empty value disables absolute canonical and social-image URLs, sitemap generation, and the robots sitemap reference. An empty value does not make a public preview private or add `noindex`. Configuration reads the process environment, so use the shell or hosting build settings rather than assuming a `.env` entry is loaded here.

```sh
SITE_URL=https://www.techsouqhq.com pnpm build
```

Use an absolute HTTP(S) origin without credentials, a path, a query, or a fragment. Local builds must not invent a production domain. For intentional local-only metadata verification:

```sh
SITE_URL='' pnpm build
```

With a configured origin, verify the new article appears in the generated sitemap referenced by `/sitemap-index.xml`, and that `/robots.txt` references that sitemap index. Do not hardcode an expected article count. See [Production URLs and search indexing](../README.md#production-urls-and-search-indexing) for deployment and Search Console checks.

## 8. Review and validate before delivery

For an article implementation, run the repository checks from the root:

```sh
pnpm build
pnpm lint
pnpm format:check
pnpm test
```

Use the Node version range in `package.json`. Format the files you changed with Prettier as needed rather than rewriting unrelated files. Start local previews with `pnpm exec astro dev --background`; manage them with the `status`, `logs`, and `stop` subcommands documented in the README.

### Content and evidence

- [ ] The article answers one clear question and adds a useful example, artifact, or method beyond a generic overview.
- [ ] Material factual claims have relevant primary-source links; volatile claims and the sources-checked date reflect actual research.
- [ ] Fictional scenarios, sample amounts, assumptions, and exclusions are explicit. No fabricated client results, quotes, search volumes, or ranking promises appear.
- [ ] Prose, tables, formulas, diagrams, presets, and generated output agree. An independent calculation confirms worked numeric examples.
- [ ] The next step is useful, internal links are relevant, and the service connection is restrained.

### Rendering and behavior

- [ ] Inspect the article and blog index on desktop and mobile. Check the homepage preview if the article appears among the latest three.
- [ ] Check headings, contents links, readable tables, diagrams, cover, and social PNG. Confirm there is no unintended page-wide horizontal overflow.
- [ ] Use the tool with a keyboard. Check focus, labels, errors, announcements, reset or preset behavior, and editing without unexpected data loss.
- [ ] Exercise normal, empty, zero, invalid, and boundary inputs as applicable. Verify copy and download contents, filenames, escaping, and failure behavior.
- [ ] Reload with JavaScript disabled and confirm the article, worked example, formulas, and explanatory graphics remain useful.

### Generated output and publication

- [ ] Inspect `dist/blog/<slug>/index.html`: substantive text is rendered statically, the title and description are correct, and structured data agrees with the visible article.
- [ ] Verify internal URLs and fragments, image paths, descriptive alt text, canonical origin, social-image dimensions, and publication dates. Confirm the article is included in the configured-domain sitemap with the expected `<lastmod>`; unchanged articles must retain their dates on a rebuild.
- [ ] If changing shared metadata or site configuration, also verify an empty `SITE_URL` and a different valid test origin. Restore a production-configured build before preparing production output.
- [ ] Review the diff for unintended changes, generated output, temporary screenshots, credentials, and unfinished drafts. Report checks actually performed and any remaining limitations.
- [ ] Follow the current task's instructions for committing, pushing, or deploying. Completing an article does not itself authorize publishing it externally.

After an authorized deployment, verify the live article and social image, production canonical, sitemap, and crawl settings. Use the production Search Console property to inspect the URL and monitor indexing, impressions, clicks, and relevant business outcomes. Diagnose actual reader or search problems before expanding the article; avoid treating a publication date change as an improvement.

### Notify Google after production publication

For each authorized article publication or substantive revision, submit the production sitemap through the [Search Console Sitemaps API](https://developers.google.com/webmaster-tools/v1/sitemaps/submit) after CI and production deployment succeed. This is the supported discovery request for ordinary blog articles; describe the result as a sitemap submission, not confirmed reindexing. [Google's guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#submit) explains that submission is a hint and does not guarantee crawling or indexing.

**Authentication setup:** enable the Search Console API in a Google Cloud project and configure an authorized identity with access to the site's verified Search Console property. Requests require an OAuth 2.0 access token with the `https://www.googleapis.com/auth/webmasters` scope; a normal API key alone cannot authorize submission. Configure unattended token renewal once using the supported credential flow, such as OAuth refresh credentials. Keep credentials in the execution environment's secret storage, never in the repository, generated site, task prompt, or logs. See [Google's authorization requirements](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing).

1. Confirm the required CI checks and the pushed commit's production Vercel deployment succeeded. Tie the deployment to the exact commit SHA. A successful build or push alone is insufficient; do not submit for a preview, failed or unverified deployment, documentation-only change, or unchanged rebuild.
2. Verify the production article returns HTTP 200, has the intended canonical URL, and permits indexing. Check its social image and blog listing entry, then confirm the live sitemap contains the article with the expected `<lastmod>`. Verify `https://www.techsouqhq.com/sitemap-index.xml` and its referenced sitemap are accessible.
3. Using existing authorized credentials, submit `https://www.techsouqhq.com/sitemap-index.xml` with the API's `PUT /webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}` method, URL-encoding both path parameters and sending no request body. Use the existing verified property: `sc-domain:techsouqhq.com` if that Domain property is configured, or `https://www.techsouqhq.com/` for the matching URL-prefix property. Do not assume a property exists or use an unrelated property.
4. Record the publication SHA, sitemap URL, property, submission time, and actual API result in the run report. Submit once per verified publication; consult the run's existing record before repeating a successful submission. Use bounded retries with backoff for transient failures. A successful API response has an empty body and confirms submission only. The [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect) can read index status; it cannot request indexing.
5. If credentials, property access, or submission are unavailable, report the exact blocker and mark Google notification as skipped or failed separately from the verified publication. Preserve the published article and report any required credential setup; do not claim reindexing or roll back a successful publication because notification failed.

Do not use the [retired sitemap ping endpoint](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping) or Google's [Indexing API](https://developers.google.com/search/apis/indexing-api/v3/quickstart), which is restricted to eligible job-posting and livestream pages. The existing public sitemap and `robots.txt` discovery remain available without Google credentials.

## 9. Maintain existing articles

Recheck sources when a product, policy, or technical behavior changes. For a substantive revision, update `updatedDate`, explain changed assumptions where readers need that context, and synchronize examples, tool rules, tests, and graphics. Keep the original `pubDate`.

Preserve stable URLs. Renaming or removing a published article requires an explicit URL and redirect decision; changing its filename does not create a redirect automatically. Review contextual links when a new article is added, since the automatic related-post selection is chronological rather than editorial.

## Reusable request for future generation

Copy this request and replace the bracketed fields:

```text
Create [number] researched Techsouq blog article(s) about [topic or reader problem].

Read AGENTS.md, README.md, and docs/blog-generation-guide.md first. Inspect the current implementation and existing articles before choosing an angle. The audience is founders and business owners in the global English-speaking market.

Research the reader's question before drafting. Use current primary sources, cite supported claims, and keep a record of assumptions. Do not invent search volumes, client results, prices, benchmarks, or ranking guarantees.

Give each article a specific reader outcome, an original worked example, and useful explanatory graphics. Add an interactive tool when it helps readers apply the method. Keep the explanation and example useful without JavaScript, and make tool inputs, formulas, outputs, and limitations explicit.

Implement the article in the existing Astro/MDX collection and visual style. Add the required metadata, accessible cover, and matching PNG social preview. Follow the current module structure and import aliases. Use the Techsouq byline and actual publication date.

Validate factual claims, numeric examples, accessibility, responsive rendering, tool behavior, static HTML, internal links, metadata, structured data, and sitemap inclusion. Run the applicable repository checks and report the article URLs, what was added, verification performed, and any limitations.

After an authorized publication, wait for successful CI and the pushed commit's production Vercel deployment, verify the live article and sitemap, then submit the production sitemap through the authenticated Search Console Sitemaps API as described in the guide. Report submission separately from deployment and indexing; if credentials or access are missing, report the blocker without claiming a submission.

Topic constraints or exclusions: [details, or none].
Commit, push, and deployment instructions: [explicit scope].
```
