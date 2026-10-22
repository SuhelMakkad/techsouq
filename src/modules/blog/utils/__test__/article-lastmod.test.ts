import assert from 'node:assert/strict';
import test from 'node:test';

import { articleLastmod, SHARED_ARTICLE_MODIFIED_AT } from '../article-lastmod.ts';

function article(datePublished: unknown, dateModified?: unknown): string {
  const graph = [
    { '@type': 'BlogPosting', datePublished, dateModified },
    { '@type': 'BreadcrumbList', itemListElement: [] },
  ];

  return `<script type="application/ld+json">${JSON.stringify({ '@graph': graph })}</script>`;
}

test('a new article uses its publication date', () => {
  assert.equal(articleLastmod(article('2026-10-23T00:00:00Z')), '2026-10-23T00:00:00.000Z');
});

test('a substantive revision takes precedence over publication and shared changes', () => {
  const html = article('2026-10-21T00:00:00Z', '2026-10-25T09:00:00+05:30');

  assert.equal(articleLastmod(html), '2026-10-25T03:30:00.000Z');
});

test('older articles retain the recorded shared metadata correction date', () => {
  const html = article('2026-10-19T00:00:00Z', '2026-10-21T00:00:00Z');
  const expected = new Date(SHARED_ARTICLE_MODIFIED_AT).toISOString();

  assert.equal(articleLastmod(html), expected);
});

test('a later shared article change advances existing article dates', () => {
  const html = article('2026-10-23T00:00:00Z', '2026-10-24T00:00:00Z');

  assert.equal(articleLastmod(html, '2026-10-26T12:00:00Z'), '2026-10-26T12:00:00.000Z');
});

test('reads standalone structured data and ignores ordinary scripts', () => {
  const data = { '@type': ['Article', 'BlogPosting'], datePublished: '2026-10-23T00:00:00Z' };
  const html = `<script>not JSON</script><script id="schema" type='application/ld+json'>${JSON.stringify(data)}</script>`;

  assert.equal(articleLastmod(html), '2026-10-23T00:00:00.000Z');
});

test('missing, duplicate, or malformed article structured data fails validation', () => {
  assert.throws(() => articleLastmod('<html></html>'), /exactly one BlogPosting/);
  assert.throws(() => articleLastmod(article('2026-10-23') + article('2026-10-23')), /exactly one/);
  assert.throws(() => articleLastmod('<script type="application/ld+json">{</script>'), SyntaxError);
});

test('missing and invalid dates fail validation instead of silently omitting lastmod', () => {
  assert.throws(() => articleLastmod(article(undefined)), /valid datePublished/);
  assert.throws(() => articleLastmod(article('invalid')), /valid datePublished/);
  assert.throws(() => articleLastmod(article('2026-10-23', null)), /valid dateModified/);

  assert.throws(() => articleLastmod(article('2026-10-23'), 'invalid'), /shared modification date/);
});

test('a revision cannot precede publication', () => {
  assert.throws(() => articleLastmod(article('2026-10-23', '2026-10-22')), /must not precede/);
});
