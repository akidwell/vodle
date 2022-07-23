export interface PropertyDeductibleData {
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
    isNew: boolean;
    isLocked: boolean;
    canExclude: boolean;
    canSubjectToMin: boolean;
}

export interface PropertyDeductible extends PropertyDeductibleData {
    deductibleReadonly: boolean;
    isSubjectToMinVisible: boolean;
    deleteVisible: boolean;
    subjectToMinVisible: boolean;
    subjectToMinPercentRequired: boolean;
    subjectToMinAmountRequired: boolean;
    deductibleCodeRequired: boolean;
    isExcludedVisible: boolean;
    deductibleTypeRequired: boolean;
    amountRequired: boolean;
    amountReadonly: boolean;
    deductibleRequired: boolean;
  }