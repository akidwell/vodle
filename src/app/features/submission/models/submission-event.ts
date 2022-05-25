
export interface SubmissionEvent {
    submissionNumber: number,
    eventDate: Date,
    eventDescription: string,
    eventCode: number,
    reasonCode: string,
    reasonDescription: string,
    remarks: string,
    createdBy: number,
    createdByUserName: string,
    applyToDate: number
}

