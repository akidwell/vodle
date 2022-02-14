export interface SubmissionResponse {
    isMatch: boolean,
    submissionNumber: number,
    effectiveDate: Date | null,
    expirationDate: Date | null,
    expiringPolicyId: number | null
    policySymbol: string,
    policyNumber: string
}