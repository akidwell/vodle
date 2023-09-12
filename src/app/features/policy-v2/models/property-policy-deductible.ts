export interface PropertyPolicyDeductible {
    endorsementDeductibleId: number | null;
    policyId: number | null;
    endorsementNo: number | null;
    isAppliedToAll: boolean;
    premisesNumber: number | null;
    buildingNumber: number | null;
    sequence: number | null;
    deductibleType: string | null;
    deductibleCode: string | null
    comment: string | null;
    amount: number | null;
    subjectToMinPercent: number | null;
    subjectToMinAmount: number | null;
    isExcluded: boolean;
    isSubjectToMin: boolean | null;
    isNew: boolean;
    isDeductibleLocked: boolean;
    isDeductibleTypeLocked: boolean;
    isExcludeLocked: boolean;
    isSubjectToMinLocked: boolean;
    guid: string;
    
}