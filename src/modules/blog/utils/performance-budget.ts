export const MAX_TRANSFER_KB = 1_000_000;

export const DEFAULT_PERFORMANCE_BUDGET = {
  ceiling: 800,
  current: 640,
  added: 240,
  removed: 140,
} as const;

export type PerformanceBudgetInputs = Record<keyof typeof DEFAULT_PERFORMANCE_BUDGET, number>;
export type PerformanceBudgetField = keyof PerformanceBudgetInputs;

export type PerformanceBudgetResult = {
  total: number;
  remaining: number;
  status: 'within' | 'at' | 'over';
};

export const PERFORMANCE_BUDGET_FIELDS = [
  {
    key: 'ceiling',
    label: 'Project transfer ceiling',
    hint: 'Your agreed limit, not a benchmark.',
  },
  { key: 'current', label: 'Current transfer', hint: 'The baseline before the proposed change.' },
  {
    key: 'added',
    label: 'Proposed additions',
    hint: 'New transfer; exclude replacements already counted as net reductions.',
  },
  {
    key: 'removed',
    label: 'Net removals',
    hint: 'Old transfer minus its replacement; count the saving once.',
  },
] as const;

export class PerformanceBudgetInputError extends Error {
  field: PerformanceBudgetField;

  constructor(field: PerformanceBudgetField, message: string) {
    super(message);
    this.name = 'PerformanceBudgetInputError';

    this.field = field;
  }
}

function validateTransfer(value: number, field: PerformanceBudgetField): number {
  const minimum = field === 'ceiling' ? 1 : 0;
  const label = PERFORMANCE_BUDGET_FIELDS.find((item) => item.key === field)!.label;

  if (!Number.isSafeInteger(value) || value < minimum || value > MAX_TRANSFER_KB) {
    throw new PerformanceBudgetInputError(
      field,
      `${label}: enter a whole number from ${minimum} to 1,000,000 kB.`,
    );
  }

  return value;
}

export function parseTransferKb(value: string, field: PerformanceBudgetField): number {
  const text = value.trim();

  if (!/^\d+$/.test(text)) {
    throw new PerformanceBudgetInputError(
      field,
      `${PERFORMANCE_BUDGET_FIELDS.find((item) => item.key === field)!.label}: enter whole kB using digits only; do not leave it blank.`,
    );
  }

  return validateTransfer(Number(text), field);
}

export function calculatePerformanceBudget(
  inputs: PerformanceBudgetInputs,
): PerformanceBudgetResult {
  for (const { key } of PERFORMANCE_BUDGET_FIELDS) {
    validateTransfer(inputs[key], key);
  }

  if (inputs.removed > inputs.current) {
    throw new PerformanceBudgetInputError(
      'removed',
      'Removals cannot exceed current transfer. Count only the net reduction from the baseline, after replacement costs.',
    );
  }

  const total = inputs.current + inputs.added - inputs.removed;
  const remaining = inputs.ceiling - total;

  const status = remaining > 0 ? 'within' : remaining < 0 ? 'over' : 'at';

  return { total, remaining, status };
}
