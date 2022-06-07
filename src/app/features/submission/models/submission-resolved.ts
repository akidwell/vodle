import { SubmissionClass } from '../classes/SubmissionClass';

export interface SubmissionResolved {
    submission: SubmissionClass | null;
    error?: string;
  }
