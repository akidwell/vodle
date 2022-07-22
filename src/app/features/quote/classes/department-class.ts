import { Code } from 'src/app/core/models/code';
import { SubmissionClass } from '../../submission/classes/SubmissionClass';
import { Department } from '../models/department';
import { ProgramClass } from './program-class';
import { QuoteClass } from './quote-class';

export class DepartmentClass implements Department {
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = false;
  private _showErrors = false;

  departmentId = 0;
  departmentName = '';
  sequenceNumber = 0;
  availableCarrierCodes: Code[] = [];
  availablePacCodes: Code[] = [];
  programMappings: ProgramClass[] = [];
  submissionForQuote: SubmissionClass | null = null;
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
    return this._isDirty;
  }
  get isValid(): boolean {
    let valid = true;
    const invalidList = [];
    const quotes = this.programMappings.map(x => x.quoteData).filter((x): x is QuoteClass => x !== null);
    quotes.forEach(quote => {
      if (!quote.isValid) {
        valid = quote.isValid;
      }
    });
    return valid;
  }
  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  init(department: Department) {
    this.departmentId = department.departmentId;
    this.availableCarrierCodes = department.availableCarrierCodes;
    this.availablePacCodes = department.availablePacCodes;
    this.sequenceNumber = department.sequenceNumber;
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
  markClean() {
    this._isDirty = false;
    this._isValid = false;
  }
  toJSON() {
    const programs: any[] = [];
    this.programMappings.forEach(program => {
      programs.push(program.toJSON());
    });
    return {
      departmentId: this.departmentId,
      sequenceNumber: this.sequenceNumber,
      programMappings: programs
    };
  }
}
