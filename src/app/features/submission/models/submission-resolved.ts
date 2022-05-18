import { Submission } from './submission';

export interface SubmissionResolved {
    submission: Submission | null;
    error?: string;
  }
