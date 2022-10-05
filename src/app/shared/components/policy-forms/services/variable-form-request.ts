import { VariableFormData } from 'src/app/shared/interfaces/variable-form-data';

export interface VariableFormRequest {
    formName: string,
    companycode: number,
    businessUnit: string,
    departmentCode: string,
    producerCode: number | null,
    underwriterId: string,
    programId: number | null,
    pacCode: string,
    effectiveDate: Date | null
    formData: VariableFormData[] | null
}

export const newVariableFormRequest = (): VariableFormRequest => ({
  formName: '',
  companycode: 0,
  businessUnit: '',
  departmentCode: '',
  producerCode: null,
  underwriterId: '',
  programId: null,
  pacCode: '',
  effectiveDate: null,
  formData: null
});