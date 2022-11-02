import { VariableColumnData } from './variable-column-data';

export interface VariableForm {
    formHTML: string,
    formData: string,
    htmlStyle: string,
    columnData: VariableColumnData[] | null,
}