import * as moment from 'moment';
import { PolicyTermEnum } from 'src/app/core/enums/policy-term-enum';
import { SubmissionStatusDescEnum } from 'src/app/core/enums/submission-status-desc-enum';
import { SubmissionStatusEnum } from 'src/app/core/enums/submission-status-enum';
import { Insured } from '../../insured/models/insured';
import { Producer } from '../models/producer';
import { Submission } from '../models/submission';
import { SubmissionEvent } from '../models/submission-event';
import { ProducerContactClass } from './ProducerContactClass';

export class SubmissionClass implements Submission {
  private _producerCode: number | null = null;
  private _producerContact: number | null = null;
  private _departmentCode: number | null = null;
  private _underwriter: number | null = null;
  private _sicCode: string | null = null;
  private _naicsCode: string | null = null;
  private _polEffDate: Date | null = null;
  private _polExpDate: Date | null = null;
  private _quoteDueDate: Date | null = null;
  private _newRenewalFlag = 1;
  private _expiringPolicyId: number | null = null;
  private _extExpiringPolicyNo: string | null = null;
  private _renewablePolicy: boolean | number = true;
  private _policyTerm: PolicyTermEnum | number | null = PolicyTermEnum.annual;

  //Hold on to objects we use to build class to reinitialize if need be
  private _submission: Submission | undefined;
  private _insured: Insured | undefined;

  private _isDirty = false;
  private _initializerIsStale = false;

  private _effectiveDatePastWarningRange = 89;
  private _effectiveDateFutureWarningRange = -180;
  private _showErrors = false;

  producerCodeRequiredStatus = SubmissionStatusEnum.Live;
  producerContactRequiredStatus = SubmissionStatusEnum.Live;
  departmentCodeRequiredStatus = SubmissionStatusEnum.Live;
  underwriterRequiredStatus = SubmissionStatusEnum.Live;
  policyDateRequiredStatus = SubmissionStatusEnum.Live;
  // quoteDueDateRequiredStatus = SubmissionStatusEnum.Bound;
  // sicCodeRequiredStatus = SubmissionStatusEnum.Bound;
  // naicsCodeRequiredStatus = SubmissionStatusEnum.Bound;

  // producerCodeLockStatus = SubmissionStatusEnum.Bound;
  // producerContactLockStatus = SubmissionStatusEnum.Bound;
  departmentCodeLockStatus = SubmissionStatusEnum.InQuote;
  // underwriterLockStatus = SubmissionStatusEnum.Bound;
  // sicCodeLockStatus = SubmissionStatusEnum.Bound;
  // naicsCodeLockStatus = SubmissionStatusEnum.Bound;
  // policyDateLockStatus = SubmissionStatusEnum.Bound;
  // quoteDueDateLockStatus = SubmissionStatusEnum.Bound;
  // newRenewalFlagLockStatus = SubmissionStatusEnum.Bound;
  // expiringPolicyLockStatus = SubmissionStatusEnum.Bound;
  // extExpiringPolicyLockStatus = SubmissionStatusEnum.Bound;
  // renewablePolicyLockStatus = SubmissionStatusEnum.Bound;

  producerRequired = false;
  producerContactRequired = false;
  departmentRequired = false;
  underwriterRequired = false;
  sicCodeRequired = false;
  naicsRequired = false;
  policyDateRequired = false;
  quoteDueDateRequired = false;

  producerReadonly = false;
  producerContactReadonly = false;
  departmentReadonly = false;
  underwriterReadonly = false;
  sicCodeReadonly = false;
  naicsReadonly = false;
  policyDateReadonly = false;
  quoteDueDateReadonly = false;
  newRenewalFlagReadonly = false;
  expiringPolicyReadonly = false;
  extExpiringPolicyReadonly = false;
  renewablePolicyReadonly = false;

  submissionNumber = 0;
  companyCode: number | null = null;
  regionCode: number | null = null;
  officeCode: number | null = null;
  insuredCode: number | null = null;
  brokerId: number | null = null;
  retailProducerCode: number | null = null;
  statusCode = 0;
  reasonCode = 0;
  comments: string | null = null;
  applyToDate: Date | null = null;
  createdBy: number | null = null;
  createdDate: Date | null = null;
  modifiedBy: number | null = null;
  modifiedDate: Date | null = null;
  groupId: number | null = null;
  eventCode: number | null = null;
  eventDate: Date | null = null;
  programId: number | null = null;
  contractorCode: number | null = null;
  xrefSubNum: number | null = null;
  cancelDate: Date | null = null;
  assistantBroker: number | null = null;
  producerContactName: string | null = null;
  producerContactEmail: string | null = null;
  teamId: number | null = null;
  uwBranchCode = '';
  businessUnit = '';
  submissionGroupId: number | null = null;
  businessType = '';
  lobCode: string | null = null;
  constructionWrapup: number | null = null;
  processor: number | null = null;
  submissionEventCode = '';
  insured: Insured | null = null;
  producer: Producer | null = null;
  producerContact: ProducerContactClass | null = null;
  submissionEvents: SubmissionEvent[] = [];
  underwriterName: string | null = null;
  statusCodeDesc: string | null = null;
  invalidList: string[] = [];
  warningsList: string[] = [];
  warningsMessage = '';
  hasPostedInvoice = false;

  constructor(sub?: Submission, insured?: Insured){
    this._submission = sub;
    this._insured = insured;
    this.init(sub, insured);
  }
  init(sub?: Submission, insured?: Insured){
    this._departmentCode = sub?.departmentCode || null;
    this._producerCode = sub?.producerCode || null;
    this._producerContact = sub?.producerContactId || null;
    this._sicCode = sub?.sicCode || insured?.sicCode || null;
    this._naicsCode = sub?.naicsCode || insured?.naicsCode || null;
    this._underwriter = sub?.underwriter || null;
    this.regionCode = sub?.regionCode || 3;
    this.officeCode = sub?.officeCode || 9;
    this.insuredCode = sub?.insuredCode || insured?.insuredCode || null;
    this.brokerId = sub?.brokerId || null;
    this.retailProducerCode = sub?.retailProducerCode || null;
    this._polEffDate = sub?.polEffDate || null;
    this._polExpDate = sub?.polExpDate || null;
    this._quoteDueDate = sub?.quoteDueDate || null;
    this._expiringPolicyId = sub?.expiringPolicyId || null;
    this._newRenewalFlag = sub?.newRenewalFlag || 1;
    this.statusCode = sub?.statusCode || 0;
    this.reasonCode = sub?.reasonCode || 0;
    this.comments = sub?.comments || null;
    this.applyToDate = sub?.applyToDate || null;
    this.createdBy = sub?.createdBy || null;
    this.createdDate = sub?.createdDate || null;
    this.modifiedBy = sub?.modifiedBy || null;
    this.modifiedDate = sub?.modifiedDate || null;
    this.groupId = sub?.groupId || null;
    this.eventCode = sub?.eventCode || null;
    this.eventDate = sub?.eventDate || null;
    this.programId = sub?.programId || 0;
    this.contractorCode = sub?.contractorCode || null;
    this._renewablePolicy = sub?.renewablePolicy === 0 ? false : true;
    this.xrefSubNum = sub?.xrefSubNum || null;
    this.cancelDate = sub?.cancelDate || null;
    this.assistantBroker = sub?.assistantBroker || null;
    this.producerContactName = sub?.producerContactName || null;
    this.producerContactEmail = sub?.producerContactEmail || null;
    this.teamId = sub?.teamId || null;
    this.uwBranchCode = sub?.uwBranchCode || '';
    this.businessUnit = sub?.businessUnit || '';
    this.submissionGroupId = sub?.submissionGroupId || null;
    this.submissionNumber = sub?.submissionNumber || 0;
    this.companyCode = sub?.companyCode || 3;
    this.underwriterName = sub?.underwriterName || null;
    this.submissionEvents = sub?.submissionEvents || [];
    this.producerContact = sub?.producerContact ? new ProducerContactClass(sub?.producerContact) : null;
    this.producer = sub?.producer || null;
    this.insured = sub?.insured || insured || null;
    this._extExpiringPolicyNo = sub?.extExpiringPolicyNo || null;
    this.submissionEventCode = sub?.submissionEventCode || '';
    this.processor = sub?.processor || null;
    this.constructionWrapup = sub?.constructionWrapup || null;
    this.lobCode = sub?.lobCode || null;
    this.businessType = sub?.businessType || '';
    this._policyTerm = sub?.policyTerm ? sub?.policyTerm : insured ? PolicyTermEnum.annual : PolicyTermEnum.custom;
    this.hasPostedInvoice = sub?.hasPostedInvoice || false;
    this.setStatusDesc();
    this.setReadonlyFields();
    this.setRequiredFields();
    this.setWarnings();
  }
  get departmentCode() : number | null {
    return this._departmentCode;
  }
  set departmentCode(code: number | null) {
    this._departmentCode = code;
    this.producer = null;
    this.producerContact = null;
    this._producerCode = null;
    this._producerContact = null;
    this._isDirty = true;
  }
  get extExpiringPolicyNo() : string | null {
    return this._extExpiringPolicyNo;
  }
  set extExpiringPolicyNo(policyNo: string | null) {
    this._extExpiringPolicyNo = policyNo;
    this._isDirty = true;
  }
  get expiringPolicyId() : number | null {
    return this._expiringPolicyId;
  }
  set expiringPolicyId(id: number | null) {
    this._expiringPolicyId = id;
    this._isDirty = true;
  }
  get polEffDate() : Date | null {
    return this._polEffDate;
  }
  set polEffDate(date: Date | null) {
    this._polEffDate = date;
    this.applyPolicyTerm();
    this.setWarnings();
    this._isDirty = true;
  }
  get polExpDate() : Date | null {
    return this._polExpDate;
  }
  set polExpDate(date: Date | null) {
    this._polExpDate = date;
    this._policyTerm = PolicyTermEnum.custom;
    this.setWarnings();
    this._isDirty = true;
  }
  get quoteDueDate() : Date | null {
    return this._quoteDueDate;
  }
  set quoteDueDate(date: Date | null) {
    this._quoteDueDate = date;
    this._isDirty = true;
  }
  get policyTerm() : PolicyTermEnum | number | null {
    return this._policyTerm;
  }
  set policyTerm(term: PolicyTermEnum | number | null) {
    this._policyTerm = term;
    if (term !== PolicyTermEnum.custom) {
      this.applyPolicyTerm();
    }
    this.setWarnings();
    this._isDirty = true;
  }
  get producerCode() : number | null {
    return this._producerCode;
  }
  set producerCode(code: number | null) {
    this._producerCode = code;
    this._isDirty = true;
  }
  get producerContactId() : number | null {
    return this._producerContact;
  }
  set producerContactId(code: number | null) {
    this._producerContact = code;
    this._isDirty = true;
  }
  get renewablePolicy() : boolean | number {
    return this._renewablePolicy;
  }
  set renewablePolicy(bool: boolean | number) {
    this._renewablePolicy = bool;
    this._isDirty = true;
  }
  get sicCode() : string | null {
    return this._sicCode;
  }
  set sicCode(code: string | null) {
    this._sicCode = code;
    this._isDirty = true;
  }
  get naicsCode(): string | null {
    return this._naicsCode;
  }
  set naicsCode(code: string | null) {
    this._naicsCode = code;
    this._isDirty = true;
  }
  get newRenewalFlag(): number {
    return this._newRenewalFlag;
  }
  set newRenewalFlag(code: number){
    this._newRenewalFlag = code;
    this._isDirty = true;
  }
  get underwriter() : number | null {
    return this._underwriter;
  }
  set underwriter(code: number | null) {
    this._underwriter = code;
    this._isDirty = true;
  }
  get initializerIsStale() : boolean {
    return this._initializerIsStale;
  }
  set initializerIsStale(bool: boolean) {
    this._initializerIsStale = bool;
  }
  get isDirty() : boolean {
    return this._isDirty;
  }
  get isValid(): boolean {
    let valid = true;
    const invalidList = [];
    if (this.insuredCode == null) {
      valid = false;
      invalidList.push('No insured attached to submission');
    }
    switch (this.statusCode) {
    case SubmissionStatusEnum.Dead:
      valid = false;
      break;
    case SubmissionStatusEnum.Bound:
      valid = this.validateBound(valid);
      break;
    case SubmissionStatusEnum.InQuote:
      valid = this.validateQuoted(valid);
      break;
    default:
      valid = this.validateNew(valid);
      break;
    }

    return valid;
  }
  get showErrors(): boolean {
    return this._showErrors && this.invalidList.length > 0;
  }
  applyPolicyTerm(){
    if (this._policyTerm != PolicyTermEnum.custom) {
      this._polExpDate = moment(this._polEffDate).add(this._policyTerm, 'M').toDate();
    }
  }
  markClean() {
    this._isDirty = false;
    this._showErrors = false;
  }
  markDirty() {
    this._isDirty = true;
  }
  showErrorMessage() {
    this._showErrors = true;
  }
  hideErrorMessage() {
    this._showErrors = false;
  }
  private isFieldReadonly(statusLock?: SubmissionStatusEnum) {
    return (this.hasPostedInvoice || this.statusCode === SubmissionStatusEnum.Dead) ? true : (statusLock && this.statusCode >= statusLock) ? true : false;
  }
  private isFieldRequired(statusRequired: SubmissionStatusEnum, fieldIsReadonly?: boolean) {
    return (fieldIsReadonly || this.statusCode === SubmissionStatusEnum.Dead) ? false : this.statusCode >= statusRequired;
  }
  private setStatusDesc() {
    switch (this.statusCode) {
    case SubmissionStatusEnum.Live:
      this.statusCodeDesc = SubmissionStatusDescEnum.Live;
      break;
    case SubmissionStatusEnum.Dead:
      this.statusCodeDesc = SubmissionStatusDescEnum.Dead;
      break;
    case SubmissionStatusEnum.InQuote:
      this.statusCodeDesc = SubmissionStatusDescEnum.InQuote;
      break;
    case SubmissionStatusEnum.Bound:
      this.statusCodeDesc = SubmissionStatusDescEnum.Bound;
      break;
    default:
      this.statusCodeDesc = null;
      break;
    }
  }
  setRequiredFields(){
    this.producerRequired = this.isFieldRequired(this.producerCodeRequiredStatus, this.producerReadonly);
    this.underwriterRequired = this.isFieldRequired(this.underwriterRequiredStatus, this.underwriterReadonly);
    this.policyDateRequired = this.isFieldRequired(this.policyDateRequiredStatus, this.policyDateReadonly);
    this.departmentRequired = this.isFieldRequired(this.departmentCodeRequiredStatus, this.departmentReadonly);
    //this.naicsRequired = this.isFieldRequired(this.naicsCodeRequiredStatus, this.naicsReadonly);
    //this.sicCodeRequired = this.isFieldRequired(this.sicCodeRequiredStatus, this.sicCodeReadonly);
    //this.quoteDueDateRequired = this.isFieldRequired(this.quoteDueDateRequiredStatus, this.quoteDueDateReadonly);
    //this.producerContactRequired = this.isFieldRequired(this.producerContactRequiredStatus, this.producerContactReadonly);
  }
  setReadonlyFields(){
    this.departmentReadonly = this.isFieldReadonly(this.departmentCodeLockStatus);
    this.naicsReadonly = this.isFieldReadonly();
    this.sicCodeReadonly = this.isFieldReadonly();
    this.policyDateReadonly = this.isFieldReadonly();
    this.quoteDueDateReadonly = this.isFieldReadonly();
    this.producerContactReadonly = this.isFieldReadonly();
    this.producerReadonly = this.isFieldReadonly();
    this.underwriterReadonly = this.isFieldReadonly();
    this.newRenewalFlagReadonly = this.isFieldReadonly();
    this.expiringPolicyReadonly = this.isFieldReadonly();
    this.extExpiringPolicyReadonly = this.isFieldReadonly();
    this.renewablePolicyReadonly = this.isFieldReadonly();
  }

  setWarnings(){
    this.warningsList = [];
    this.warningsMessage = '';
    this.setEffectiveDateWarning();
    this.setExpirationDateBeforeEffectiveDateWarning();
    this.createWarningString();
  }
  setEffectiveDateWarning() {
    const diff = moment().diff(moment(this._polEffDate), 'days');
    if (diff >= this._effectiveDatePastWarningRange) {
      this.warningsList.push('Policy Effective Date is effective ' + diff + ' days ago.');
    } else if (diff <= this._effectiveDateFutureWarningRange) {
      this.warningsList.push('Policy Effective Date is effective ' + (Math.abs(diff) + 1) + ' days in the future.');
    }
  }
  setExpirationDateBeforeEffectiveDateWarning() {
    const diff = moment(this._polExpDate).diff(moment(this._polEffDate), 'days');
    if (diff < 1) {
      this.warningsList.push('Policy Effective Date must be before Expiration Date');
      this._polExpDate = null;
    }
  }
  createWarningString(){
    if (this.warningsList.length > 0) {
      for (const error of this.warningsList) {
        this.warningsMessage += '<br><li>' + error;
      }
    }

  }
  get errorMessage() {
    let message = '';
    this.invalidList.forEach(error => {
      message += '<br><li>' + error;
    });
    return 'Following fields are invalid' + message;
  }

  validateNew(valid: boolean): boolean {
    this.invalidList = [];
    if (!this.validateUnderwriter()) {
      valid = false;
    }
    if (!this.validateProducer()) {
      valid = false;
    }
    if (!this.validateDepartment()) {
      valid = false;
    }
    if (!this.validatePolicyDates()) {
      valid = false;
    }
    return valid;
  }
  validateQuoted(valid: boolean): boolean {
    this.invalidList = [];
    if (!this.validateUnderwriter()) {
      valid = false;
    }
    if (!this.validateProducer()) {
      valid = false;
    }
    if (!this.validateDepartment()) {
      valid = false;
    }
    if (!this.validatePolicyDates()) {
      valid = false;
    }
    return valid;
  }
  validateBound(valid: boolean): boolean {
    this.invalidList = [];
    if (!this.validateUnderwriter()) {
      valid = false;
    }
    if (!this.validateProducer()) {
      valid = false;
    }
    if (!this.validateDepartment()) {
      valid = false;
    }
    if (!this.validatePolicyDates()) {
      valid = false;
    }
    return valid;
  }
  validateUnderwriter(): boolean {
    let valid = true;
    if (this.underwriter === null) {
      valid = false;
      this.invalidList.push('No Underwriter selected.');
    }
    return valid;
  }
  validateProducer(): boolean {
    let valid = true;
    if (this.producerCode === null) {
      valid = false;
      this.invalidList.push('No Producer selected.');
    }
    return valid;
  }
  validateDepartment(): boolean {
    let valid = true;
    if (this._departmentCode === null) {
      valid = false;
      this.invalidList.push('No Department selected.');
    }
    return valid;
  }
  validatePolicyDates(): boolean {
    let valid = true;
    if (this._polEffDate === null || this._polExpDate === null) {
      valid = false;
      this.invalidList.push('Policy effective and expiration dates must be set.');
    }
    return valid;
  }
  resetClass() {
    this.init(this._submission, this._insured);
  }
  updateClass(submission?: Submission){
    this._submission = submission;
    this.init(this._submission);
  }
  toJSON() {
    return {
      producerCode: this._producerCode,
      departmentCode: this.departmentCode,
      underwriter: this.underwriter,
      sicCode: this.sicCode,
      naicsCode: this.naicsCode,
      submissionNumber: this.submissionNumber,
      companyCode: this.companyCode,
      regionCode: this.regionCode,
      officeCode: this.officeCode,
      insuredCode: this.insuredCode,
      polEffDate: this._polEffDate,
      polExpDate: this._polExpDate,
      quoteDueDate: this._quoteDueDate,
      expiringPolicyId: this._expiringPolicyId,
      newRenewalFlag: this._newRenewalFlag,
      createdBy: this.createdBy,
      createdDate: this.createdDate,
      statusCode: this.statusCode,
      reasonCode: this.reasonCode,
      comments: this.comments,
      applyToDate: this.applyToDate,
      groupId: this.groupId,
      eventCode: this.eventCode,
      eventDate: this.eventDate,
      programId: this.programId,
      contractorCode: this.contractorCode,
      renewablePolicy: this._renewablePolicy === true ? 1 : 0,
      cancelDate: this.cancelDate,
      producerContactId: this._producerContact,
      producerContactName: this.producerContactName,
      producerContactEmail: this.producerContactEmail,
      uwBranchCode: this.uwBranchCode,
      businessUnit: this.businessUnit,
      submissionGroupId: this.submissionGroupId,
      businessType: this.businessType,
      lobCode: this.lobCode,
      processor: this.processor,
      submissionEventCode: this.submissionEventCode,
      extExpiringPolicyNo: this._extExpiringPolicyNo,
      policyTerm: this._policyTerm === PolicyTermEnum.custom ? null : this._policyTerm
    };
  }

}
