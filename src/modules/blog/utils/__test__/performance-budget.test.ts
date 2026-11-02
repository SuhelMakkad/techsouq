import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculatePerformanceBudget,
  DEFAULT_PERFORMANCE_BUDGET,
  MAX_TRANSFER_KB,
  parseTransferKb,
  PERFORMANCE_BUDGET_FIELDS,
  PerformanceBudgetInputError,
} from '../performance-budget.ts';

test('the worked transfer example leaves 60 decimal kB of headroom', () => {
  assert.deepEqual(calculatePerformanceBudget(DEFAULT_PERFORMANCE_BUDGET), {
    total: 740,
    remaining: 60,
    status: 'within',
  });
});

test('keeping the old transfer exceeds the chosen ceiling by 80 kB', () => {
  assert.deepEqual(calculatePerformanceBudget({ ...DEFAULT_PERFORMANCE_BUDGET, removed: 0 }), {
    total: 880,
    remaining: -80,
    status: 'over',
  });
});

test('exactly matching the ceiling has a distinct status', () => {
  assert.deepEqual(calculatePerformanceBudget({ ...DEFAULT_PERFORMANCE_BUDGET, removed: 80 }), {
    total: 800,
    remaining: 0,
    status: 'at',
  });
});

test('zero transfer is valid while a zero ceiling is not', () => {
  assert.deepEqual(calculatePerformanceBudget({ ceiling: 1, current: 0, added: 0, removed: 0 }), {
    total: 0,
    remaining: 1,
    status: 'within',
  });

  assert.equal(parseTransferKb(' 0 ', 'current'), 0);
  assert.throws(() => parseTransferKb('0', 'ceiling'), PerformanceBudgetInputError);
  assert.throws(() => calculatePerformanceBudget({ ...DEFAULT_PERFORMANCE_BUDGET, ceiling: 0 }));
});

test('net removals reduce only the existing baseline transfer', () => {
  assert.deepEqual(
    calculatePerformanceBudget({ ceiling: 800, current: 640, added: 100, removed: 640 }),
    {
      total: 100,
      remaining: 700,
      status: 'within',
    },
  );

  assert.throws(
    () => calculatePerformanceBudget({ ...DEFAULT_PERFORMANCE_BUDGET, removed: 641 }),
    (error) => error instanceof PerformanceBudgetInputError && error.field === 'removed',
  );
});

test('the input guard accepts its boundary and allows a larger calculated sum', () => {
  for (const { key } of PERFORMANCE_BUDGET_FIELDS) {
    assert.equal(parseTransferKb(String(MAX_TRANSFER_KB), key), MAX_TRANSFER_KB);
    assert.throws(() => parseTransferKb(String(MAX_TRANSFER_KB + 1), key));
  }

  assert.deepEqual(
    calculatePerformanceBudget({
      ceiling: 1,
      current: MAX_TRANSFER_KB,
      added: MAX_TRANSFER_KB,
      removed: 0,
    }),
    { total: 2_000_000, remaining: -1_999_999, status: 'over' },
  );
});

test('blank, fractional, nonfinite and non-decimal strings never become valid inputs', () => {
  for (const value of [
    '',
    ' ',
    '1.2',
    '1.0',
    '-1',
    'NaN',
    'Infinity',
    '1e3',
    '0x10',
    '1,000',
    'word',
  ]) {
    assert.throws(
      () => parseTransferKb(value, 'added'),
      (error) => error instanceof PerformanceBudgetInputError && error.field === 'added',
    );
  }

  assert.throws(() => parseTransferKb('9'.repeat(400), 'added'));
  assert.equal(parseTransferKb(' 240 ', 'added'), 240);
});

test('direct calculation also rejects invalid values in every field', () => {
  for (const { key } of PERFORMANCE_BUDGET_FIELDS) {
    for (const value of [-1, 1.5, Number.NaN, Infinity, -Infinity, MAX_TRANSFER_KB + 1]) {
      assert.throws(
        () => calculatePerformanceBudget({ ...DEFAULT_PERFORMANCE_BUDGET, [key]: value }),
        (error) => error instanceof PerformanceBudgetInputError && error.field === key,
      );
    }
  }
});
