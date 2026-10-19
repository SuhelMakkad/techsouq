import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateCosts,
  createCostComparison,
  DEFAULT_COST_OPTIONS,
  formatCost,
  parseNonnegativeNumber,
} from '../cost-calculator.ts';

test('a copied comparison includes chosen inputs, totals, and the model limitations', () => {
  const comparison = createCostComparison(DEFAULT_COST_OPTIONS, 36, 'INR');

  assert.match(comparison, /Period: 36 months/);
  assert.match(comparison, /no exchange-rate conversion/);
  assert.match(comparison, /SaaS portal/i);

  assert.match(comparison, /Upfront cash: INR 3,000/);
  assert.match(comparison, /Cash outlay: INR 76,800/);
  assert.match(comparison, /Assigned staff-time value: INR 57,600/);

  assert.match(comparison, /Staff hours per month: 40/);
  assert.match(comparison, /Exit cash allowance \(once\): INR 3,000/);
  assert.match(comparison, /capacity, not automatic cash savings/);
});

test('the worked example separates cash, staff hours, and assigned capacity value', () => {
  const saas = calculateCosts(DEFAULT_COST_OPTIONS[0], 36);
  const custom = calculateCosts(DEFAULT_COST_OPTIONS[1], 36);

  assert.deepEqual(saas, { cash: 29200, capacity: 57600, combined: 86800, staffHours: 1440 });
  assert.deepEqual(custom, { cash: 76800, capacity: 7200, combined: 84000, staffHours: 180 });

  assert.equal(custom.cash - saas.cash, 47600);
  assert.equal(saas.staffHours - custom.staffHours, 1260);
  assert.equal(saas.combined - custom.combined, 2800);
});

test('upfront and exit costs apply once while recurring costs follow the horizon', () => {
  const option = { name: 'Example', upfront: 100, monthly: 10, hours: 2, hourlyRate: 5, exit: 50 };

  assert.deepEqual(calculateCosts(option, 12), {
    cash: 270,
    capacity: 120,
    combined: 390,
    staffHours: 24,
  });
  assert.deepEqual(calculateCosts(option, 60), {
    cash: 750,
    capacity: 600,
    combined: 1350,
    staffHours: 120,
  });
});

test('zero costs, fractional rates, and unchanged numbers under a currency-label change are valid', () => {
  const option = { name: 'Example', upfront: 0, monthly: 0, hours: 0.5, hourlyRate: 2.5, exit: 0 };

  assert.deepEqual(calculateCosts(option, 12), {
    cash: 0,
    capacity: 15,
    combined: 15,
    staffHours: 6,
  });
  assert.equal(parseNonnegativeNumber(' 0 ', 'Cost'), 0);
  assert.equal(parseNonnegativeNumber('1.25', 'Rate'), 1.25);

  assert.equal(formatCost(1250.5, 'USD'), 'USD 1,250.5');
  assert.equal(formatCost(1250.5, 'INR'), 'INR 1,250.5');
});

test('invalid input never produces NaN, infinity, or misleading empty-as-zero results', () => {
  for (const value of ['', ' ', '-1', 'NaN', 'Infinity', 'word', '1e999']) {
    assert.throws(() => parseNonnegativeNumber(value, 'Cost'));
  }

  for (const months of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => calculateCosts(DEFAULT_COST_OPTIONS[0], months));
  }

  for (const amount of [-1, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_VALUE]) {
    assert.throws(() => calculateCosts({ ...DEFAULT_COST_OPTIONS[0], monthly: amount }, 36));
  }

  assert.throws(() => formatCost(10, ' '));
  assert.throws(() => formatCost(Number.NaN));
});
