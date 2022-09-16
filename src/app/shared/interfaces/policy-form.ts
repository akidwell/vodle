export interface PolicyForm {
    isIncluded: boolean;
    formName: string | null;
    formTitle: string | null;
    isMandatory: boolean;
    specimenLink: string | null;
    hasSpecialNote: boolean;
    isVariable: boolean;
    formCategory: string | null;
    categorySequence: number | null;
    sortSequence: number | null;
    formIndex: number | null;
    allowMultiples: boolean | null;
 }