export interface PolicyForm {
    isIncluded: boolean;
    formName: string | null;
    formTitle: string | null;
    isMandatory: boolean;
    specimenLink: string | null;
    hasSpecialNote: boolean;
    specialNote: string | null;
    isVariable: boolean;
    formCategory: string | null;
    sortSequence: number | null;
    formIndex: number | null;
 }