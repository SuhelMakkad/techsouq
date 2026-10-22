// Canonical and structured-data URLs were corrected in 3f3d4c3, deployed at this time.
// Advance only for a significant shared change to existing article pages, never a rebuild.
export const SHARED_ARTICLE_MODIFIED_AT = '2026-10-22T08:23:02Z';

type ArticleDates = {
  datePublished?: unknown;
  dateModified?: unknown;
};

function timestamp(value: unknown, field: string): number {
  const parsed = typeof value === 'string' ? Date.parse(value) : NaN;

  if (!Number.isFinite(parsed)) {
    throw new Error(`Article sitemap requires a valid ${field}.`);
  }

  return parsed;
}

function isBlogPosting(value: unknown): value is ArticleDates {
  if (!value || typeof value !== 'object' || !('@type' in value)) {
    return false;
  }

  const type = value['@type'];

  return type === 'BlogPosting' || (Array.isArray(type) && type.includes('BlogPosting'));
}

export function articleLastmod(
  html: string,
  sharedModifiedAt = SHARED_ARTICLE_MODIFIED_AT,
): string {
  const scripts = html.matchAll(
    /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi,
  );
  const articles: ArticleDates[] = [];

  for (const [, json] of scripts) {
    const data: unknown = JSON.parse(json);
    const graph = data && typeof data === 'object' && '@graph' in data ? data['@graph'] : data;
    const nodes = Array.isArray(graph) ? graph : [graph];

    articles.push(...nodes.filter(isBlogPosting));
  }

  if (articles.length !== 1) {
    throw new Error('Article sitemap requires exactly one BlogPosting in the rendered page.');
  }

  const { datePublished, dateModified } = articles[0];
  const published = timestamp(datePublished, 'datePublished');
  const modified = dateModified === undefined ? published : timestamp(dateModified, 'dateModified');

  if (modified < published) {
    throw new Error('Article dateModified must not precede datePublished.');
  }

  const shared = timestamp(sharedModifiedAt, 'shared modification date');

  return new Date(Math.max(published, modified, shared)).toISOString();
}
