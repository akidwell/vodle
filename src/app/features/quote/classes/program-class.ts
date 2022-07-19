import { Code } from 'src/app/core/models/code';
import { Program } from '../models/program';
import { ProgramCoverageCarrierMapping } from '../models/program-coverage-carrier-mapping';
import { ProgramDeductibleMapping } from '../models/program-deductible-mappings';
import { QuoteClass } from './quote-class';

export class ProgramClass implements Program {
  constructor(program: Program, availableCarrierCodes?: Code[], availablePacCodes?: Code[]) {
    this.init(program, availableCarrierCodes, availablePacCodes);
  }
  private _quoteData: QuoteClass | null = null;

  programId = 0;
  programDesc = '';
  ratingTabEnabled = false;
  defaultAdmittedStatus = '';
  navTabUrl = '';
  defaultClaimsMadeOrOccurrence = '';
  availablePacCodes: Code[] = [];
  availableCarrierCodes: Code[] = [];
  allCarrierCodes: Code[] = [];
  allPacCodes: Code[] = [];
  selectedCoverageCarrierMapping: ProgramCoverageCarrierMapping | null = null;
  programCoverageCarrierMappings: ProgramCoverageCarrierMapping[] = [];
  programDeductibleMappings: ProgramDeductibleMapping[] = [];

  get quoteData() : QuoteClass | null {
    return this._quoteData;
  }
  set quoteData(value: QuoteClass | null) {
    this._quoteData = value;
    if (value != null) {
      this.navTabUrl = 'program/' + value.quoteId;
    } else {
      this.navTabUrl = '';
    }
  }

  init(program: Program, availableCarrierCodes?: Code[], availablePacCodes?: Code[]) {
    this.programId = program.programId;
    this.quoteData = program.quoteData ? new QuoteClass(program.quoteData || undefined) : null;
    this.ratingTabEnabled = program.ratingTabEnabled;
    this.programDesc = program.programDesc;
    this.allCarrierCodes = availableCarrierCodes || [];
    this.allPacCodes = availablePacCodes || [];
    this.availableCarrierCodes = availableCarrierCodes || [];
    this.availablePacCodes = availablePacCodes || [];
    this.programCoverageCarrierMappings = program.programCoverageCarrierMappings;
    this.programDeductibleMappings = program.programDeductibleMappings;
    this.setCoverageCarrierMapping();
  }
  updateGlobalSettings(admittedStatus: string, claimsMadeOrOccurrence: string) {
    if (this._quoteData != null) {
      this._quoteData.admittedStatus = admittedStatus;
      this._quoteData.claimsMadeOrOccurrence = claimsMadeOrOccurrence;

      this.setCoverageCarrierMapping();
      this.setCoverageCarrierDefaults();
    }
  }
  updateGlobalDefaults(admittedStatus: string, claimsMadeOrOccurrence: string) {
    this.defaultAdmittedStatus = admittedStatus;
    this.defaultClaimsMadeOrOccurrence = claimsMadeOrOccurrence;
  }
  setCoverageCarrierMapping() {
    console.log('availableMappings: ', this.programCoverageCarrierMappings);
    if (this._quoteData != null) {
      this.selectedCoverageCarrierMapping = this.programCoverageCarrierMappings.find(m =>
        m.admittedStatus == this._quoteData?.admittedStatus &&
      m.claimsMadeOrOccurrence == this._quoteData.claimsMadeOrOccurrence) || null;
      console.log('selected: ',this.selectedCoverageCarrierMapping);
      this.availableCarrierCodes = this.allCarrierCodes.filter(carrier => this.selectedCoverageCarrierMapping != null ? this.selectedCoverageCarrierMapping.availableCarrierCodes.includes(carrier.code.trim()) : carrier);
      this.availablePacCodes = this.allPacCodes.filter(pac => this.selectedCoverageCarrierMapping != null ? this.selectedCoverageCarrierMapping.availablePacCodes.includes(pac.code.trim()) : pac);
      if (this.selectedCoverageCarrierMapping == null) {
        this._quoteData.mappingError = true;
      }
    } else {
      this.selectedCoverageCarrierMapping = this.programCoverageCarrierMappings[0];
    }

  }
  setCoverageCarrierDefaults() {
    if (this._quoteData != null && this.selectedCoverageCarrierMapping != null) {
      this._quoteData.pacCode = this.selectedCoverageCarrierMapping.defPacCode;
      this._quoteData.carrierCode = this.selectedCoverageCarrierMapping.defCarrierCode;
      this._quoteData.coverageCode = this.selectedCoverageCarrierMapping.coverageCode;
      this._quoteData.mappingError = false;
    }
    if (this._quoteData != null &&this.selectedCoverageCarrierMapping == null) {
      this._quoteData.mappingError = true;
    }
  }
}
