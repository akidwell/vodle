import { SubmissionStatusEnum } from 'src/app/core/enums/submission-status-enum';

export interface SubmissionStatus {
    submissionNumber: number | null,
    statusCode: number | null,
    eventCode: number | null,
    reasonCode: number | null,
    remarks: string,
    isNew: boolean
}

export const newSubmissionStatus = (): SubmissionStatus => {
  return {
    submissionNumber: null,
    statusCode: null,
    eventCode: null,
    reasonCode: null,
    remarks: '',
    isNew: true
  };
};

export interface SubmissionStatusResult {
  statusCode: SubmissionStatusEnum,
}