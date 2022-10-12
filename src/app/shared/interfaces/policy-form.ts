import { VariableFormData } from './variable-form-data';

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
    attachmentMethod: string | null;
    allowMultiples: boolean | null;
    formData: VariableFormData[] | null;
 }