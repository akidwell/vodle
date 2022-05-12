import { SubmissionSearchResponses } from '../../home/models/search-results';

export interface SubmissionActivityResolved {
    submissionSearchResponse: SubmissionSearchResponses[] | null;
    error?: any;
  }
