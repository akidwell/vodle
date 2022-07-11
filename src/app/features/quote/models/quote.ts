import { Moment } from 'moment';
import { Submission } from '../../submission/models/submission';

export interface Quote {
  submissionNumber: number | null;
  quoteId: number | null;
  cuspNumber: number | null;
  quoteNumber: number | null;
  sequenceNumber: number | null;
  effectiveDate: Date | Moment | null;
  expirationDate: Date | Moment | null;
  status: number;
  claimsMadeOrOccurrence: string;
  admittedStatus: string;
  policyNumber: string | number;
  coverageCode: number | null;
  carrierCode: string;
  pacCode: string;
  submission: Submission
}
