import { Code } from 'src/app/core/models/code';
import { Department } from '../models/department';
import { ProgramClass } from './program-class';

export class DepartmentClass implements Department {
  constructor(department: Department) {
    this.init(department);
  }
  departmentId = 0;
  departmentName = '';
  availableCarrierCodes: Code[] = [];
  availablePacCodes: Code[] = [];
  programMappings: ProgramClass[] = [];
  init(department: Department) {
    this.departmentId = department.departmentId;
    this.availableCarrierCodes = department.availableCarrierCodes;
    this.availablePacCodes = department.availablePacCodes;
    const programs: ProgramClass[] = [];
    console.log(department.availableCarrierCodes);
    department.programMappings.forEach(element => {

      programs.push(new ProgramClass(element, department.availableCarrierCodes, department.availablePacCodes));
    });
    this.programMappings = programs;
    console.log(this.programMappings);
  }
}
