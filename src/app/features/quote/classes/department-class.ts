import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { Code } from 'src/app/core/models/code';
import { Validation } from 'src/app/shared/interfaces/validation';
import { SubmissionClass } from '../../submission/classes/submission-class';
import { Department } from '../models/department';
import { ProgramClass } from './program-class';
import { QuoteClass } from './quote-class';
import { QuoteValidationClass } from './quote-validation-class';
import { TabValidationClass } from 'src/app/shared/classes/tab-validation-class';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Insured } from '../../insured/models/insured';

export class DepartmentClass implements Department, Validation {
  private _isDirty = false;
  private _isValid = true;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validationResults: QuoteValidationClass;
  departmentId = 0;
  departmentName = '';
  sequenceNumber = 0;
  availableCarrierCodes: Code[] = [];
  availablePacCodes: Code[] = [];
  programMappings: ProgramClass[] = [];
  insured!: Insured;
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
  productSelectionTabValidation: TabValidationClass | null = null;

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

    this.productSelectionTabValidation = new TabValidationClass(QuoteValidationTabNameEnum.ProductSelection);
    this.validate();
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
    this.insured = department.insured;
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
    this._canBeSaved = true;
    this._isValid = true;
    this._validationResults.resetValidation();
    const quotes = this.programMappings.map(x => x.quoteData).filter((x): x is QuoteClass => x !== null);
    const quoteValidations: QuoteValidationClass[] = [];
    quotes.forEach(quote => {
      quote.validate();
      quoteValidations.push(quote.validationResults);
    });

    this.validateProductSelectionTab();
    this._validationResults.mapValues(this);
    this._validationResults.validateChildValidations(quoteValidations);
    return this._validationResults;
  }

  validateProductSelectionTab() {
    this.productSelectionTabValidation?.resetValidation();
    this.programMappings.map(c => {
      let policyDatesErrorMessage = c.quoteData?.checkPolicyDates() ?? [];
      if (this.productSelectionTabValidation && policyDatesErrorMessage.length > 0) {
        this._canBeSaved = false;
        this._isValid = false;
        policyDatesErrorMessage = policyDatesErrorMessage.map(m => m = m + ' for Submission: ' + c.quoteData?.submissionNumber);
        this.productSelectionTabValidation.errorMessages = this.productSelectionTabValidation.errorMessages.concat(policyDatesErrorMessage);
      }
    });
  }
  markDirty() {
    this._isDirty = true;
    this._validationResults.isDirty = true;
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
  childQuotesAreDirty() {
    let isDirty = this._isDirty;
    let canBeSaved = this._canBeSaved;

    this.programMappings.forEach(program => {
      if(program.quoteData && program.quoteData.isDirty) {
        isDirty = true;
      }
      if(program.quoteData && !program.quoteData.canBeSaved) {
        canBeSaved = false;
      }
    });
    return isDirty && canBeSaved;
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
