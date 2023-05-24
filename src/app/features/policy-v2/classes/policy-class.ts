import { ParentBaseClass } from './base/parent-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { PolicyInformation } from '../../policy/models/policy';
import { TransactionTypes } from 'src/app/core/constants/transaction-types';
import { Code } from 'src/app/core/models/code';
import { Producer } from '../../submission/models/producer';
import { AdditionalNamedInsured, AdditionalNamedInsuredData, PolicyANIClass, coverageANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { RiskLocationClass } from './risk-location';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { PolicyService } from '../../policy/services/policy/policy.service';
import { PolicyQuoteClass } from './policy-quote-class';
import { DatePipe } from '@angular/common';
import { EndorsementClass } from './endorsement-class';
import { InsuredClass } from '../../insured/classes/insured-class';


export class PolicyClass extends ParentBaseClass implements PolicyInformation {
  quoteData!: PolicyQuoteClass;
  riskLocation!: RiskLocationClass;
  additionalNamedInsuredData: PolicyANIClass[] = [];
  endorsement!: EndorsementClass;
  insured!: InsuredClass;
  //TODO: Make Producer Class
  producer!: Producer;
  policyEventCode!: string;
  packageInd!: string;
  policyType!: string | null;
  policyNo!: string;
  policyModNo!: string;
  fullPolicyNo!: string;
  enteredDate!: Date;
  policyInsuredState!: string;
  programName!: string;
  riskGradeCode!: string;
  auditCode!: string;
  paymentFrequency!: string;
  nyftz!: string | null;
  riskType!: string;
  coinsurancePercentage!: number;
  productManufactureDate!: Date;
  submissionNumber!: number;
  departmentId!: number;
  policyId!: number;
  endorsementNumber!: number;
  policySymbol!: string;
  formattedPolicyNo!: string;
  programId!: number;
  endorsementChanged = false;
  canSetRetroDate = false;
  canSetExtensionDate = false;
  canSetCancelDate = false;
  canSetClaimsMadeOccurrence = false;
  coverageCodesList: Code[] = [];
  //_validateOnLoad = true;
  isNew = false;
  invalidList= '';

  private _commRate : number | null = null;
  get commRate() : number | null {
    return this._commRate;
  }
  set commRate(value: number | null) {
    this._commRate = value;
    this.markDirty();
  }

  private _dereg = false;
  get dereg() : boolean {
    this._dereg = this.deregulationIndicator == 'F'? true : false;
    return this._dereg;
  }
  set dereg(value:boolean) {
    this._dereg = value;
    this.markDirty();
  }

  private _deregulationIndicator = '';
  get deregulationIndicator() : string {
    return this._deregulationIndicator;
  }
  set deregulationIndicator(value: string) {
    console.log(value);
    this._deregulationIndicator = value;
    this.dereg;
    this.markDirty();
  }

  private _assumed = false;
  get assumed() : boolean {
    this._assumed = this.riskType == 'A'? true : false;
    return this._assumed;
  }
  set assumed(value:boolean) {
    this._assumed = value;
    this.assumed;
    this.markDirty();
  }

  private _assumedCarrier : string | null = null;
  get assumedCarrier() : string | null{
    return this._assumedCarrier;
  }
  set assumedCarrier(value: string | null) {
    console.log(value);
    this._assumedCarrier = value;
    this.assumedCarrier;
    this.markDirty();
  }

  private _state : string | null = null;
  get state() : string | null{
    return this._state;
  }
  set state(value: string | null) {
    this._state = value;
    this.markDirty();
  }

  private _policyEffectiveDate : Date = new Date();
  get policyEffectiveDate() : Date {
    return this._policyEffectiveDate;
  }
  set policyEffectiveDate(value: Date) {
    this._policyEffectiveDate = value;
    if (this.endorsement.endorsementNumber == 0) {
      this.endorsementChanged = true;
      this.endorsement.transactionEffectiveDate = this.policyEffectiveDate ;
    }
    this.markDirty();
  }

  private _policyExpirationDate : Date = new Date() ;
  get policyExpirationDate() : Date {
    return this._policyExpirationDate;
  }
  set policyExpirationDate(value: Date ) {
    this._policyExpirationDate = value;
    if (this.endorsement.endorsementNumber == 0) {
      this.endorsementChanged = true;
      this.endorsement.transactionExpirationDate = this.policyExpirationDate;
    }
    this.markDirty();
  }

  private _retroDate : Date | null = null;
  get retroDate() : Date | null {
    return this._retroDate;
  }
  set retroDate(value: Date | null) {
    this._retroDate = value;
    this.markDirty();
  }

  private _policyCancelDate : Date | null = null;
  get policyCancelDate() : Date | null {
    if (this.isCancelEndorsement(this.endorsement.transactionTypeCode)) {
      this.canSetCancelDate = true;
    } else {
      this.canSetCancelDate = false;
    }
    return this._policyCancelDate;
  }
  set policyCancelDate(value: Date | null) {
    this._policyCancelDate = value;
    this.markDirty();
  }

  private _policyExtendedExpDate : Date | null = null;
  get policyExtendedExpDate() : Date | null {
    if (this.endorsement.transactionTypeCode === TransactionTypes.PolicyExtensionByEndt) {
      this.canSetExtensionDate = true;
    } else {
      this.canSetExtensionDate = false;
    }
    return this._policyExtendedExpDate;
  }
  set policyExtendedExpDate(value: Date | null) {
    this._policyExtendedExpDate = value;
    this.markDirty();
  }

  constructor(private policyService: PolicyService,policy?: PolicyInformation, ) {
    super();
    if (policy) {
      this.existingInit(policy);
    } else {
      this.newInit();
    }
    //this.setWarnings();
  }
  existingInit(policy: PolicyInformation) {
    this.riskLocation = new RiskLocationClass(policy.riskLocation);
    this.quoteData = new PolicyQuoteClass(policy.quoteData);
    policy.additionalNamedInsuredData.forEach(x => {
      const y = new PolicyANIClass(x);
      this.additionalNamedInsuredData.push(y);
    });
    this.endorsement = new EndorsementClass(policy.endorsement);
    this.insured = new InsuredClass(policy.insured);
    //TODO: create producer class
    this.producer = policy.producer;
    this.policyEventCode = 'B';
    this.packageInd = policy.packageInd;
    this.policyType = policy.policyType;
    this.policyNo = policy.policyNo;
    this.policyModNo = policy.policyModNo;
    this.fullPolicyNo = policy.fullPolicyNo;
    this.enteredDate = new Date();
    this.policyInsuredState = policy.policyInsuredState;
    this.policyEffectiveDate = policy.policyEffectiveDate;
    this.policyExpirationDate = policy.policyExpirationDate;
    this.policyExtendedExpDate = policy.policyExtendedExpDate;
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
    this.commRate = policy.commRate;
    this.guid = crypto.randomUUID();
    this.isNew = false;
    this.markedForDeletion = false;
    // this.setReadonlyFields();
    // this.setRequiredFields();
  }
  newInit() {
    this.policyId = 0;
    this.guid = crypto.randomUUID();
    this.isNew = true;
    this.markedForDeletion = false;
  }
  validate(): ErrorMessage[]{
    console.log('validate  policy');
    //on load or if dirty validate this
    console.log('THIS ' + this.isDirty);
    if (this.isDirty){
      //TODO: class based validation checks
      this.canBeSaved = true;
      this.errorMessages = this.validateChildren(this);

      this.validateClass();
    }
    return this.errorMessages;
  }

  validateClass(): void{
    console.log('comrate' + this.commRate);
    if(this.commRate == 0){
      this.createErrorMessage('Comm Rate is required');
    }
    const datePipe = new DatePipe('en-US');
    const effectiveDate = Number(datePipe.transform(this.policyEffectiveDate, 'yyyyMMdd'));
    const expirationDate = Number(datePipe.transform(this.policyExpirationDate, 'yyyyMMdd'));
    //const validZip = ZipCodeCountry(this.riskLocation.zip) == this.dropdowns.getCountryByState(this.riskLocation.state);

    if (effectiveDate >= expirationDate) {
      this.createErrorMessage('Expiration Date must be after the Effective Date');
    }
    // if (!validZip && ZipCodeCountry(this.riskLocation.zip) != this.dropdowns.getCountryByState(this.riskLocation.state)) {
    //   this.createErrorMessage('Zip Code is invalid for ' + this.riskLocation.countryCode);
    // }
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

  setEndorsementFieldStatus(): boolean {
    if (this.endorsement.endorsementNumber > 0) {
      return true;
    } else {
      return false;
    }
  }

  ChangePolicyNumber() {
    this.formattedPolicyNo = this.policyNo + (this.formattedPolicyNo.charAt(this.formattedPolicyNo.length-3) == '-' ? this.formattedPolicyNo.slice(-3) : '');
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
