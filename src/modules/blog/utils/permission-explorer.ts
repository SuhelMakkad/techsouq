const choices = {
  account: ['active', 'suspended'],
  assignment: ['assigned', 'unassigned'],
  jobStatus: ['open', 'closed'],
  action: ['view-work', 'edit-notes', 'view-billing', 'export-jobs'],
} as const;

export type PermissionExampleField = keyof typeof choices;

export type PermissionExampleInput = {
  [Field in PermissionExampleField]: (typeof choices)[Field][number];
};

export type PermissionExampleResult = {
  allowed: boolean;
  reason: string;
  invalidFields: PermissionExampleField[];
};

export const DEFAULT_PERMISSION_EXAMPLE: PermissionExampleInput = {
  account: 'active',
  assignment: 'assigned',
  jobStatus: 'open',
  action: 'view-work',
};

export function checkExamplePermission(input: unknown): PermissionExampleResult {
  const values =
    typeof input === 'object' && input !== null && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};

  const fields = Object.keys(choices) as PermissionExampleField[];
  const invalidFields = fields.filter(
    (field) => !(choices[field] as readonly unknown[]).includes(values[field]),
  );

  if (invalidFields.length) {
    return {
      allowed: false,
      reason: 'Choose one of the listed options for every field before checking this example.',
      invalidFields,
    };
  }

  const deny = (reason: string): PermissionExampleResult => ({
    allowed: false,
    reason,
    invalidFields: [],
  });

  if (values.account === 'suspended') {
    return deny('The account is suspended. This fictional policy denies every technician action.');
  }

  if (values.action === 'view-billing') {
    return deny('The technician role cannot view billing fields, even on an assigned, open job.');
  }

  if (values.action === 'export-jobs') {
    return deny(
      'The technician role cannot export the job list, regardless of assignment or status.',
    );
  }

  if (values.assignment === 'unassigned') {
    return deny(
      'The job is not assigned to this technician. Work details and work notes are denied.',
    );
  }

  if (values.action === 'edit-notes' && values.jobStatus === 'closed') {
    return deny(
      'The job is closed. This technician may view its work details but cannot edit notes.',
    );
  }

  return {
    allowed: true,
    reason:
      values.action === 'edit-notes'
        ? 'The account is active, the job is assigned to this technician, and the job is open. Editing work notes is allowed.'
        : 'The account is active and the job is assigned to this technician. Viewing job ID, site, appointment, and work notes is allowed, whether the job is open or closed.',
    invalidFields: [],
  };
}
