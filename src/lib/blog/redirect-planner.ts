export type RedirectAction = 'keep' | 'move' | 'merge' | 'remove';

export interface RedirectRow {
  source: string;
  action: RedirectAction;
  destination: string;
  note: string;
}

export interface RedirectIssue {
  rowIndex: number;
  field: 'source' | 'action' | 'destination';
  severity: 'error' | 'warning';
  message: string;
}

export const sampleRedirectRows: RedirectRow[] = [
  { source: '/services', action: 'keep', destination: '/services', note: 'Marketing: retain URL' },
  {
    source: '/web-design',
    action: 'move',
    destination: '/website-design',
    note: 'Marketing: renamed service',
  },
  {
    source: '/website-audits',
    action: 'merge',
    destination: '/website-strategy',
    note: 'Content: preserve relevant audit guidance',
  },
  {
    source: '/conversion-review',
    action: 'merge',
    destination: '/website-strategy',
    note: 'Content: preserve relevant conversion guidance',
  },
  {
    source: '/events/2024-workshop',
    action: 'remove',
    destination: '',
    note: 'Events: no useful replacement',
  },
];

export function pathError(path: string): string | undefined {
  if (!path) return 'Enter a path, such as /services.';

  if (!path.startsWith('/') || path.startsWith('//')) {
    return 'Use a site-relative path beginning with one slash, such as /services.';
  }

  if (
    /[\s\\?#<>"`{}|^]/u.test(path) ||
    [...path].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
  ) {
    return 'Use only the pathname: no spaces, query strings, fragments, backslashes, or unencoded special characters.';
  }

  if (/%(?![\da-f]{2})/iu.test(path)) {
    return 'Complete each percent-encoded character, such as %20. Existing encoding is preserved.';
  }

  const hasDotSegment = path.split('/').some((segment) => {
    const dots = segment.replace(/%2e/giu, '.');

    return dots === '.' || dots === '..';
  });

  if (hasDotSegment) {
    return 'Enter the final pathname without . or .. segments, including encoded dot segments.';
  }

  return undefined;
}

export function intendedStatus(action: RedirectAction): 200 | 301 | 404 {
  if (action === 'keep') return 200;

  return action === 'remove' ? 404 : 301;
}

export function intendedDestination(row: RedirectRow): string {
  if (row.action === 'keep') return row.source;

  return row.action === 'remove' ? '' : row.destination;
}

export function validateRedirectRows(rows: RedirectRow[]): RedirectIssue[] {
  const issues: RedirectIssue[] = [];
  const sources = new Map<string, number[]>();

  rows.forEach((row, rowIndex) => {
    const sourceError = pathError(row.source);
    const sourceIndexes = sources.get(row.source) ?? [];

    sourceIndexes.push(rowIndex);
    sources.set(row.source, sourceIndexes);

    if (sourceError) {
      issues.push({ rowIndex, field: 'source', severity: 'error', message: sourceError });
    }

    if (!['keep', 'move', 'merge', 'remove'].includes(row.action)) {
      issues.push({
        rowIndex,
        field: 'action',
        severity: 'error',
        message: 'Choose a supported action.',
      });
    }

    if (row.action !== 'move' && row.action !== 'merge') return;

    const destinationError = pathError(row.destination);

    if (destinationError) {
      issues.push({ rowIndex, field: 'destination', severity: 'error', message: destinationError });
    } else if (row.source === row.destination) {
      issues.push({
        rowIndex,
        field: 'destination',
        severity: 'error',
        message: 'This redirects to itself. Choose Keep or a different destination.',
      });
    }
  });

  sources.forEach((indexes, source) => {
    if (!source || indexes.length < 2) return;

    indexes.forEach((rowIndex) => {
      issues.push({
        rowIndex,
        field: 'source',
        severity: 'error',
        message: 'This old path appears more than once. Keep one decision per old path.',
      });
    });
  });

  const invalidRows = new Set(issues.map((issue) => issue.rowIndex));
  const validSources = new Map(
    rows.flatMap((row, index) => (invalidRows.has(index) ? [] : [[row.source, row] as const])),
  );

  rows.forEach((row, rowIndex) => {
    if (invalidRows.has(rowIndex) || (row.action !== 'move' && row.action !== 'merge')) return;

    const visited = new Set([row.source]);
    let destination = row.destination;
    let hasChain = false;

    while (true) {
      if (visited.has(destination)) {
        issues.push({
          rowIndex,
          field: 'destination',
          severity: 'error',
          message: 'This route reaches a redirect loop. Point it directly at a final page.',
        });

        return;
      }

      visited.add(destination);

      const next = validSources.get(destination);

      if (!next || next.action === 'keep') break;

      if (next.action === 'remove') {
        issues.push({
          rowIndex,
          field: 'destination',
          severity: 'error',
          message:
            'This route ends at a page marked for removal. Choose a useful live destination.',
        });

        return;
      }

      destination = next.destination;
      hasChain = true;
    }

    if (hasChain) {
      issues.push({
        rowIndex,
        field: 'destination',
        severity: 'warning',
        message: `Redirect chain: point directly to ${destination} if it is the relevant final page.`,
      });
    }
  });

  return issues;
}

function csvCell(value: string): string {
  // Quoting alone does not stop spreadsheet applications from evaluating formulas.
  const startsWithFormula = /^[=+@-]/u.test(value.replace(/^[\s\p{Cc}]+/u, ''));
  const safeValue = startsWithFormula || /^[\t\r\n]/u.test(value) ? `'${value}` : value;

  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function redirectRowsToCsv(rows: RedirectRow[]): string {
  if (!rows.length || validateRedirectRows(rows).some((issue) => issue.severity === 'error')) {
    throw new Error('Add at least one row and fix all errors before exporting.');
  }

  const header = ['old_path', 'action', 'destination_path', 'intended_status', 'owner_note'];
  const records = rows.map((row) => [
    row.source,
    row.action,
    intendedDestination(row),
    String(intendedStatus(row.action)),
    row.note,
  ]);

  return [header, ...records].map((record) => record.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
