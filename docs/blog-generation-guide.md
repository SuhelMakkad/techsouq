# Techsouq blog generation guide

Use this guide to research, write, implement, and review future Techsouq articles. Read [AGENTS.md](../AGENTS.md) and the [README](../README.md) first for current repository conventions and development commands. This guide describes the implementation as of 19 October 2026; check the source before relying on a path or behavior after a refactor.

Apply the [quality bar](#the-quality-bar), Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) to every new article and substantive revision, including scheduled publications. For Techsouq, AEO means giving readers a direct answer they can find and understand quickly. GEO means making that answer, its supporting evidence, and Techsouq's original contribution accessible to search systems that retrieve sources for generated responses, in passages they can reuse accurately. Use the [editorial gate](#editorial-gate) and the [prepublication checklist](#8-review-and-validate-before-delivery) on every run.

## The quality bar

Aim for the most useful page available for one specific reader question. Pages that restate familiar advice are easy to replace with a search or an AI summary. A Techsouq article earns a reader's time, and a citation, by resolving a decision that existing answers leave open. Google says distinctive, useful content is likely to influence visibility in Google Search's generative AI features over the long run more than the other suggestions in its guide, and cautions against content that a generative AI model could easily produce. [Google's AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

Pass the topic gate at the end of [research](#1-research-before-writing), complete the [brief](#2-complete-a-short-article-brief), and confirm an independent reviewer before drafting. Pass the [editorial gate](#editorial-gate) and [AEO and GEO checks](#aeo-and-geo-checks) before implementation polish. A failed gate prevents that candidate from advancing; use the recovery and reporting rules below. Complete all applicable prepublication checks before any authorized release. After release, verify the exact production deployment and follow [Notify Google after production publication](#notify-google-after-production-publication).

Every article must include:

- **A direct answer** to one specific question, stated in the opening.
- **A defensible recommendation:** a default action, the reason to take it, and the condition that changes it. “It depends” is not a recommendation; the factors it depends on, and which way each one points, can be.
- **An original contribution** that the closest Techsouq article and the strongest external resource do not provide, and that a current AI answer does not provide when one is accessible: evidence, analysis, a decision rule, or a usable artifact. See [produce original evidence honestly](#produce-original-evidence-honestly).
- **Insight beyond the obvious:** points a capable reader would not have guessed and that change what they do. Each needs a source, an observed result, or reasoning shown in the article.
- **A next action someone can carry out:** who does what, using which input, what result they should expect, and what to do if it fails.
- **Honest provenance:** every material claim is cited, observed in a test we ran, derived from stated inputs, or labelled as an illustrative assumption.

Apply three tests to the brief and again to the draft:

1. **Commodity test.** Could a capable language model write substantially the same article from general knowledge, without this run's research? If so, the article has no contribution yet.
2. **Consensus test.** Name what this article lets the reader decide or do that the strongest competing answer does not. A missing subheading is a weak gap. A buyer who still cannot tell whether the cheaper proposal meets a requirement has a real one.
3. **Deletion test.** If the page disappeared, what would a founder lose that a search would not replace? Would they bookmark it, share it, or take it into a supplier meeting? [Google's people-first content questions](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

The commodity, consensus, and deletion tests are Techsouq's own editorial tests, informed by Google's guidance.

**Publish only candidates that pass the required gates.** When a candidate fails the topic or editorial gate, narrow the question, obtain the missing evidence, or try another candidate within the task's scope. Make a substantive revision to an existing article only when the task authorizes it. If the run ends with no authorized candidate passing the editorial requirements, report `skipped: editorial gate` and list the candidates and why each failed. If a required capability is unavailable or an applicable prepublication validation check remains unresolved, report `blocked` and name the blocker. In either case, give the location of any saved draft or say that none was saved. Google's people-first guidance lists extensive automation across many topics and summarizing others without adding much value as warning signs. Its spam policies treat generating many pages without adding value for users as possible scaled content abuse. [People-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content)

## Audience and editorial goal

Write for founders and business owners in the global English-speaking market who are deciding how to build, buy, improve, or replace a business website or software system. Connect topics to Techsouq's website, web application, and custom software services through the problem being solved.

Every article should help a reader make a specific decision or produce something useful: a cost comparison, a scoped brief, a migration map, an acceptance checklist, or another practical artifact. Search visibility is a goal, but do not promise rankings or invent search volumes, client results, market benchmarks, or delivery estimates.

Before drafting, finish this sentence: “After reading this, a reader facing **[specific situation]** can **[observable action]**, using **[example, tool, or method]**, which the best existing answers do not provide because **[gap]**.” If the answer is only “understand the importance of something,” narrow the topic.

### Vary the collection

Readers and search systems judge the site as well as the page. As of November 2026, most published articles share one shape: an opening that starts with what to agree before buying or commissioning, a “This guide…” scope paragraph, a fictional worked example, and a supplier worksheet. Repeating that shape on every run makes the collection read as mass-produced, even when each article is careful.

Before choosing a topic, compare the five most recent articles by reader decision, buying stage, title construction, opening, and main artifact. Prefer a different form when it makes the reader's next decision easier. Reuse a recent form only when it is clearly the best fit, and record why. Renaming a worksheet or rewording an opening does not make an article different.

| Form | Use it when the reader needs to | Contribution it usually carries |
| --- | --- | --- |
| Decision guide | Choose between options | A decision rule and the threshold at which the answer changes |
| Cost or economics model | Judge whether something is worth paying for | A transparent model, a break-even point, and a sensitivity check |
| Failure walkthrough | Avoid an expensive mistake | A case where a plausible success signal hides a failure |
| Dated comparison | Understand how real products or standards differ | A primary-source comparison against one buyer scenario |
| Reproduced test | Know how something actually behaves | A test we ran, with method, environment, version, date, and results |
| Correction | Stop following advice that misleads in their situation | Evidence showing where common advice fails and what to do instead |
| Supplier rehearsal or acceptance brief | Verify a supplier's work | Observable checks with expected results and a completed specimen |
| Decision-shaping explainer | Use a term correctly with a supplier | A definition tied to what it changes in scope, cost, or risk |

Balance topics across the buying journey: deciding whether to build, budgeting, choosing and briefing a supplier, delivery, acceptance and launch, and operating afterward. As of November 2026, coverage concentrates on requirements and acceptance. When candidates are otherwise equal, prefer an undercovered decision, especially whether to build at all.

## 1. Research before writing

1. Review existing articles and choose a distinct reader question. When a proposed topic would mostly repeat an existing article's answer, choose another question, or improve that article if the task authorizes revisions.
2. Search the main question in natural language and explore follow-ups a reader would ask before acting, such as what changes the recommendation, what it costs, or how to verify success. Inspect relevant results and, where available, featured snippets, related questions, or source links in AI answers. Record useful gaps and map each selected follow-up to a section. Treat observed results as clues to intent. Report search volumes only when a source measures them. Open the underlying source before citing any claim surfaced by an AI answer. [Google's guide to generative AI search and related queries](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
3. **Audit the best existing answers.** For the closest Techsouq article and the strongest external guide or tool you can find, record the query, date, and the relevant passage or behavior. Compare a current AI answer when one is accessible; otherwise record it as unavailable. Record what each answer already lets the reader do, the consequential decision it leaves unresolved, and where it is wrong, outdated, or silent about a condition that changes the answer. The article's contribution must close that gap. AI output and missing search results are not evidence that an answer is novel.
4. **Learn how buyers describe the problem.** Read public community threads, Q&A sites, vendor community forums, product issue trackers, and reviews for recurring pains, misconceptions, and vocabulary. Treat anecdotes as signals about what to explain, not as evidence of how often a problem occurs. Paraphrase rather than quote individuals, and do not identify private people.
5. Find primary sources for consequential claims: official product documentation, original research, standards, or guidance from the responsible organization. Read the relevant sections rather than relying on search snippets or another blog's summary.
6. Recheck information that changes, including prices, product capabilities, platform limits, and search guidance. Record the date checked and the scope of each source. Government procurement guidance can inform a planning method without becoming a requirement for every private business.
7. Plan the original contribution using the methods below, plus a worked example and any visual or interactive artifact that helps the reader complete the task. Decide what the article deliberately leaves out before drafting.

### Produce original evidence honestly

An agent cannot draw on client work it did not do, but it can create evidence. Choose the method the question needs:

- **Reproduce documented behavior** in a sandbox, free tier, trial, or local setup you can actually run. Record the method, environment, version, date, and results.
- **Compare primary documentation against one buyer scenario.** Read how several real products, standards, or providers handle the same situation and tabulate the differences, with the date checked.
- **Derive a threshold or decision rule** from visible inputs, such as the point at which one option stops being cheaper. Show how sensitive the result is to each input.
- **Build a small synthetic fixture** with expected results, such as sample records, files, or configurations that a reader or supplier can rerun.
- **Analyze public data,** such as an official dataset or published incident reports. Record the query, scope, date, and limitations.
- **Use verified practitioner notes** that the task supplies from Techsouq. Present them as Techsouq's experience only within the words and scope given; never infer or embellish experience.

Support each consequential external factual claim with applicable primary evidence beside it. For original evidence, show the method and result you observed, or a derivation the reader can reproduce from visible inputs. Label assumptions separately; they can illustrate a decision but cannot establish real-world behavior, frequency, or outcomes. Never describe a test you did not run, imply access you did not have, or present a model's output as a measurement. When a test involves a named product, report its documented or observed behavior factually, with the version and date.

A fictional example may demonstrate a rule, but changing the names and numbers in a familiar example is not an original contribution. Prefer a test, comparison, or derivation the reader can reproduce. Where a cheaper, simpler, or no-build option is credible, put it through the same case and state when it wins.

**Proceed when you can name a decision the existing answers leave unresolved and show how this article will resolve it.** Otherwise narrow the question, obtain the missing evidence, or choose another topic, and record why.

Keep a small research record in the working notes. It should distinguish evidence from our interpretation and illustrative assumptions:

| Claim or question | Evidence: source section, test, or derivation | Type | Date checked | Scope, caveat, or assumption |
| --- | --- | --- | --- | --- |
| What does the evidence actually support? | Exact page URL, test method, or calculation; not a search-results page | Cited, observed, derived, or assumed | Actual review date | What it does not establish; what we infer |

Cite sources next to the claims they support with descriptive links. End the article with a short “Sources and further reading” section and an honest sources-checked date. A source list is not a substitute for explaining which recommendation a source supports. Paraphrase carefully; avoid reproducing substantial passages, tables, or graphics from other publishers.

The existing articles show the current standard and what would lift each one to the best available answer. Their source lists are useful starting points, not a permanent substitute for checking the documentation again:

| Existing article | What it already earns | What would make it the best answer |
| --- | --- | --- |
| [Business data migration checklist](../src/content/blog/business-data-migration-checklist.mdx) | A wrong-but-valid relationship passes both a count check and an existence check, and the article shows why the business should hold the switch. | A small reproducible fixture with source records, the approved ID map, destination records, and the expected mismatch report. |
| [Custom software vs off-the-shelf](../src/content/blog/custom-software-vs-off-the-shelf-cost.mdx) | Separates cash spending from staff capacity and exposes every assumption. | Lead with the break-even rule: how many released staff hours make the options tie, how to measure them, and a separate cash-budget check. Put a buy-plus-integration option through the same example. |
| [Customer portal MVP scope](../src/content/blog/customer-portal-mvp-scope.mdx) | Follows one complete approval journey, makes permissions explicit, and defines exclusions. | Test whether an existing approval product already handles the job, including a new version published while a client is approving the old one. |
| [Website redesign SEO checklist](../src/content/blog/website-redesign-seo-checklist.mdx) | Turns redirects into keep, move, merge, and remove decisions and separates map validation from live checks. | Take one valuable old URL from inventory through launch, with the expected redirect, canonical, and enquiry outcome, and the hold decision when a critical check fails. |

## 2. Complete a short article brief

Use this template before writing prose. It is a working brief, not extra frontmatter.

```text
Reader and situation:
Primary question / search intent:
AEO questions and expected answers: record the exact primary question, a natural rephrasing, and a scenario question with an explicit decision-changing fact. For each, record the expected action and qualification separately from the question text:
Related search wording, with evidence if available:
Direct answer and the conditions that qualify it:
Recommendation: default action, reason, and the condition that changes it:
Decision-changing follow-up questions and where the article answers them:
Decision or artifact the reader will leave with:

Best existing answers (closest Techsouq article, strongest external resource, AI answer) and what each leaves unresolved:
Original contribution and how we know it (cited, observed, derived, or assumed):
Insights beyond the obvious, with their evidence:
What a wrong decision costs the reader:
Citation targets: one or two passages another writer could cite, and the scope that must travel with them:

Form, buying stage, and the five-article comparison from Vary the collection, including why any reused form is the best fit:
Working title:
Stable kebab-case slug:
Category:
Scope and explicit exclusions:

Evidence: link to the research record and flag any consequential claim still needing support:
Worked example: the normal case, the case that changes the answer, and labelled assumptions:
Interactive tool, if useful; inputs, outputs, rules, and limits:
Static explanation and example that work without JavaScript:
Cover and explanatory graphic:

Relevant internal links, including existing articles that should link to this one:
Useful next step and restrained service link:
Validation needed for the content, tool, and graphics:
```

Prefer a specific planning or buying question over a broad trend overview. Interactivity must help the reader apply the method; do not force a quiz, calculator, or score onto a topic that a good table or diagram already explains.

## 3. Write a substantive article

Choose the form from [Vary the collection](#vary-the-collection) and adapt headings to the reader's task. Whatever the form, include these elements; their order and headings are not fixed:

1. **Answer the question in the opening prose.** State the recommendation and the condition most likely to change it. If the answer depends on the reader's situation, give the decision rule and show which option fits each case. Keep the direct answer within the first two paragraphs. One sentence of scope is usually enough there; place detailed exclusions where they matter.
2. **Define the comparison or workflow.** Explain what is in scope, who is involved, and what success means before listing features or costs.
3. **Work through a realistic example.** Show the inputs, reasoning, and result. Include the case that changes the answer, or one where a plausible success signal hides a failure. Label a fictional business, scenario, or USD amount as illustrative; never imply it is a Techsouq client engagement or an industry average.
4. **Let readers apply it.** Introduce the tool or template, explain each input, and show how to interpret the output. Keep formulas, units, assumptions, and an example result visible in static HTML. When the article promises a checklist, brief, or planner, show a completed specimen the reader can copy or adapt.
5. **Discuss the cases that change the answer.** Cover failure scenarios, uncertainty, exclusions, and tradeoffs relevant to this decision. Explain when a simpler or existing solution is sufficient.
6. **Give a practical next step.** Provide an acceptance check, a question to ask a supplier, or an artifact to take into planning. Link to a relevant Techsouq article and, where helpful, a service section.
7. **Document sources and assumptions.** Make it easy for a reader to verify facts and distinguish them from our original example.

Use plain English, concrete verbs, readable tables, and meaningful headings. Explain technical terms when the reader needs them. There is no required SEO word count: write enough to finish the reader's task without repeating the same advice. Avoid keyword stuffing, unsupported superlatives, invented quotations, and filler FAQs.

Keep financial language precise. Staff hours released are not automatically cash saved; a cost comparison is not a revenue forecast. Use consistent currency and time units, state exclusions, and check every number across the prose, table, graphic, and tool. For security or implementation guidance, describe observable behavior rather than claiming that a checklist guarantees security.

### Write with a point of view

- **Advise like an experienced practitioner.** Say what you would do, why, and when you would do something else. Write for a founder whose time you respect: skip what any business owner already knows.
- **Commit to the recommendation.** Place each condition beside the claim it qualifies, once. Do not soften every sentence with “may,” “can,” or “consider.”
- **Name misleading advice.** Say plainly when common advice, a sales claim, or a popular tool's default misleads in the reader's situation, and show the evidence.
- **Make the stakes concrete.** Explain what goes wrong, who notices, and what it costs to fix later.
- **Vary the opening.** Lead with the answer, a concrete situation, a surprising result, or a costly mistake, whichever reaches the answer fastest. Do not default to the opening, scope paragraph, or closing line of recent articles.

### Make every instruction specific

For each consequential action, name the actor, the input or signal they inspect, the result they should expect, and what they do if it fails. The migration example shows the level: compare the imported project's customer ID with the approved mapping, and hold the switch if they differ. Prefer numbers with units, named standards, products, settings, thresholds, and observable behavior to adjectives. Cut any paragraph whose removal costs the reader no decision, evidence, instruction, or necessary context.

Revise passages that contain these generic patterns:

- An introduction about how fast technology changes, how important the topic is, or what the article will cover.
- Advice that fits any project standing in for an instruction, such as “communicate clearly,” “test thoroughly,” “monitor performance,” “choose the right partner,” or “it depends on your needs.”
- Unranked lists of tips, or balanced pros and cons that never reach a recommendation.
- Filler and inflated vocabulary, such as “in today's digital landscape,” “it's worth noting,” “when it comes to,” “seamless,” “robust,” “leverage,” and “unlock.”
- A conclusion that restates the article instead of giving the next action.
- Sentences recycled from other Techsouq articles, such as an identical scope paragraph or closing worksheet line.

### Make answers easy to find and cite

- **Use headings that describe the question or decision.** Lead each major section with its answer or action, then develop the reasoning. Choose a paragraph for a definition, an ordered list for a sequence, or a table with descriptive headers for a comparison. Use an FAQ only for real questions the main sections leave unanswered.
- **Read key passages in isolation.** Read the opening answer and each section's key paragraph or table as if you landed there directly. Name the product, workflow, or comparison when a pronoun would be ambiguous. Keep conditions, exceptions, units, timeframes, and permissions beside the claims they qualify. Include the substance of any chart or interactive result in visible text.
- **Answer the follow-ups on the same page.** Cover each decision-changing follow-up from the brief in its own section or passage. Create a separate page only for a distinct reader task. Google warns that creating separate pages for query variations primarily to manipulate rankings or generated responses in Google Search violates its scaled content abuse policy. [Google's AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- **Make Techsouq's contribution reproducible and attributable.** Show how to reach a decision using an original worked example, decision table, test, or template with visible inputs and assumptions. State the original finding or rule in a self-contained passage with its basis and scope, separating what an upstream source establishes from what Techsouq derived or recommends. Name a method only when it is distinct and reusable; do not coin branded frameworks or acronyms for their own sake.
- **Keep evidence beside the claim.** For an external statistic, identify the date and population or denominator and link to the original evidence. Attribute quotes to their actual source and use them only when the exact wording adds value. Use one term for one concept throughout, define acronyms once, and name products, standards, and versions precisely. [Bing's guidance on clarity and supporting evidence](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/)

The opening of a migration article can answer whether matching record counts are enough to approve the switch.

> Approve a business data migration after reconciling expected record IDs, verifying required fields and relationships, and testing a critical workflow under a normal staff role. If an open project points to the wrong customer, hold the switch and recheck the affected records after fixing the mapping, even when the totals match.

The [Techsouq migration checklist](../src/content/blog/business-data-migration-checklist.mdx) develops that rule with an illustrative reconciliation in which all 86 projects arrive and one is assigned to the wrong customer.

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

## 7. Use the SEO foundations for answer discovery

Write a distinct, descriptive title and description that match the visible article. Use the reader's wording for the question, and avoid exaggerated or shocking titles. Choose a durable slug and use trailing-slash internal article links, such as `/blog/customer-portal-mvp-scope/`. Link naturally to relevant articles and existing service anchors such as `/#services`. The layout already includes a service link; avoid repeating a sales pitch after every section.

When an existing article raises a question the new article answers, add a contextual link from the existing article as part of the publication. A link-only edit is not a substantive revision and does not change `updatedDate`.

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

### Verify eligibility for answer engines

- **Google Search.** Supporting links in AI Overviews and AI Mode require an indexed page that is eligible for a search snippet. Verify that the production page returns HTTP 200, Googlebot can crawl it, and the HTML or response headers contain no unintended `noindex` or snippet restriction. When diagnosing missing AI visibility, check the property's effective Search generative AI control if access is available. Google selects featured snippets automatically. [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Search generative AI control](https://support.google.com/webmasters/answer/16908024), [Featured snippets](https://developers.google.com/search/docs/appearance/featured-snippets)
- **ChatGPT Search, Bing, and Perplexity.** Check that production robots rules and any hosting or firewall controls allow the intended search crawlers to fetch the public article. Use `OAI-SearchBot` for ChatGPT Search, `bingbot` for Bing, and `PerplexityBot` for Perplexity. OpenAI configures `GPTBot` training access independently. If access is uncertain, record what you verified and use provider-verified crawl logs or diagnostics when available. Report public HTTP and directive checks, provider-verified crawl access or settings, and actual indexing or citations separately. A successful request that only uses a crawler's user-agent string does not prove the crawler has access; record anything you could not verify as unknown. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots), [Bing's crawler documentation](https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0), [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)

Check applicable publishing preferences separately from crawl access when investigating missing visibility. For example, Bing's grounding preferences govern whether a crawled page can inform generated answers. Report unintended restrictions and identify the setting that governs them. [Microsoft's training and grounding controls](https://blogs.bing.com/search/2026/10/your-content-your-choice-clearer-preferences-for-training-and-grounding/)

Keep the existing static MDX, `BlogPosting`, and breadcrumb markup. Skip special AI files such as `llms.txt`, extra schema, and fixed passage lengths as article requirements. Google ignores `llms.txt` in Search and has retired FAQ rich results. Keep useful questions and answers as ordinary visible content. [Google's AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Google Search documentation updates](https://developers.google.com/search/updates)

Research checked 19 November 2026. The 2024 KDD GEO paper found that sourced additions could improve its visibility metrics in controlled experiments, including a Perplexity test with supplied documents. An October 2026 preprint found that how closely pages addressed the query was associated with citations within sites in its sample, while FAQ blocks and structured data had no consistent within-site effect. Use these findings to prioritize relevant evidence and clear answers. Citation selection remains platform- and query-dependent. [KDD GEO study](https://arxiv.org/html/2311.09735v3), [What Drives AI Citations?](https://arxiv.org/abs/2610.15033)

## 8. Review and validate before delivery

### Editorial gate

Run this gate on the complete draft before implementation polish. The author does not score their own article, and an author role-playing a second reviewer does not count.

1. **Confirm a reviewer before drafting.** Use a human who did not write the draft, or a separate agent session started fresh with only the reviewer materials below, such as a new subagent or a separate CLI run. If neither is available, do not publish; report `blocked: independent review unavailable`.
2. **Review in two stages.** First give the reviewer the three AEO question texts, the complete draft, and any reader-facing artifact or prototype. Withhold the brief, research notes, and expected answers. Ask the reviewer to:
   - state the article's answer, recommendation, and original contribution in one sentence each;
   - record the action and qualification they recover for each AEO question and point to the supporting passage;
   - name the first paragraph worth keeping and any passage a reader would not miss;
   - flag generic passages, unsupported claims, and unnecessary hedges.

   Once the reviewer records those responses, compare them with the brief and record any material mismatch. Then give the reviewer the comparators from step 3 of [Research before writing](#1-research-before-writing), the evidence for consequential claims, and the locations of the declared GEO targets. Ask the reviewer to reconstruct each target from its visible passage and evidence, verify the consequential evidence, exercise the artifact or next step without the author's notes, and identify the strongest reason to choose a cheaper or simpler option and the case most likely to make the recommendation fail. Resolve material mismatches before passing the gate.

3. **The reviewer scores each criterion from 0 to 2,** citing the passage, source, or result behind each score. A 0 is absent or misleading, a 1 is present but incomplete, and a 2 is demonstrated by an exact passage, verified result, or usable output.

   | Criterion | What earns a 2 |
   | --- | --- |
   | Original contribution | The article resolves a decision the strongest competing answer leaves open, using evidence or an artifact that answer lacks. |
   | Decision usefulness | A reader can act now: the recommendation, the condition that changes it, and the next step are clear. |
   | Evidence | Every material claim is cited, observed, or derived in the article; assumptions are labelled; numbers reconcile. |
   | Specificity | Instructions name the actor, input, expected result, and failure action; no generic patterns remain. |
   | Fidelity to the question | The article answers the question the reader asked, at the scope its title and opening promise. |

4. **Pass at 9 of 10, with a 2 for original contribution and for evidence,** no missing element from the [quality bar](#the-quality-bar), and passing [AEO and GEO checks](#aeo-and-geo-checks). An unsupported material claim, a fabricated or implied experience, or an example that disagrees with its tool, table, or graphic blocks release regardless of score.
5. **Revise and review again.** Re-review any material change to the recommendation, qualifications, evidence, worked example, or artifact output before release. If the core contribution still fails after two revisions, narrow the question or choose another topic. Record the scores, the reviewer's main objections, and what changed in the run report.

### AEO and GEO checks

- **Answer recovery (AEO).** Using only the visible article, the reviewer recovers the expected action and qualification for the primary question, its natural rephrasing, and the scenario with a decision-changing fact, and points to the passage for each. For the migration article, “All 86 projects arrived. Can we switch?” should recover “not on counts alone: verify identities, relationships, and a critical workflow.” “All 86 arrived, but one points to the wrong customer. Can we switch?” should recover “hold, correct the mapping, and recheck.” Confirm that the title, description, and opening agree with those answers.
- **Citation target (GEO).** The reviewer reconstructs each declared citation target from its visible passage and evidence, including its scope and what Techsouq added beyond the upstream source. If the upstream documentation alone supports the whole answer, strengthen the contribution or tighten the question.

These are editorial tests of whether people and retrieval systems can find and correctly reuse the answer. They have no established ranking effect. An observed AI citation is not required to pass, and a single live AI response is too variable to serve as a release gate. [Study of citation variability across answer engines](https://arxiv.org/abs/2603.08924)

### Repository checks

For an article implementation, run the repository checks from the root:

```sh
pnpm build
pnpm lint
pnpm format:check
pnpm test
```

Use the Node version range in `package.json`. Format the files you changed with Prettier as needed rather than rewriting unrelated files. Start local previews with `pnpm exec astro dev --background`; manage them with the `status`, `logs`, and `stop` subcommands documented in the README.

Apply feature-specific checks only where the feature exists. Record checks for absent features as `not applicable`.

### Content and evidence

- [ ] The editorial gate, answer-recovery check, and citation-target check passed, and their results are recorded.
- [ ] The five-article comparison from [Vary the collection](#vary-the-collection) is recorded, and any reused form has a recorded reason.
- [ ] The opening gives the direct answer with its main qualification. Descriptive headings lead to the relevant follow-up answers, and each key passage or table still makes sense when read on its own.
- [ ] Consequential external claims have applicable primary evidence beside them, original evidence shows its method and result or a reproducible derivation, and assumptions are labelled separately. Volatile claims and the sources-checked date reflect actual research.
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

- [ ] Inspect `dist/blog/<slug>/index.html`. Confirm the opening answer, key passages, qualifications, and source links are present in the static article HTML. Check that the title, description, and structured data agree with the visible article.
- [ ] Verify internal URLs and fragments, image paths, descriptive alt text, canonical origin, social-image dimensions, and publication dates. Confirm the article is included in the configured-domain sitemap with the expected `<lastmod>`; unchanged articles must retain their dates on a rebuild.
- [ ] If changing shared metadata or site configuration, also verify an empty `SITE_URL` and a different valid test origin. Restore a production-configured build before preparing production output.
- [ ] Review the diff for unintended changes, generated output, temporary screenshots, credentials, and unfinished drafts. Report checks actually performed and any remaining limitations.
- [ ] Follow the current task's instructions for committing, pushing, or deploying. Completing an article does not itself authorize publishing it externally.

After an authorized deployment, verify the live article and social image, production canonical, sitemap, and [answer-engine crawl and snippet eligibility](#verify-eligibility-for-answer-engines). Record the AEO and GEO checks performed and flag anything that could only be verified after indexing or with additional access.

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

### Review answer visibility

- Use Search Console URL Inspection to diagnose indexing and the standard Performance report to monitor search clicks and impressions. Use the dedicated report for page-level impressions in AI Overviews and AI Mode when data is available. [Generative AI performance report](https://support.google.com/webmasters/answer/16984139)
- Review cited URLs and their grounding queries in Bing Webmaster Tools when available. Track identifiable ChatGPT and other answer-engine referral visits and relevant business outcomes in existing analytics, if available. Treat impressions, citations, and visits as distinct measures. Record unavailable data as unavailable. [Bing AI Performance](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/)
- When investigating an article, rerun the brief's main question and relevant follow-ups across comparable dates and settings. Record the platform, query, locale, date, cited URL, whether the answer used the article's original contribution, and whether it preserved the article's qualifications. Treat individual responses as observations. Use recurring gaps or misreadings to guide substantive improvements after checking eligibility and sources. [Study of citation variability across answer engines](https://arxiv.org/abs/2603.08924)

## Reusable request for future generation

Copy this request and replace the bracketed fields. The guide holds the rules; keep the request short so the two cannot drift apart.

```text
Create [number] Techsouq blog article(s) about [topic or reader problem] for founders and business owners in the global English-speaking market.

Read AGENTS.md, README.md, and docs/blog-generation-guide.md first. Follow the guide's quality bar, release order, applicable validation checklist, and reporting rules.

Practitioner notes Techsouq can verify: [notes, or none].
Substantive revisions to existing articles: [authorized, or not authorized].
Topic constraints or exclusions: [details, or none].
Commit, push, and deployment authorization: [explicit scope].

Report the article URLs, the decision each article resolves and its original contribution, gate scores and reviewer objections, the checks performed and their limitations, and deployment, live verification, and Google sitemap submission outcomes separately.
```
