import { Code } from 'src/app/core/models/code';
import { ProgramClass } from '../classes/program-class';

export interface Department {
  departmentId: number;
  departmentName: string;
  programMappings: ProgramClass[]
  availablePacCodes: Code[];
  availableCarrierCodes: Code[];
}
