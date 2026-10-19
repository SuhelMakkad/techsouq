import assert from 'node:assert/strict';
import test from 'node:test';

import { createPortalBrief, DEFAULT_PORTAL_BRIEF } from '../src/lib/blog/portal-brief.ts';

test('the client approval preset produces an actionable brief without silently adding payments', () => {
  const brief = createPortalBrief(DEFAULT_PORTAL_BRIEF);

  assert.match(brief, /B2B clients reviewing creative deliverables/);
  assert.match(brief, /exact version/);
  assert.match(brief, /client A cannot read or change client B/);

  assert.match(brief, /Invoices, payments, and payment reconciliation/);
  assert.match(brief, /from 5 to 3 working days/);
  assert.match(brief, /UNRESOLVED QUESTIONS/);
});

test('document and billing choices change capabilities, checks, and exclusions', () => {
  const brief = createPortalBrief({
    ...DEFAULT_PORTAL_BRIEF,
    documentHandling: 'upload',
    billing: 'pay',
  });

  assert.match(brief, /oversized files/);
  assert.match(brief, /hosted payment page/);
  assert.match(brief, /retries do not create duplicate records/);

  assert.doesNotMatch(brief, /newer version does not inherit/);
  assert.doesNotMatch(brief, /- Invoices, payments, and payment reconciliation/);
});

test('a portal without file tools explicitly excludes them, while unknown systems remain unresolved', () => {
  const brief = createPortalBrief({
    ...DEFAULT_PORTAL_BRIEF,
    documentHandling: 'none',
    billing: 'view',
    currentSystems: '',
  });

  assert.match(brief, /Document uploads, document storage, and file approval workflows/);
  assert.match(brief, /Not yet identified/);
  assert.match(brief, /unavailable or stale billing data/);

  assert.doesNotMatch(brief, /hosted payment page/);
});

test('required inputs, supported choices, and length limits are validated', () => {
  for (const field of ['clientType', 'primaryTask', 'roles', 'successMetric']) {
    assert.throws(() => createPortalBrief({ ...DEFAULT_PORTAL_BRIEF, [field]: '  ' }));
  }

  assert.throws(() => createPortalBrief({ ...DEFAULT_PORTAL_BRIEF, clientType: 'a'.repeat(161) }));
  assert.throws(() =>
    createPortalBrief({ ...DEFAULT_PORTAL_BRIEF, currentSystems: 'a'.repeat(701) }),
  );

  assert.throws(() =>
    createPortalBrief({ ...DEFAULT_PORTAL_BRIEF, documentHandling: 'invalid' as 'none' }),
  );
  assert.throws(() => createPortalBrief({ ...DEFAULT_PORTAL_BRIEF, billing: 'invalid' as 'none' }));
});
