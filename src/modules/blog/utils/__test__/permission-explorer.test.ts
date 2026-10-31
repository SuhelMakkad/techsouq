import assert from 'node:assert/strict';
import test from 'node:test';

import {
  checkExamplePermission,
  DEFAULT_PERMISSION_EXAMPLE,
  type PermissionExampleField,
} from '../permission-explorer.ts';

test('all 32 valid requests match the three expressly permitted cases', () => {
  const permitted = new Set([
    'active/assigned/open/view-work',
    'active/assigned/closed/view-work',
    'active/assigned/open/edit-notes',
  ]);

  let requests = 0;
  let allowed = 0;

  for (const account of ['active', 'suspended']) {
    for (const assignment of ['assigned', 'unassigned']) {
      for (const jobStatus of ['open', 'closed']) {
        for (const action of ['view-work', 'edit-notes', 'view-billing', 'export-jobs']) {
          const request = `${account}/${assignment}/${jobStatus}/${action}`;
          const result = checkExamplePermission({ account, assignment, jobStatus, action });

          assert.equal(result.allowed, permitted.has(request), request);
          assert.deepEqual(result.invalidFields, [], request);
          assert.ok(result.reason.length > 0, request);

          requests += 1;
          allowed += Number(result.allowed);
        }
      }
    }
  }

  assert.equal(requests, 32);
  assert.equal(allowed, 3);
});

test('denial explanations follow account, forbidden action, assignment, then job status', () => {
  const suspended = {
    account: 'suspended',
    assignment: 'unassigned',
    jobStatus: 'closed',
    action: 'edit-notes',
  };

  for (const action of ['view-work', 'edit-notes', 'view-billing', 'export-jobs']) {
    assert.match(checkExamplePermission({ ...suspended, action }).reason, /account is suspended/);
  }

  const active = { ...suspended, account: 'active' };

  assert.match(
    checkExamplePermission({ ...active, action: 'view-billing' }).reason,
    /cannot view billing/,
  );
  assert.match(
    checkExamplePermission({ ...active, action: 'export-jobs' }).reason,
    /cannot export/,
  );
  assert.match(checkExamplePermission(active).reason, /not assigned/);

  assert.match(
    checkExamplePermission({ ...active, assignment: 'assigned' }).reason,
    /job is closed.*may view.*cannot edit/,
  );
});

test('allowed results distinguish viewing operational fields from editing work notes', () => {
  const view = checkExamplePermission(DEFAULT_PERMISSION_EXAMPLE);
  const edit = checkExamplePermission({ ...DEFAULT_PERMISSION_EXAMPLE, action: 'edit-notes' });

  assert.equal(view.allowed, true);
  assert.match(view.reason, /job ID, site, appointment, and work notes/);
  assert.match(view.reason, /whether the job is open or closed/);

  assert.equal(edit.allowed, true);
  assert.match(edit.reason, /job is open/);
  assert.match(edit.reason, /Editing work notes is allowed/);
});

test('missing and unrecognized fields cannot produce a permitted result', () => {
  const fields: PermissionExampleField[] = ['account', 'assignment', 'jobStatus', 'action'];
  const invalidValues = [undefined, null, '', ' ', 'unknown', true, false, 0, 1, [], {}];

  for (const field of fields) {
    const missing: Record<string, unknown> = { ...DEFAULT_PERMISSION_EXAMPLE };

    delete missing[field];

    const missingResult = checkExamplePermission(missing);

    assert.equal(missingResult.allowed, false, `${field} missing`);
    assert.deepEqual(missingResult.invalidFields, [field]);

    for (const value of invalidValues) {
      const result = checkExamplePermission({ ...DEFAULT_PERMISSION_EXAMPLE, [field]: value });

      assert.equal(result.allowed, false, `${field}: ${String(value)}`);
      assert.deepEqual(result.invalidFields, [field]);
      assert.match(result.reason, /listed options for every field/);
    }
  }
});

test('a malformed or absent request reports every missing field', () => {
  for (const input of [undefined, null, true, false, 0, '', 'active', [], {}]) {
    const result = checkExamplePermission(input);

    assert.equal(result.allowed, false);
    assert.deepEqual(result.invalidFields, ['account', 'assignment', 'jobStatus', 'action']);
  }
});

test('the explorer has a fixed technician role and never modifies its input', () => {
  const input = Object.freeze({ ...DEFAULT_PERMISSION_EXAMPLE, role: 'administrator' });
  const denied = checkExamplePermission({ ...input, action: 'view-billing' });

  assert.equal(denied.allowed, false);
  assert.match(denied.reason, /technician role/);
  assert.deepEqual(input, { ...DEFAULT_PERMISSION_EXAMPLE, role: 'administrator' });
});
