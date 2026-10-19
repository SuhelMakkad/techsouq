import { getCollection } from 'astro:content';

export async function getPosts() {
  const posts = await getCollection('blog');

  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id),
  );
}

export function readingMinutes(body = '') {
  const prose = body.replace(/^import .*$/gm, '').replace(/<[^>]+>/g, '');
  const words = prose.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}
