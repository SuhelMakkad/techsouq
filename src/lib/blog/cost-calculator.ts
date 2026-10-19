export interface CostOption {
  name: string;
  upfront: number;
  monthly: number;
  hours: number;
  hourlyRate: number;
  exit: number;
}

export interface CostTotals {
  cash: number;
  capacity: number;
  combined: number;
  staffHours: number;
}

export const DEFAULT_COST_OPTIONS: [CostOption, CostOption] = [
  { name: 'SaaS portal', upfront: 3000, monthly: 700, hours: 40, hourlyRate: 40, exit: 1000 },
  { name: 'Custom portal', upfront: 45000, monthly: 800, hours: 5, hourlyRate: 40, exit: 3000 },
];

export function parseNonnegativeNumber(value: string, label: string): number {
  if (value.trim() === '') {
    throw new Error(`Enter ${label.toLowerCase()}. Zero is allowed.`);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > Number.MAX_SAFE_INTEGER) {
    throw new Error(`${label} must be a finite number of zero or more.`);
  }

  return parsed;
}

export function calculateCosts(option: CostOption, months: number): CostTotals {
  if (!Number.isSafeInteger(months) || months < 1) {
    throw new Error('The planning period must be a positive whole number of months.');
  }

  const values = [option.upfront, option.monthly, option.hours, option.hourlyRate, option.exit];

  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new Error('All costs, hours, and rates must be finite numbers of zero or more.');
  }

  const cash = option.upfront + option.monthly * months + option.exit;
  const staffHours = option.hours * months;
  const capacity = staffHours * option.hourlyRate;

  const combined = cash + capacity;
  const totals = { cash, capacity, combined, staffHours };

  if (
    Object.values(totals).some(
      (value) => !Number.isFinite(value) || value > Number.MAX_SAFE_INTEGER,
    )
  ) {
    throw new Error('These inputs are too large to compare accurately. Use smaller values.');
  }

  return totals;
}

export function formatCost(value: number, currency = 'USD'): string {
  const label = currency.trim();

  if (!label || label.length > 12) {
    throw new Error('Use a currency label between 1 and 12 characters, such as USD or INR.');
  }

  if (!Number.isFinite(value)) {
    throw new Error('The amount must be a finite number.');
  }

  const amount = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);

  return `${label} ${amount}`;
}

export function createCostComparison(
  options: readonly [CostOption, CostOption],
  months: number,
  currency = 'USD',
): string {
  const sections = options.map((option) => {
    const totals = calculateCosts(option, months);
    const money = (amount: number) => formatCost(amount, currency);

    return [
      option.name.toUpperCase(),
      `Upfront cash: ${money(option.upfront)}`,
      `Monthly cash: ${money(option.monthly)}`,
      `Staff hours per month: ${option.hours}`,
      `Loaded hourly rate: ${currency.trim()} ${option.hourlyRate}`,
      `Exit cash allowance (once): ${money(option.exit)}`,
      '',
      `Cash outlay: ${money(totals.cash)}`,
      `Staff hours over the period: ${totals.staffHours}`,
      `Assigned staff-time value: ${money(totals.capacity)}`,
      `Cash + staff-time value: ${money(totals.combined)}`,
    ].join('\n');
  });

  return [
    'SOFTWARE COST COMPARISON — PLANNING ESTIMATE',
    `Period: ${months} months\nCurrency label: ${currency.trim()} (no exchange-rate conversion)`,
    ...sections,
    'FORMULAS\nCash = upfront cash + (monthly cash × months) + exit allowance.\nStaff-time value = staff hours per month × loaded hourly rate × months.\nCombined = cash + staff-time value.',
    'MODEL LIMITATIONS\nReleased time is capacity, not automatic cash savings. Recurring costs stay flat. The exit allowance is included once. Tax, inflation, financing, and revenue changes are excluded. This is a planning estimate, not a vendor quote. Compare both options with the same currency and horizon.',
  ].join('\n\n');
}
