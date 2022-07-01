export interface History {
  id: number | null;
  policyId: number | null;
  policyNumber: string | null;
  endorsementNumber: number | null;
  submissionNumber: number | null;
  groupSequence: number | null;
  openDate: Date;
  favorite: boolean;
  hover: boolean;
}

export const newHistory = (): History => ({
  id: null,
  policyId: null,
  policyNumber: null,
  endorsementNumber: null,
  submissionNumber: null,
  groupSequence: null,
  openDate: new Date,
  favorite: false,
  hover: false
});