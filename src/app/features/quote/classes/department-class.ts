import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { Code } from 'src/app/core/models/code';
import { Validation } from 'src/app/shared/interfaces/validation';
import { SubmissionClass } from '../../submission/classes/SubmissionClass';
import { Department } from '../models/department';
import { ProgramClass } from './program-class';
import { QuoteClass } from './quote-class';
import { QuoteValidationClass } from './quote-validation-class';

export class DepartmentClass implements Department, Validation {
  private _isDirty = false;
  private _isValid = true;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _showErrors = false;
  private _validationResults: QuoteValidationClass;
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
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Department, null);
  }
  get isDirty(): boolean {
    return this._isDirty;
  }
  get isValid(): boolean {
    // quotes.forEach(quote => {
    //   if (!quote.isValid) {
    //     valid = quote.isValid;
    //   }
    // });
    return this._isValid;
  }
  get errorMessages() {
    return this._errorMessages;
  }
  get validationResults() {
    return this._validationResults;
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
  validate(){
    this._validationResults.resetValidation();
    const quotes = this.programMappings.map(x => x.quoteData).filter((x): x is QuoteClass => x !== null);
    const quoteValidations: QuoteValidationClass[] = [];
    quotes.forEach(quote => {
      quote.validate();
      quoteValidations.push(quote.validationResults);
    });
    this._validationResults.validateChildValidations(quoteValidations);
    return this._validationResults;
  }
  markClean() {
    this._isDirty = false;
  }
  markStructureClean() {
    this.markClean();
    this.markChildrenClean();
  }
  afterSave() {
    this.markStructureClean();
  }
  markChildrenClean() {
    this.cleanChildArray(this.programMappings);
  }
  cleanChildArray(children: ProgramClass[]) {
    children.forEach(child => {
      if(child.quoteData && child.quoteData.validationResults.canBeSaved) {
        child.quoteData?.afterSave();
      }
    });
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
