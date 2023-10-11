import { ValidationClass } from 'src/app/shared/classes/validation-class';

export interface PropertyDeductible {
    propertyDeductibleId: number | null;
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
    isDirty: boolean | null;
    building: string | null;
    markForDeletion: boolean | null;
    // deleteVisible: boolean;
    // subjectToMinAmountRequired: boolean;
    // subjectToMinVisible: boolean;
    // subjectToMinPercentRequired: boolean;
    // isSubjectToMinVisible: boolean;
    // isExcludedReadonly: boolean;
    // isExcludedVisible: boolean;
    // deductibleCodeRequired: boolean;
    // deductibleTypeReadonly: boolean;
    // deductibleTypeRequired: boolean;
    // amountRequired: boolean;
    // amountReadonly: boolean;
    // deductibleReadonly: boolean;
    // deductibleRequired: boolean;
    // markDirty(): void;
    validate(): ValidationClass | null;
}

export interface PropertyQuoteDeductible extends PropertyDeductible{
    propertyQuoteDeductibleId: number | null;
    propertyQuoteId: number | null;
}

export interface PropertyEndorsementDeductible extends PropertyDeductible{
    endorsementDeductibleId: number | null;
    policyId: number | null;
    endorsementNo: number | null;
}
// export interface PropertyDeductible extends PropertyDeductibleData {
//     deductibleReadonly: boolean;
//     deductibleTypeReadonly: boolean;
//     isExcludedReadonly: boolean;
//     isSubjectToMinVisible: boolean;
//     deleteVisible: boolean;
//     subjectToMinVisible: boolean;
//     subjectToMinPercentRequired: boolean;
//     subjectToMinAmountRequired: boolean;
//     deductibleCodeRequired: boolean;
//     isExcludedVisible: boolean;
//     deductibleTypeRequired: boolean;
//     amountRequired: boolean;
//     amountReadonly: boolean;
//     deductibleRequired: boolean;
//     building: string | null;
//   }
