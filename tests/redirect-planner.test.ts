import assert from 'node:assert/strict';
import test from 'node:test';

import {
  intendedDestination,
  intendedStatus,
  pathError,
  redirectRowsToCsv,
  sampleRedirectRows,
  validateRedirectRows,
  type RedirectRow,
} from '../src/lib/blog/redirect-planner.ts';

const move = (source: string, destination: string): RedirectRow => ({
  source,
  destination,
  action: 'move',
  note: '',
});

test('the worked example is valid and covers all intended statuses', () => {
  assert.deepEqual(validateRedirectRows(sampleRedirectRows), []);
  assert.deepEqual(
    sampleRedirectRows.map((row) => intendedStatus(row.action)),
    [200, 301, 301, 301, 404],
  );
  assert.equal(intendedDestination(sampleRedirectRows[0]), '/services');
  assert.equal(intendedDestination(sampleRedirectRows[4]), '');
});

test('accepts exact pathnames without normalizing case, encoding, or trailing slashes', () => {
  const paths = ['/', '/Services/', '/docs/%2Freference', '/a//b', '/café', '/hello%20world'];

  paths.forEach((path) => assert.equal(pathError(path), undefined, path));
  assert.deepEqual(
    validateRedirectRows([
      move('/Services/', '/services'),
      move('/docs/%2Freference', '/docs/reference'),
    ]),
    [],
  );
});

test('rejects unsafe or ambiguous pathname input', () => {
  const paths = [
    '',
    'services',
    'https://example.com/a',
    '//example.com/a',
    '/a?b=c',
    '/a#b',
    '/a b',
    '/a\nb',
    '/a\\b',
    '/a/%2',
    '/a/%GG',
    '/a/../b',
    '/a/./b',
    '/a/%2e%2E/b',
    '/a<',
  ];

  paths.forEach((path) => assert.ok(pathError(path), path));
});

test('requires destinations for moves and merges and rejects duplicate sources', () => {
  const issues = validateRedirectRows([move('/a', ''), { ...move('/a', '/b'), action: 'merge' }]);

  assert.ok(issues.some((issue) => issue.rowIndex === 0 && issue.field === 'destination'));
  assert.equal(issues.filter((issue) => issue.field === 'source').length, 2);
  assert.ok(issues.every((issue) => issue.severity === 'error'));
});

test('blocks self redirects, redirect loops, and redirects into loops', () => {
  assert.match(validateRedirectRows([move('/a', '/a')])[0].message, /itself/);

  const issues = validateRedirectRows([
    move('/a', '/b'),
    move('/b', '/a'),
    move('/incoming', '/a'),
  ]);

  assert.equal(issues.length, 3);
  assert.ok(issues.every((issue) => issue.severity === 'error' && issue.message.includes('loop')));
});

test('warns about chains and identifies the final destination', () => {
  const rows = [move('/a', '/b'), move('/b', '/c'), move('/c', '/final')];
  const issues = validateRedirectRows(rows);

  assert.equal(issues.length, 2);
  assert.ok(
    issues.every((issue) => issue.severity === 'warning' && issue.message.includes('/final')),
  );
  assert.doesNotThrow(() => redirectRowsToCsv(rows));
});

test('accepts a redirect to a kept URL and blocks a destination marked for removal', () => {
  const kept: RedirectRow = { source: '/b', action: 'keep', destination: '', note: '' };

  assert.deepEqual(validateRedirectRows([move('/a', '/b'), kept]), []);
  assert.match(
    validateRedirectRows([move('/a', '/b'), { ...kept, action: 'remove' }])[0].message,
    /removal/,
  );
});

test('CSV preserves quoted and multiline notes and protects spreadsheet formulas', () => {
  const rows = [
    { ...move('/a', '/b'), note: 'Alex, "content owner"\nReview before launch' },
    { ...move('/c', '/d'), note: '=HYPERLINK("https://example.com")' },
    { ...move('/e', '/f'), note: '  +1+1' },
    { ...move('/g', '/h'), note: '\tplain text' },
  ];

  const csv = redirectRowsToCsv(rows);

  assert.ok(
    csv.startsWith('"old_path","action","destination_path","intended_status","owner_note"\r\n'),
  );
  assert.ok(csv.includes('"Alex, ""content owner""\nReview before launch"'));
  assert.ok(csv.includes('"\'=HYPERLINK(""https://example.com"")"'));
  assert.ok(csv.includes('"\'  +1+1"'));
  assert.ok(csv.includes('"\'\tplain text"'));
});

test('CSV uses correct destinations for kept and removed pages', () => {
  const csv = redirectRowsToCsv(sampleRedirectRows);

  assert.ok(csv.includes('"/services","keep","/services","200"'));
  assert.ok(csv.includes('"/events/2024-workshop","remove","","404"'));
});

test('prevents exports with errors or no decisions', () => {
  assert.throws(() => redirectRowsToCsv([]));
  assert.throws(() => redirectRowsToCsv([move('/a', '')]));
  assert.throws(() => redirectRowsToCsv([move('/a', '/a')]));
});
