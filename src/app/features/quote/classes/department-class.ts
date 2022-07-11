import { Code } from 'src/app/core/models/code';
import { Department } from '../models/department';
import { ProgramClass } from './program-class';

export class DepartmentClass implements Department {
  private _isDirty = false;

  departmentId = 0;
  departmentName = '';
  availableCarrierCodes: Code[] = [];
  availablePacCodes: Code[] = [];
  programMappings: ProgramClass[] = [];

  //Admitted - NonAdmitted Flags
  admittedAvailable = false;
  nonAdmittedAvailable = false;
  defaultAdmittedStatus = '';
  //Claims Made - Occurrence Flags
  claimsMadeAvailable = false;
  occurrenceAvailable = false;
  defaultClaimsMadeOrOccurrence = '';
  //These settings are global over all programs
  activeAdmittedStatus!: string;
  activeClaimsMadeOrOccurrence!: string;

  constructor(department: Department) {
    this.init(department);
    this.setGlobalFlags(this.programMappings);

    if (this.defaultClaimsMadeOrOccurrence == '') {
      this.defaultClaimsMadeOrOccurrence = this.claimsMadeAvailable == true ? 'C' : 'O';
    }
    if (this.defaultAdmittedStatus == '') {
      this.defaultAdmittedStatus = this.admittedAvailable == true ? 'A' : 'N';
    }
    this.activeAdmittedStatus = this.defaultAdmittedStatus;
    this.activeClaimsMadeOrOccurrence = this.defaultClaimsMadeOrOccurrence;
  }
  get isDirty(): boolean {
    return this._isDirty ;
  }
  init(department: Department) {
    this.departmentId = department.departmentId;
    this.availableCarrierCodes = department.availableCarrierCodes;
    this.availablePacCodes = department.availablePacCodes;
    const programs: ProgramClass[] = [];
    department.programMappings.forEach(element => {
      programs.push(new ProgramClass(element, department.availableCarrierCodes, department.availablePacCodes));
    });
    this.programMappings = programs;
    console.log(this.programMappings);
  }
  setGlobalFlags(programs: ProgramClass[]) {
    programs.forEach(program => {
      const admittedOptions = program.programCoverageCarrierMappings.map(x => x.admittedStatus);
      admittedOptions.forEach(element => {
        if (element == 'A') {
          this.admittedAvailable = true;
        }
        if (element == 'N') {
          this.nonAdmittedAvailable = true;
        }
      });
      const claimsMadeOccurrenceOptions = program.programCoverageCarrierMappings.map(x => x.claimsMadeOrOccurrence);
      claimsMadeOccurrenceOptions.forEach(element => {
        if (element == 'C') {
          this.claimsMadeAvailable = true;
        }
        if (element == 'O') {
          this.occurrenceAvailable = true;
        }
      });

      if (program.quoteData != null) {
        this.defaultAdmittedStatus = program.quoteData.admittedStatus;
        this.defaultClaimsMadeOrOccurrence = program.quoteData.claimsMadeOrOccurrence;
      }
    });
  }
}
