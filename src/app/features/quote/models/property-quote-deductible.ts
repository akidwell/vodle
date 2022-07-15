export interface PropertyQuoteDeductible {
    propertyQuoteDeductibleId: number | null;
    propertyQuoteId: number | null;
    propertyDeductibleId: number | null;
    deductibleType: string | null;
    deductibleCode: string | null
    comment: string | null;
    amount: number | null;
    subjectToMinPercent: number | null;
    subjectToMinAmount: number | null;
    isExcluded: boolean;
    isSubjectToMin: boolean | null;
}
