export interface History {
  id: number | null;
  policyId: number | null;
  policyNumber: string | null;
  endorsementNumber: number | null;
  submissionNumber: number | null;
  quoteId: number | null;
  quoteNumber: number | null;
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
  quoteId: null,
  quoteNumber: null,
  openDate: new Date,
  favorite: false,
  hover: false
});