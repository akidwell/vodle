import { SubmissionClass } from '../classes/submission-class';

export interface SubmissionResolved {
    submission: SubmissionClass | null;
    error?: string;
  }
