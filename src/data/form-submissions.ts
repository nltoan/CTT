import type {FormSubmission} from '@types/forms';

const submissions: FormSubmission[] = [];

export function addSubmission(submission: FormSubmission) {
  submissions.push(submission);
}

export function listSubmissions() {
  return submissions;
}

export function listSubmissionsByForm({
  formKey,
  tenantId
}: {
  formKey: string;
  tenantId: string;
}) {
  return submissions.filter((submission) => submission.formKey === formKey && submission.tenantId === tenantId);
}
