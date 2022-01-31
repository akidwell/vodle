export interface SubmissionResponse {
    isMatch: boolean,
    submissionNumber: number,
    effectiveDate: Date | null,
    expirationDate: Date | null
}