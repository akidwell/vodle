import { Code } from 'src/app/core/models/code';
import { ProgramClass } from '../classes/program-class';
import { TabValidationClass } from 'src/app/shared/classes/tab-validation-class';
import { Insured } from '../../insured/models/insured';

export interface Department {
  departmentId: number;
  sequenceNumber: number;
  departmentName: string;
  programMappings: ProgramClass[];
  insured: Insured;
  availablePacCodes: Code[];
  availableCarrierCodes: Code[];
  productSelectionTabValidation: TabValidationClass | null;
}
