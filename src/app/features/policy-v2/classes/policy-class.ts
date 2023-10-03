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
import { PropertyBuildingCoverageSubjectAmountData } from '../../quote/models/property-building-coverage';
import { PropertyPolicyBuildingClass } from '../../quote/classes/property-policy-building-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { MortgageeClass } from 'src/app/shared/components/property-mortgagee/mortgagee-class';
import { PropertyPolicyBuildingCoverageClass } from '../../quote/classes/property-policy-building-coverage-class';
import { PolicyRateClass } from './policy-rate-class';
import { TabValidationClass } from 'src/app/shared/classes/tab-validation-class';
import { PolicyValidationTabNameEnum } from 'src/app/core/enums/policy-validation-tab-name-enum';
import { PolicyValidationClass } from './policy-validation-class';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { ErrorMessageSettings } from './base/child-base-class';


export class PolicyClass extends ParentBaseClass implements PolicyInformation {
  quoteData!: PolicyQuoteClass;
  riskLocation!: RiskLocationClass;
  additionalNamedInsuredData: PolicyANIClass[] = [];
  endorsementData!: EndorsementClass;
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
  rateEffectiveDate: Date | null = null;
  //_validateOnLoad = true;
  isNew = false;
  invalidList= '';
  additionalInterestList: AdditionalInterestClass[] = [];
  mortgageeList: MortgageeClass[] = [];
  readOnlyQuote = false;
  // private _rate: PolicyRateClass = new PolicyRateClass();

  // get rating() : PolicyRateClass {
  //   this._rate.premium = this.endorsementData.premium;
  //   this._rate.isFlatRate = true;
  //   this._rate.premiumRate = 100;
  //   return this._rate;
  // }
  // top level - property detail right
  // comes from the quote rates
  private _classCode! : number | null;
  private _riskDescription! : string | null;
  policyInfoValidation!: TabValidationClass;
  coveragesValidation!: TabValidationClass;
  mortgageeValidation!: TabValidationClass;
  premiumValidation!: TabValidationClass;
  reinsuranceValidation!: TabValidationClass;
  summaryValidation!: TabValidationClass;
  isPolicyInfoTabAccessible: any;
  isCoveragesTabAccessible: any;
  isMortgageeTabAccessible: any;
  isReinsuranceTabAccessible: any;
  isPremiumTabAccessible: any;
  isSummaryTabAccessible: any;

  get classCode() : number | null {
    return this._classCode;
  }
  set classCode(value: number | null) {
    this._classCode = value == 0 ? null : value;
    this.markDirty();
  }
  // building level
  private _cspCode! : Code;

  get cspCode() : Code {
    return this._cspCode;
  }
  set cspCode(value: Code) {
    this._cspCode = value;
    if(value == null){
      this.endorsementData.endorsementBuilding.map(x => x.cspCode = null);
    } else {
      this.endorsementData.endorsementBuilding.map(x => x.cspCode = String(value).toString().padStart(4,'0') + '  ');
    }
  }
  get riskDescription() : string | null {
    return this._riskDescription;
  }
  set riskDescription(value: string | null) {
    this._riskDescription = value;
    this.markDirty();
    // this._isDirty = true;
  }

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
    if (this.endorsementData.endorsementNumber == 0) {
      this.endorsementChanged = true;
      this.endorsementData.transactionEffectiveDate = this.policyEffectiveDate ;
    }
  }

  private _policyExpirationDate : Date = new Date() ;
  get policyExpirationDate() : Date {
    return this._policyExpirationDate;
  }
  set policyExpirationDate(value: Date ) {
    this._policyExpirationDate = value;
    this.markDirty();
    if (this.endorsementData.endorsementNumber == 0) {
      this.endorsementChanged = true;
      this.endorsementData.transactionExpirationDate = this.policyExpirationDate;
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
    if (this.isCancelEndorsement(this.endorsementData.transactionTypeCode)) {
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
    if (this.endorsementData.transactionTypeCode === TransactionTypes.PolicyExtensionByEndt) {
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
    this.readOnlyQuote = false;
    if (policy) {
      this.existingInit(policy);
    } else {
      this.newInit();
    }
    this.validateObject();
    this.tabValidationInit();
    this.fullTabValidation();
  }

  existingInit(policy: PolicyInformation) {
    console.log('existing init: ', policy);
    this.riskLocation = new RiskLocationClass(policy.riskLocation);
    this.quoteData = new PolicyQuoteClass(policy.quoteData);
    policy.additionalNamedInsuredData.forEach(x => {
      const y = new PolicyANIClass(x);
      this.additionalNamedInsuredData.push(y);
    });
    console.log(this.additionalNamedInsuredData);
    this.endorsementData = new EndorsementClass(policy.endorsementData);
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
    this.id = policy.policyId;
    this.policyId = policy.policyId;
    this.policySymbol = policy.policySymbol;
    this.formattedPolicyNo = policy.formattedPolicyNo;
    this.policyEventCode = policy.policyEventCode;
    this.programId = policy.programId;
    console.log(policy.commRate);
    this._commRate = policy.commRate;
    this.guid = policy.guid || crypto.randomUUID();
    this.isNew = false;
    this.rateEffectiveDate = this.policyEffectiveDate;
    this._classCode = policy.classCode;
    
    this._riskDescription = policy.riskDescription;
    this.calculateSubjectAmounts();
    this.calculateLargestPremTiv();
    this.calculateLawLimits();
    this.calculateLargestExposure();
    // this.setReadonlyFields();
    // this.setRequiredFields();
  }
  newInit() {
    this.policyId = 0;
    this.guid = crypto.randomUUID();
    this.isNew = true;
  }

  getTabErrors(tabAffinity: string): ErrorMessage[]{
    return this.errorMessagesList.filter(x => x.tabAffinity == tabAffinity);
  }


  tabValidationInit() {
    this.policyInfoValidation = new PolicyValidationClass(ValidationTypeEnum.Tab, PolicyValidationTabNameEnum.PolicyInfo);
    this.coveragesValidation = new PolicyValidationClass(ValidationTypeEnum.Tab, PolicyValidationTabNameEnum.PropertyLocationCoverages);
    this.mortgageeValidation = new PolicyValidationClass(ValidationTypeEnum.Tab, PolicyValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
    this.premiumValidation = new PolicyValidationClass(ValidationTypeEnum.Tab, PolicyValidationTabNameEnum.CoveragePremium);
    this.reinsuranceValidation = new PolicyValidationClass(ValidationTypeEnum.Tab, PolicyValidationTabNameEnum.Reinsurance);
    this.summaryValidation = new PolicyValidationClass(ValidationTypeEnum.Tab, PolicyValidationTabNameEnum.Summary);
  }

  fullTabValidation() {
    this.canBeSaved = true;
    this.validateTab(this.policyInfoValidation, ValidationTypeEnum.Tab);
    this.validateTab(this.coveragesValidation, ValidationTypeEnum.Tab);
    this.validateTab(this.mortgageeValidation, ValidationTypeEnum.Tab);
    this.validateTab(this.premiumValidation, ValidationTypeEnum.Tab);
    this.validateTab(this.reinsuranceValidation, ValidationTypeEnum.Reinsurance);
    this.validateTab(this.summaryValidation, ValidationTypeEnum.Tab);

    this.determineTabAccessiblity();
  }

  // isAccessible is a feature used in FOCUS and something i think we'll use
  // not currently used, but wanted to keep here so it doesn't get forgotten
  determineTabAccessiblity() {
    this.isPolicyInfoTabAccessible = true;
    this.isCoveragesTabAccessible = this.policyInfoValidation.isValid;
    this.isMortgageeTabAccessible = this.isCoveragesTabAccessible && this.coveragesValidation.isValid;
    this.isPremiumTabAccessible = this.isMortgageeTabAccessible && this.mortgageeValidation.isValid;
    this.isReinsuranceTabAccessible = this.isPremiumTabAccessible && this.premiumValidation.isValid;
    this.isSummaryTabAccessible = this.isReinsuranceTabAccessible && this.reinsuranceValidation.isValid;
  }

  validateTab(tabValidation: TabValidationClass, tabAffinity: ValidationTypeEnum) {
    tabValidation.resetValidation();
    tabValidation.errorMessagesList = this.errorMessagesList.filter(x => x.tabAffinity == tabAffinity);
    if (tabValidation.errorMessagesList.length > 0) {
      tabValidation.isValid = tabValidation.errorMessagesList.find(x => x.failValidation) ? false : true;
      tabValidation.canBeSaved = tabValidation.errorMessagesList.find(x => x.preventSave) ? false : true;
    } else {
      tabValidation.isValid = true;
      tabValidation.canBeSaved = true;
    }
  }

  addCoverage(building: PropertyPolicyBuildingClass) {
    building.endorsementBuildingCoverage.map(x => x.focus = false);
    const newCoverage = new PropertyPolicyBuildingCoverageClass();
    newCoverage.focus = true;
    newCoverage.subjectNumber = building.subjectNumber;
    newCoverage.premisesNumber = building.premisesNumber;
    newCoverage.buildingNumber = building.buildingNumber;
    newCoverage.isNew = true;
    newCoverage.endorsementBuildingId = building.endorsementBuildingId ?? 0;
    newCoverage.guid = crypto.randomUUID();
    building.endorsementBuildingCoverage.push(newCoverage);
    this.markDirty();
    //this.filterCoverages();
    this.calculateSubjectAmounts();
    this.calculateLargestPremTiv();
    this.calculateLargestExposure();
    this.calculateLawLimits();
    return newCoverage;

  }
  validateObject(): ErrorMessage[]{
    this.resetErrorMessages();
    //on load or if dirty validate this
    console.log('isdirty ', this.isDirty);
    this.errorMessagesList = this.validateChildren(this);
    if (this.isDirty){
      //TODO: class based validation checks
      this.validateClass();
    }
    console.log('errorMessages: ',this.errorMessagesList);
    return this.errorMessagesList;
  }

  validateClass(): void{
    const settings: ErrorMessageSettings = {preventSave: true, tabAffinity: ValidationTypeEnum.PolicyInfo, failValidation: true};
    if(this.commRate == 0){
      this.createErrorMessage('Comm Rate is required', settings);
    }
    const datePipe = new DatePipe('en-US');
    const effectiveDate = Number(datePipe.transform(this.policyEffectiveDate, 'yyyyMMdd'));
    const expirationDate = Number(datePipe.transform(this.policyExpirationDate, 'yyyyMMdd'));
    //const validZip = ZipCodeCountry(this.riskLocation.zip) == this.dropdowns.getCountryByState(this.riskLocation.state);

    if (effectiveDate >= expirationDate) {
      this.createErrorMessage('Expiration Date must be after the Effective Date', settings);
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
  private _subjectAmounts: Map<any,any> = new Map();

  get subjectAmounts(): Map<any,any> {
    return this._subjectAmounts;
  }
  set subjectAmounts(value: Map<any,any>) {
    this._subjectAmounts = value;
  }

  private _largestPremTiv = 0;

  get largestPremTiv():number {
    return this._largestPremTiv;
  }
  set largestPremTiv(value:number) {
    this._largestPremTiv = value;
  }

  private _largestExposure = 0;

  get largestExposure():number {
    return this._largestExposure;
  }
  set largestExposure(value:number) {
    this._largestExposure = value;
  }

  private _lawLimits = 0;

  get lawLimits():number {
    return this._lawLimits;
  }
  set lawLimits(value:number) {
    this._lawLimits = value;
  }

  calculateSubjectAmounts() {
    const subjectAmounts: PropertyBuildingCoverageSubjectAmountData[] = [];
    console.log(this);
    this.endorsementData.endorsementBuilding.map((element) => {
      element.endorsementBuildingCoverage.map((x) => {
        const subAm: PropertyBuildingCoverageSubjectAmountData = {} as PropertyBuildingCoverageSubjectAmountData;
        subAm.subject = Number(element.subjectNumber);
        subAm.limit = x.limit;
        subjectAmounts.push(subAm);
      });
    });
    const res = subjectAmounts.reduce((a, b) =>
      a.set(b.subject, (a.get(b.subject) || 0) + Number(b.limit)), new Map);

    const sortedList = new Map([...res].sort((a, b) => b[1] - a[1]));

    this._subjectAmounts = sortedList;
  }

  get buildingCount(): number {
    return this.endorsementData.endorsementBuilding.filter(x=> !x.markForDeletion).length ?? 0;
  }

  addAdditionalInterest(ai: AdditionalInterestClass){
    ai.markDirty();
    this.markDirty();
    ai.isNew = true;
    this.endorsementData.endorsementAdditionalInterest.push(ai);
    // this.endorsementData.markDirty();
  }

  deleteAI(ai: AdditionalInterestClass){
    console.log('AI POLICY CLASS ' + ai);
    const index = this.additionalInterestList.indexOf(ai, 0);
    console.log('index ' + index);
    if(index > -1){
      this.markDirty();
      ai.markForDeletion = true;
      this.endorsementData.endorsementAdditionalInterest[index].markForDeletion = true;
    }
  }

  addMortgagee(mortgagee: MortgageeClass){
    mortgagee.markDirty();
    this.markDirty();
    mortgagee.isNew = true;
    mortgagee.mortgageeType = 1;
    this.endorsementData.endorsementMortgagee.push(mortgagee);
    this.endorsementData.markDirty();
  }

  addBuilding(building: PropertyPolicyBuildingClass) {
    building.focus = true;
    building.markDirty();
    building.isExpanded = true;
    building.isNew = true;
    this.endorsementData.endorsementBuilding.push(building);
    //this.filterBuildings();
    this.calculateSubjectAmounts();
    this.calculateLargestPremTiv();
    this.calculateLawLimits();
    this.calculateLargestExposure();
  }

  deleteBuilding(building: PropertyPolicyBuildingClass) {
    console.log('BUILDING POLICY CLASS' + building);
    const index = this.endorsementData.endorsementBuilding.indexOf(building, 0);
    this.endorsementData.endorsementBuilding[index].markForDeletion = true;
    console.log('index' + index);
    if (index > -1) {
      // Mark dirty to force form rules check
      this.markDirty();
    }
    if (building.endorsementBuildingCoverage.length > 0) {
      this.calculateSubjectAmounts();
      this.calculateLargestPremTiv();
      this.calculateLawLimits();
      this.calculateLargestExposure();
    }
  }

  get limitTotal(): number {
    let total = 0;
    this.endorsementData.endorsementBuilding.map((c) =>
      c.endorsementBuildingCoverage.map((coverage) => (total += coverage.limit ?? 0))
    );
    return total;
  }
  clearCspCodes() {
    this.endorsementData.endorsementBuilding.forEach(x => x.cspCode == null);
  }
  get totalPremium(): number{
    let optionalPremTotal = 0;
    let ratesTotal = 0;

    // this.propertyQuoteBuildingOptionalCoverage.map((x) => (optionalPremTotal += x.additionalPremium ?? 0));
    // this.policyRateClass.map((x) =>(ratesTotal += x.premium ?? 0));
    ratesTotal = this.endorsementData.premium ?? 0;
    return Number(optionalPremTotal) + Number(ratesTotal);
  }
  calculateLargestPremTiv(){
    let largest = 0;
    this.endorsementData.endorsementBuilding.map(x => {
      if (x.endorsementBuildingCoverage.length == 0){
        this._largestPremTiv = 0;
      } else{

        const premAmounts: PropertyBuildingCoverageSubjectAmountData[] = [];

        this.endorsementData.endorsementBuilding.map((element) => {
          element.endorsementBuildingCoverage.map((x) => {
            const subAm: PropertyBuildingCoverageSubjectAmountData = {} as PropertyBuildingCoverageSubjectAmountData;
            subAm.subject = element.premisesNumber;
            subAm.limit = x.limit;
            premAmounts.push(subAm);
          });
        });
        const res = premAmounts.reduce((a, b) =>
          a.set(b.subject, (a.get(b.subject) || 0) + Number(b.limit)), new Map);

        largest = Math.max(...res.values());
        this._largestPremTiv = largest;
      }
    });
    this._largestPremTiv = largest;
  }

  calculateLawLimits(){
    this._lawLimits = 0;
    // this.propertyBuildingOptionalCoverage.map((x) =>{
    //   if(x.coverageCode == 2 || x.coverageCode == 3 || x.coverageCode == 4 || x.coverageCode == 5)
    //   {
    //     this._lawLimits += x.limit ?? 0;
    //   }
    // });
  }

  calculateLargestExposure(){
    const lawLimit = this.lawLimits;
    const largestPremTiv = this.largestPremTiv;
    const exposure = lawLimit + largestPremTiv;
    this._largestExposure = exposure;
  }

  get coverageCount(): number {
    let total = 0;
    this.endorsementData.endorsementBuilding.map((c) => total += c.endorsementBuildingCoverage.length ?? 0
    );
    return total;
  }


  setEndorsementFieldStatus(): boolean {
    if (this.endorsementData.endorsementNumber > 0) {
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
    console.log('line674 ', this.commRate)
    return{
      policyId: this.policyId,
      policyEffectiveDate: this.policyEffectiveDate,
      quoteData: this.quoteData,
      riskLocation: this.riskLocation,
      endorsementData: this.endorsementData.toJson(),
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
      classCode: this.classCode,
      guid: this.guid,
      riskDescription: this.riskDescription
    };
  }
}
