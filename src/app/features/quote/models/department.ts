import { Code } from 'src/app/core/models/code';
import { ProgramClass } from '../classes/program-class';

export interface Department {
  departmentId: number;
  sequenceNumber: number;
  departmentName: string;
  programMappings: ProgramClass[]
  availablePacCodes: Code[];
  availableCarrierCodes: Code[];
}
