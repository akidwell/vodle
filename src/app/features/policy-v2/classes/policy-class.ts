import { Validation } from 'src/app/shared/interfaces/validation';
import { Insured } from '../../insured/models/insured';
import { ParentBaseClass } from './base/parent-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { QuoteData, RiskLocation, Endorsement, PolicyInformation } from '../../policy/models/policy';
import { TransactionTypes } from 'src/app/core/constants/transaction-types';
import { Code } from 'src/app/core/models/code';
import { PolicyValidationClass } from './policy-validation-class';
import { PolicyValidationTabNameEnum } from 'src/app/core/enums/policy-validation-tab-name-enum';
import { Producer } from '../../submission/models/producer';
import { AdditionalNamedInsured } from 'src/app/shared/components/additional-named-insured/additional-named-insured';

export class PolicyClass extends ParentBaseClass implements PolicyInformation, Validation {
  quoteData!: QuoteData;
  riskLocation!: RiskLocation;
  endorsement!: Endorsement;
  policyEventCode!: string;
  packageInd!: string;
  policyType!: string | null;
  policyNo!: string;
  policyModNo!: string;
  fullPolicyNo!: string;
  enteredDate!: Date;
  policyInsuredState!: string;
  policyExpirationDate!: Date;
  policyExtendedExpDate!: Date | null;
  policyCancelDate!: Date | null;
  retroDate!: Date | null;
  programName!: string;
  riskGradeCode!: string;
  auditCode!: string;
  paymentFrequency!: string;
  deregulationIndicator!: string;
  nyftz!: string | null;
  riskType!: string;
  assumedCarrier!: string | null;
  coinsurancePercentage!: number;
  productManufactureDate!: Date;
  submissionNumber!: number;

  departmentId!: number;
  policyId!: number;
  commRate!:number;
  endorsementNumber!: number;

  policySymbol!: string;
  formattedPolicyNo!: string;
  programId!: number;
  policyEffectiveDate!: Date;

  producer!: Producer;
  additionalNamedInsuredData!: AdditionalNamedInsured[];
  insured!: Insured;
  isDirty!: boolean;
  canBeSaved!: boolean;
  errorMessages!: string[];
  validationResults!: Validation;

  lockEndorsementFields = this.setEndorsementFieldStatus();
  dereg!: boolean;
  assumed!: boolean;
  endorsementChanged = false;
  canSetRetroDate = false;
  canSetClaimsMadeOccurrence = false;
  coverageCodesList: Code[] = [];


  constructor(policy?: PolicyInformation) {
    super();
    if (policy) {
      this.existingInit(policy);
    } else {
      this.newInit();
    }
    this.validationResults = new PolicyValidationClass(PolicyValidationTabNameEnum.PolicyInfo);
    //this.setWarnings();
  }
  existingInit(policy: PolicyInformation) {
    this.riskLocation = policy.riskLocation ;
    this.endorsement = policy.endorsement;
    this.policyEventCode = 'B';
    this.packageInd = policy.packageInd;
    this.policyType = policy.policyType;
    this.policyNo = policy.policyNo;
    this.policyModNo = policy.policyModNo;
    this.fullPolicyNo = policy.fullPolicyNo;
    this.enteredDate = new Date();
    this.policyInsuredState = policy.policyInsuredState;
    this.policyExpirationDate = policy.policyExpirationDate;
    this.policyExtendedExpDate = policy.policyEffectiveDate;
    this.policyCancelDate = policy.policyCancelDate;
    this.retroDate = policy.retroDate;
    this.programName = policy.programName;
    this.riskGradeCode = policy.riskGradeCode;
    this.auditCode = policy.auditCode;
    this.paymentFrequency = policy.paymentFrequency;
    this.deregulationIndicator = policy.deregulationIndicator;
    this.nyftz = policy.nyftz;
    this.riskType = policy.riskType;
    this.assumedCarrier = policy.assumedCarrier;
    this.coinsurancePercentage = policy.coinsurancePercentage;
    this.productManufactureDate = policy.productManufactureDate;
    this.submissionNumber = policy.submissionNumber;
    this.departmentId = policy.departmentId;
    this.policyId = policy.policyId;
    this.policySymbol = policy.policySymbol;
    this.formattedPolicyNo = policy.formattedPolicyNo;
    this.programId = policy.programId;
    this.policyEffectiveDate = policy.policyEffectiveDate;
    this.producer = policy.producer;
    this.insured = policy.insured;
    this.additionalNamedInsuredData = policy.additionalNamedInsuredData;
    this.commRate = policy.commRate;
    // this.setReadonlyFields();
    // this.setRequiredFields();
  }
  newInit() {
    this.policyId = 0;
  }

  afterSave() {
    if (this.validationResults?.canBeSaved) {
      // this.markStructureClean();
      this.isDirty = false;
    }
  }
  onSave(savedPolicy:PolicyClass){
    return this.validationResults;
  }


  validate(): Validation {
    this.validationResults.canBeSaved = true;
    this.validationResults.isDirty = true;
    return this.validationResults;
  }
  onGuidNewMatch(T: ParentBaseClass): void {
    throw new Error('Method not implemented.');
  }
  onGuidUpdateMatch(T: ParentBaseClass): void {
    throw new Error('Method not implemented.');
  }
  onChildDeletion(child: Deletable): void {
    throw new Error('Method not implemented.');
  }
  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }


  // isValid(): boolean {
  //   const effectiveDate = Number(this.datePipe.transform(this.policyEffectiveDate, 'yyyyMMdd'));
  //   const expirationDate = Number(this.datePipe.transform(this.policyExpirationDate, 'yyyyMMdd'));
  //   const validZip = ZipCodeCountry(this.riskLocation.zip) == this.dropdowns.getCountryByState(this.riskLocation.state);
  //   return effectiveDate < expirationDate && validZip && thisForm.status == 'VALID';
  // }

  // ErrorMessages(): string[] {
  //   const effectiveDate = Number(this.datePipe.transform(this.policyEffectiveDate, 'yyyyMMdd'));
  //   const expirationDate = Number(this.datePipe.transform(this.policyExpirationDate, 'yyyyMMdd'));
  //   const errorMessages: string[] = [];

  //   if (effectiveDate >= expirationDate) {
  //     errorMessages.push('Expiration Date must be after the Effective Date');
  //   }
  //   if (thisForm.controls['riskZipCode'].valid && ZipCodeCountry(this.riskLocation.zip) != this.dropdowns.getCountryByState(this.riskLocation.state)) {
  //     errorMessages.push('Zip Code is invalid for ' + this.riskLocation.countryCode);
  //   }
  //   return errorMessages;
  // }

  setEndorsementFieldStatus(): boolean {
    if (this.endorsement.endorsementNumber > 0) {
      return true;
    } else {
      return false;
    }
  }


  checkDereg(): boolean{
    return this.dereg = this.deregulationIndicator == 'F'? true : false;
  }
  checkAssumed(): boolean{
    return this.assumed = this.riskType == 'A'? true : false;
  }
  ChangePolicyNumber() {
    this.formattedPolicyNo = this.policyNo + (this.formattedPolicyNo.charAt(this.formattedPolicyNo.length-3) == '-' ? this.formattedPolicyNo.slice(-3) : '');
  }
  changeEffectiveDate() {
    if (this.endorsement.endorsementNumber == 0) {
      this.endorsementChanged = true;
      this.endorsement.transactionEffectiveDate = this.policyEffectiveDate;
    }
  }
  changeExpirationDate() {
    if (this.endorsement.endorsementNumber == 0) {
      this.endorsementChanged = true;
      this.endorsement.transactionExpirationDate = this.policyExpirationDate;
    }
  }

  changePolicySymbol() {
    if (this.isPrimaryPolicy) {
      this.endorsementChanged = true;
      this.endorsement.attachmentPoint = 0;
      this.endorsement.underlyingLimit = 0;
    }
  }
  changeRetroDate() {
    this.quoteData.retroDate = this.retroDate;
  }
  private get isPrimaryPolicy(): boolean {
    return (this.policySymbol.trim().toUpperCase() == 'PL') || (this.policySymbol.trim().toUpperCase() == 'PRC');
  }

  clearNYFTZ() {
    this.nyftz = null;
  }
  clearAssumed() {
    this.assumedCarrier = null;
  }

  isExtensionDateActive(): boolean {
    if (this.lockEndorsementFields && this.endorsement.transactionTypeCode === TransactionTypes.PolicyExtensionByEndt) {
      return true;
    } else {
      return false;
    }
  }
  isRetroDateActive(): boolean {
    if (this.canSetRetroDate) {
      return true;
    } else {
      return false;
    }
  }

  isCancelDateActive(): boolean {
    if (this.lockEndorsementFields && this.isCancelEndorsement(this.endorsement.transactionTypeCode)) {
      return true;
    } else {
      return false;
    }
  }
  async determineClaimsMadeOccurrence(){
    const coverageCode = this.quoteData.coverageCode;
    let coverageDetermined = false;
    const coverageDescription = this.findCoverageCodeDescription(coverageCode);
    coverageDetermined = (this.isCoverageCodeClaimsMade(coverageDescription) || this.isCoverageCodeOccurrence(coverageDescription));
    if (!coverageDetermined) {
      this.canSetClaimsMadeOccurrence = true;
      this.quoteData.claimsMadeOrOccurrence = 'O';
    } else {
      this.canSetClaimsMadeOccurrence = false;
    }
  }
  isCoverageCodeClaimsMade(coverageDescription: string): boolean {
    if (coverageDescription.includes(' CLM')){
      this.canSetRetroDate = true;
      this.quoteData.claimsMadeOrOccurrence = 'C';
      return true;
    } else {
      this.canSetRetroDate = false;
      this.quoteData.retroDate = null;
      this.retroDate = null;
      return false;
    }
  }

  isCoverageCodeOccurrence(coverageDescription: string): boolean {
    if (coverageDescription.includes(' OCC') || coverageDescription.includes('Occurrence')){
      this.quoteData.claimsMadeOrOccurrence = 'O';
      this.quoteData.retroDate = null;
      this.retroDate = null;
      return true;
    } else {
      return false;
    }
  }
  changeClaimsMadeOccurrence() {
    this.quoteData.retroDate = null;
    this.retroDate = null;
    if (this.quoteData.claimsMadeOrOccurrence == 'C') {
      this.canSetRetroDate = true;
    } else {
      this.canSetRetroDate = false;
    }
  }
  findCoverageCodeDescription(coverageCode: string): string {
    return this.coverageCodesList.find(x => x.code == coverageCode)?.description || '';
  }


  isCancelEndorsement(transType: number):boolean {
    if (transType === TransactionTypes.FlatCancel || transType === TransactionTypes.CancellationOfPolicyExtension
      || transType === TransactionTypes.ProRataCancel || transType === TransactionTypes.ShortRateCancel) {
      return true;
    } else {
      return false;
    }
  }
}
