import { ParentBaseClass } from './base/parent-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { PolicyInformation } from '../../policy/models/policy';
import { TransactionTypes } from 'src/app/core/constants/transaction-types';
import { Code } from 'src/app/core/models/code';
import { Producer } from '../../submission/models/producer';
import { AdditionalNamedInsuredData, PolicyANIClass } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { RiskLocationClass } from './risk-location';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
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
  }

  private _deregulationIndicator = '';
  get deregulationIndicator() : string {
    return this._deregulationIndicator;
  }
  set deregulationIndicator(value: string) {
    this._deregulationIndicator = value;
    this.dereg;
  }

  private _assumed = false;
  get assumed() : boolean {
    this._assumed = this.riskType == 'A'? true : false;
    return this._assumed;
  }
  set assumed(value:boolean) {
    this._assumed = value;
    this.assumed;
  }

  private _assumedCarrier : string | null = null;
  get assumedCarrier() : string | null{
    return this._assumedCarrier;
  }
  set assumedCarrier(value: string | null) {
    this._assumedCarrier = value;
    this.assumedCarrier;
  }

  private _policyEffectiveDate : Date = new Date();
  get policyEffectiveDate() : Date {
    return this._policyEffectiveDate;
  }
  set policyEffectiveDate(value: Date) {
    this._policyEffectiveDate = value;
    this.markDirty();
    if (this.endorsement.endorsementNumber == 0) {
      this.endorsementChanged = true;
      this.endorsement.transactionEffectiveDate = this.policyEffectiveDate ;
    }
  }

  private _policyExpirationDate : Date = new Date() ;
  get policyExpirationDate() : Date {
    return this._policyExpirationDate;
  }
  set policyExpirationDate(value: Date ) {
    this._policyExpirationDate = value;
    this.markDirty();
    if (this.endorsement.endorsementNumber == 0) {
      this.endorsementChanged = true;
      this.endorsement.transactionExpirationDate = this.policyExpirationDate;
    }
  }

  private _retroDate : Date | null = null;
  get retroDate() : Date | null {
    return this._retroDate;
  }
  set retroDate(value: Date | null) {
    this._retroDate = value;
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

  constructor(policy?: PolicyInformation ) {
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
    console.log(this.additionalNamedInsuredData);
    this.endorsement = new EndorsementClass(policy.endorsement);
    this.insured = new InsuredClass(policy.insured);
    //TODO: create producer class
    this.producer = policy.producer;
    this.packageInd = policy.packageInd;
    this.policyType = policy.policyType;
    this.policyNo = policy.policyNo;
    this.policyModNo = policy.policyModNo;
    this.fullPolicyNo = policy.fullPolicyNo;
    this.enteredDate = new Date();
    this._policyEffectiveDate = policy.policyEffectiveDate;
    this._policyExpirationDate = policy.policyExpirationDate;
    this._policyExtendedExpDate = policy.policyExtendedExpDate;
    this._policyCancelDate = policy.policyCancelDate;
    this._retroDate = policy.retroDate;
    this.programName = policy.programName;
    this.riskGradeCode = policy.riskGradeCode;
    this.auditCode = policy.auditCode;
    this.paymentFrequency = policy.paymentFrequency;
    this._deregulationIndicator = policy.deregulationIndicator;
    this.nyftz = policy.nyftz;
    this.riskType = policy.riskType;
    this._assumedCarrier = policy.assumedCarrier;
    this.coinsurancePercentage = policy.coinsurancePercentage;
    this.productManufactureDate = policy.productManufactureDate;
    this.submissionNumber = policy.submissionNumber;
    this.departmentId = policy.departmentId;
    this.policyId = policy.policyId;
    this.policySymbol = policy.policySymbol;
    this.formattedPolicyNo = policy.formattedPolicyNo;
    this.policyEventCode = policy.policyEventCode;
    this.programId = policy.programId;
    console.log(policy.commRate);
    this._commRate = policy.commRate;
    this.guid = policy.guid || crypto.randomUUID();
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
    //on load or if dirty validate this
    if (this.isDirty){
      //TODO: class based validation checks
      this.validateClass();
    }
    this.errorMessages = this.validateChildren(this);

    return this.errorMessages;
  }

  validateClass(): void{
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
    this.isNew = false;
    return;
  }
  onGuidUpdateMatch(T: ParentBaseClass){
    this.hasUpdate = false;
    return;
  }
  onChildDeletion(child: Deletable): void {
    console.log('delete child');
    if(child instanceof PolicyANIClass){
      this.deleteAddNamedInsured(child);
    }
  }
  deleteAddNamedInsured(child: PolicyANIClass) {
    const location = this.additionalNamedInsuredData.find((c) => c.id == child.id);
    if(location) {
      const index = this.additionalNamedInsuredData.indexOf(location);
      this.additionalNamedInsuredData.splice(index, 1);
    }
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

  toJSON(): PolicyInformation{
    const ai: AdditionalNamedInsuredData [] = [];
    this.additionalNamedInsuredData.forEach(c => ai.push(c.toJSON()));
    return{
      policyId: this.policyId,
      policyEffectiveDate: this.policyEffectiveDate,
      quoteData: this.quoteData,
      riskLocation: this.riskLocation,
      endorsement: this.endorsement,
      additionalNamedInsuredData: ai,
      insured: this.insured,
      producer: this.producer,
      commRate: this.commRate,
      departmentId: this.departmentId,
      policyEventCode: this.policyEventCode,
      endorsementNumber: this.endorsementNumber,
      packageInd: this.packageInd,
      policyModNo: this.policyModNo,
      policyType: this.policyType,
      policySymbol: this.policySymbol,
      policyNo: this.policyNo,
      fullPolicyNo: this.fullPolicyNo,
      formattedPolicyNo: this.formattedPolicyNo,
      enteredDate: this.enteredDate,
      policyInsuredState: this.policyInsuredState,
      policyExpirationDate: this.policyExpirationDate,
      policyExtendedExpDate: this.policyExtendedExpDate,
      policyCancelDate: this.policyCancelDate,
      retroDate: this.retroDate,
      programId: this.programId,
      programName: this.programName,
      riskGradeCode: this.riskGradeCode,
      auditCode: this.auditCode,
      paymentFrequency: this.paymentFrequency,
      deregulationIndicator: this.deregulationIndicator,
      nyftz: this.nyftz,
      riskType: this.riskType,
      assumedCarrier: this.assumedCarrier,
      coinsurancePercentage: this.coinsurancePercentage,
      productManufactureDate: this.productManufactureDate,
      submissionNumber: this.submissionNumber,
      guid: this.guid
    };
  }
}
