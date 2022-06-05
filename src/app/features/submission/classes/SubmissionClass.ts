import { SubmissionStatusEnum } from 'src/app/core/enums/submission-status-enum';
import { Insured } from '../../insured/models/insured';
import { Producer } from '../models/producer';
import { ProducerContact } from '../models/producer-contact';
import { Submission } from '../models/submission';
import { SubmissionEvent } from '../models/submission-event';

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
  private _renewablePolicy: boolean | number = false;
  private _isDirty = false;

  producerCodeRequiredStatus = SubmissionStatusEnum.Live;
  producerContactRequiredStatus = SubmissionStatusEnum.Bound;
  departmentCodeRequiredStatus = SubmissionStatusEnum.Live;
  underwriterRequiredStatus = SubmissionStatusEnum.Live;
  sicCodeRequiredStatus = SubmissionStatusEnum.Bound;
  naicsCodeRequiredStatus = SubmissionStatusEnum.Bound;
  policyDateRequiredStatus = SubmissionStatusEnum.Live;
  quoteDueDateRequiredStatus = SubmissionStatusEnum.Bound;

  producerCodeLockStatus = SubmissionStatusEnum.Bound;
  producerContactLockStatus = SubmissionStatusEnum.Bound;
  departmentCodeLockStatus = SubmissionStatusEnum.InQuote;
  underwriterLockStatus = SubmissionStatusEnum.Bound;
  sicCodeLockStatus = SubmissionStatusEnum.Bound;
  naicsCodeLockStatus = SubmissionStatusEnum.Bound;
  policyDateLockStatus = SubmissionStatusEnum.Bound;
  quoteDueDateLockStatus = SubmissionStatusEnum.Bound;
  newRenewalFlagLockStatus = SubmissionStatusEnum.Bound;
  expiringPolicyLockStatus = SubmissionStatusEnum.Bound;
  extExpiringPolicyLockStatus = SubmissionStatusEnum.Bound;
  renewablePolicyLockStatus = SubmissionStatusEnum.Bound;

  producerRequired = false;
  producerContactRequired = false;
  departmentRequired = false;
  underwriterRequired = false;
  sicCodeRequired = false;
  naicsRequired = false;
  policyDateRequired = false;
  quoteDueDateRequired = false;

  producerEditable = false;
  producerContactEditable = false;
  departmentEditable = false;
  underwriterEditable = false;
  sicCodeEditable = false;
  naicsEditable = false;
  policyDateEditable = false;
  quoteDueDateEditable = false;
  newRenewalFlagEditable = false;
  expiringPolicyEditable = false;
  extExpiringPolicyEditable = false;
  renewablePolicyEditable = false;

  submissionNumber = 0;
  companyCode: number | null = null;
  regionCode: number | null = null;
  officeCode: number | null = null;
  insuredCode: number | null = null;
  brokerId: number | null = null;
  retailProducerCode: number | null = null;
  statusCode = 0;
  reasonCode = 0;
  comments = '';
  applyToDate: Date | null = null;
  createdBy: number | null = null;
  createdDate: Date | null = null;
  modifiedBy: number | null = null;
  modifiedDate: Date | null = null;
  groupId: number | null = null;
  eventCode: number | null = null;
  eventDate: Date | null = null;
  programId = 0;
  contractorCode: number | null = null;
  xrefSubNum: number | null = null;
  cancelDate: Date | null = null;
  assistantBroker: number | null = null;
  producerContactName = '';
  producerContactEmail = '';
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
  producerContact: ProducerContact | null = null;
  submissionEvents: SubmissionEvent[] = [];
  underwriterName: string | null = null;

  constructor(sub?: Submission, insured?: Insured){
    this._departmentCode = sub?.departmentCode || null;
    this._producerCode = sub?.producerCode || null;
    this._producerContact = sub?.producerContactId || null;
    this._sicCode = sub?.sicCode || insured?.sicCode || null;
    this._naicsCode = sub?.naicsCode || insured?.naicsCode || null;
    this._underwriter = sub?.underwriter || null;
    this.regionCode = sub?.regionCode || null;
    this.officeCode = sub?.officeCode || null;
    this.insuredCode = sub?.insuredCode || insured?.insuredCode || null;
    this.brokerId = sub?.brokerId || null;
    this.retailProducerCode = sub?.retailProducerCode || null;
    this._polEffDate = sub?.polEffDate || null;
    this._polExpDate = sub?.polExpDate || null;
    this._quoteDueDate = sub?.quoteDueDate || null;
    this._expiringPolicyId = sub?.expiringPolicyId || null;
    this._newRenewalFlag = sub?.newRenewalFlag || 0;
    this.statusCode = sub?.statusCode || 0;
    this.reasonCode = sub?.reasonCode || 0;
    this.comments = sub?.comments || '';
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
    this._renewablePolicy = sub?.renewablePolicy === 1 ? true : false;
    this.xrefSubNum = sub?.xrefSubNum || null;
    this.cancelDate = sub?.cancelDate || null;
    this.assistantBroker = sub?.assistantBroker || null;
    this.producerContactName = sub?.producerContactName || '';
    this.producerContactEmail = sub?.producerContactEmail || '';
    this.teamId = sub?.teamId || null;
    this.uwBranchCode = sub?.uwBranchCode || '';
    this.businessUnit = sub?.businessUnit || '';
    this.submissionGroupId = sub?.submissionGroupId || null;
    this.submissionNumber = sub?.submissionNumber || 0;
    this.companyCode = sub?.companyCode || null;
    this.underwriterName = sub?.underwriterName || null;
    this.submissionEvents = sub?.submissionEvents || [];
    this.producerContact = sub?.producerContact || null;
    this.producer = sub?.producer || null;
    this.insured = sub?.insured || insured || null;
    this._extExpiringPolicyNo = sub?.extExpiringPolicyNo || '';
    this.submissionEventCode = sub?.submissionEventCode || '';
    this.processor = sub?.processor || null;
    this.constructionWrapup = sub?.constructionWrapup || null;
    this.lobCode = sub?.lobCode || null;
    this.businessType = sub?.businessType || '';

    this.setRequiredFields();
    this.setEditableFields();
  }

  get departmentCode() : number | null {
    return this._departmentCode;
  }
  set departmentCode(code: number | null) {
    this._departmentCode = code;
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
    this._isDirty = true;
  }
  get polExpDate() : Date | null {
    return this._polExpDate;
  }
  set polExpDate(date: Date | null) {
    this._polExpDate = date;
    this._isDirty = true;
  }
  get quoteDueDate() : Date | null {
    return this._quoteDueDate;
  }
  set quoteDueDate(date: Date | null) {
    this._quoteDueDate = date;
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
  get isDirty() : boolean {
    return this._isDirty;
  }
  get isValid(): boolean {
    let valid = true;
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
  markClean() {
    this._isDirty = false;
  }
  markDirty() {
    this._isDirty = true;
  }
  isFieldEditable(statusLock: SubmissionStatusEnum) {
    return this.statusCode === SubmissionStatusEnum.Dead ? false : this.statusCode < statusLock;
  }
  isFieldRequired(statusRequired: SubmissionStatusEnum) {
    return this.statusCode === SubmissionStatusEnum.Dead ? false : this.statusCode >= statusRequired;
  }
  setRequiredFields(){
    this.naicsRequired = this.isFieldRequired(this.naicsCodeRequiredStatus);
    this.sicCodeRequired = this.isFieldRequired(this.sicCodeRequiredStatus);
    this.policyDateRequired = this.isFieldRequired(this.policyDateRequiredStatus);
    this.quoteDueDateRequired = this.isFieldRequired(this.quoteDueDateRequiredStatus);
    this.departmentRequired = this.isFieldRequired(this.departmentCodeRequiredStatus);
    this.producerContactRequired = this.isFieldRequired(this.producerContactRequiredStatus);
    this.producerRequired = this.isFieldRequired(this.producerCodeRequiredStatus);
    this.underwriterRequired = this.isFieldRequired(this.underwriterRequiredStatus);
  }
  setEditableFields(){
    this.naicsEditable = this.isFieldEditable(this.naicsCodeLockStatus);
    this.sicCodeEditable = this.isFieldEditable(this.sicCodeLockStatus);
    this.policyDateEditable = this.isFieldEditable(this.policyDateLockStatus);
    this.quoteDueDateEditable = this.isFieldEditable(this.quoteDueDateLockStatus);
    this.departmentEditable = this.isFieldEditable(this.departmentCodeLockStatus);
    this.producerContactEditable = this.isFieldEditable(this.producerContactLockStatus);
    this.producerEditable = this.isFieldEditable(this.producerCodeLockStatus);
    this.underwriterEditable = this.isFieldEditable(this.underwriterLockStatus);
    this.newRenewalFlagEditable = this.isFieldEditable(this.newRenewalFlagLockStatus);
    this.expiringPolicyEditable = this.isFieldEditable(this.expiringPolicyLockStatus);
    this.extExpiringPolicyEditable = this.isFieldEditable(this.extExpiringPolicyLockStatus);
    this.renewablePolicyEditable = this.isFieldEditable(this.renewablePolicyLockStatus);
  }
  validateNew(valid: boolean): boolean {
    if (this._underwriter === null) {
      valid = false;
    }
    if (this._producerCode === null) {
      valid = false;
    }
    if (this._departmentCode === null) {
      valid = false;
    }
    return valid;
  }
  validateQuoted(valid: boolean): boolean {
    if (this._underwriter === null) {
      valid = false;
    }
    if (this._producerCode === null) {
      valid = false;
    }
    if (this._departmentCode === null) {
      valid = false;
    }
    return valid;
  }
  validateBound(valid: boolean): boolean {
    if (this._underwriter === null) {
      valid = false;
    }
    if (this._producerCode === null) {
      valid = false;
    }
    if (this._departmentCode === null) {
      valid = false;
    }
    return valid;
  }
  toJSON() {
    return {
      producerCode: this._producerCode,
      departmentCode: this.departmentCode,
      producerContact: this.producerContact,
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
      producerContactName: this.producerContactName,
      producerContactEmail: this.producerContactEmail,
      uwBranchCode: this.uwBranchCode,
      businessUnit: this.businessUnit,
      submissionGroupId: this.submissionGroupId,
      businessType: this.businessType,
      lobCode: this.lobCode,
      processor: this.processor,
      submissionEventCode: this.submissionEventCode,
      extExpiringPolicyNo: this._extExpiringPolicyNo
    };
  }

}
