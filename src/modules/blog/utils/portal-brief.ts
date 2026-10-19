export type DocumentHandling = 'none' | 'download' | 'upload' | 'review';
export type BillingScope = 'none' | 'view' | 'pay';

export interface PortalBriefInput {
  clientType: string;
  primaryTask: string;
  roles: string;
  currentSystems: string;
  documentHandling: DocumentHandling;
  billing: BillingScope;
  successMetric: string;
}

export const DEFAULT_PORTAL_BRIEF: PortalBriefInput = {
  clientType: 'B2B clients reviewing creative deliverables',
  primaryTask: 'Review the latest deliverable, leave feedback, and record an approval.',
  roles: 'Client reviewer; client approver; internal project owner',
  currentSystems:
    'CRM for account ownership; cloud storage for deliverables; email for notifications',
  documentHandling: 'review',
  billing: 'none',
  successMetric:
    'Reduce median time from deliverable shared to client decision from 5 to 3 working days.',
};

function requiredText(value: string, label: string, maximum: number): string {
  const cleaned = value.trim();

  if (!cleaned) {
    throw new Error(`Enter ${label.toLowerCase()} before generating the brief.`);
  }

  if (cleaned.length > maximum) {
    throw new Error(`${label} must be ${maximum} characters or fewer.`);
  }

  return cleaned;
}

export function createPortalBrief(input: PortalBriefInput): string {
  const clientType = requiredText(input.clientType, 'Client type', 160);
  const primaryTask = requiredText(input.primaryTask, 'The primary task', 500);
  const roles = requiredText(input.roles, 'The roles', 400);

  const successMetric = requiredText(input.successMetric, 'A success measure', 400);
  const currentSystems = input.currentSystems.trim();

  if (currentSystems.length > 700) {
    throw new Error('Current systems must be 700 characters or fewer.');
  }

  if (!['none', 'download', 'upload', 'review'].includes(input.documentHandling)) {
    throw new Error('Choose one of the available document-handling options.');
  }

  if (!['none', 'view', 'pay'].includes(input.billing)) {
    throw new Error('Choose one of the available billing options.');
  }

  const capabilities = [
    'Invite named users into the correct client account; support sign-in, sign-out, and account recovery.',
    'Show one clear next task with its owner, due date, and status.',
    'Restrict every record and action by client account and role, including direct links and API requests.',
    'Record important workflow changes with the actor and timestamp; notify the next responsible person.',
  ];

  const acceptance = [
    'An invited user can sign in, find the assigned task, complete it, and understand what happens next.',
    'A user from client A cannot read or change client B records by changing a URL or request.',
    'Each listed role has a documented allow/deny matrix, and forbidden actions are tested.',
    'The primary journey works with a keyboard and at a 360px viewport; labels and errors remain readable.',
    'Failure states preserve entered work and explain whether the task succeeded, failed, or needs a retry.',
  ];

  const exclusions = [
    'Native mobile apps, a replacement CRM, and organization-wide reporting.',
    'Migration of historical data beyond an explicitly agreed launch dataset.',
    'Additional client journeys until the first journey has been tested with real clients.',
  ];

  const questions = [
    'Who owns this first release, and which clients will take part in the pilot?',
    'Who can invite users, grant roles, and revoke access when a client relationship ends?',
    'Which system owns each record, and is its integration an API, export, or manual step?',
    'Which events need an email or other notification, and who owns delivery failures?',
    'What retention, deletion, backup, and support arrangements are required?',
    'Who measures the success metric, where is the baseline, and when will the pilot be reviewed?',
  ];

  if (input.documentHandling === 'none') {
    exclusions.push('Document uploads, document storage, and file approval workflows.');
  } else if (input.documentHandling === 'download') {
    capabilities.push('Let clients download only the files shared with their account.');
    acceptance.push('A file link cannot bypass account access checks after access is revoked.');
    exclusions.push('Client uploads, version comparison, and document approvals.');
  } else if (input.documentHandling === 'upload') {
    capabilities.push(
      'Allow permitted users to upload and retrieve files attached to the correct task.',
    );
    acceptance.push(
      'Disallowed file types and oversized files are rejected with clear, recoverable errors.',
    );
    questions.push(
      'What file types, size limits, malware checks, and storage region are required?',
    );
    exclusions.push('Document approvals, electronic signatures, and version comparison.');
  } else {
    capabilities.push(
      'Present a clearly identified document version with feedback and approve/request-changes actions.',
    );
    acceptance.push(
      'An approval records its author, time, and exact version; a newer version does not inherit an old approval.',
    );
    acceptance.push(
      'A reviewer viewing an outdated version is warned before submitting a decision.',
    );
    questions.push('Who can publish a new version, who may approve, and is one approval enough?');
    questions.push(
      'What file types, size limits, malware checks, and storage region are required?',
    );
    exclusions.push('Legally binding electronic signatures and full document editing.');
  }

  if (input.billing === 'none') {
    exclusions.push('Invoices, payments, and payment reconciliation.');
  } else if (input.billing === 'view') {
    capabilities.push(
      'Display the client’s invoices and payment status from the agreed billing source.',
    );
    acceptance.push(
      'Invoice access is restricted by account; unavailable or stale billing data is clearly labelled.',
    );
    questions.push(
      'Which billing system is authoritative, and how quickly must invoice status update?',
    );
    exclusions.push('Taking payments, creating invoices, and handling payment-card details.');
  } else {
    capabilities.push(
      'Link eligible invoices to the billing provider’s hosted payment page; show confirmed payment status.',
    );
    acceptance.push(
      'A payment is marked paid only after provider confirmation; retries do not create duplicate records.',
    );
    questions.push(
      'Which provider owns checkout, reconciliation, failed payments, refunds, and billing support?',
    );
    exclusions.push(
      'Storing payment-card details and building a custom payment-processing system.',
    );
  }

  const lines = (items: string[]) => items.map((item) => `- ${item}`).join('\n');

  return [
    'CLIENT PORTAL — WORKING BRIEF',
    'A starting point to edit and agree with the project team. Examples are not commitments.',
    `AUDIENCE\n${clientType}`,
    `ONE JOB TO FINISH\n${primaryTask}`,
    `SUCCESS MEASURE\n${successMetric}\nConfirm the baseline and review period before implementation.`,
    `FIRST RELEASE JOURNEY\n1. A client receives an invitation and signs in.\n2. They see the task assigned to their account.\n3. They complete the primary task: ${primaryTask}\n4. The portal confirms the outcome and shows the next step.\n5. The internal owner sees the updated status and any action required.`,
    `ROLES AND ACCESS\n${roles}\nFor each role, agree which accounts, records, files, and actions it may access.`,
    `CURRENT SYSTEMS\n${currentSystems || 'Not yet identified. List the current systems and their owners.'}\nConfirm the source of truth and integration method for each system.`,
    `PROPOSED FIRST RELEASE CAPABILITIES\n${lines(capabilities)}`,
    `SUGGESTED EXCLUSIONS TO CONFIRM\n${lines(exclusions)}`,
    `ACCEPTANCE CHECKS\n${lines(acceptance)}`,
    `UNRESOLVED QUESTIONS\n${lines(questions)}`,
  ].join('\n\n');
}
