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
  private _isDirty = false;

  submissionNumber = 0;
  companyCode: number | null = null;
  regionCode: number | null = null;
  officeCode: number | null = null;
  insuredCode: number | null = null;
  brokerId: number | null = null;
  retailProducerCode: number | null = null;
  polEffDate: Date | null = null;
  polExpDate: Date | null = null;
  quoteDueDate: Date | null = null;
  expiringPolicyId: number | null = null;
  newRenewalFlag = 0;
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
  renewablePolicy = 0;
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
  extExpiringPolicyNo = '';
  insured: Insured | null = null;
  producer: Producer | null = null;
  producerContact: ProducerContact | null = null;
  submissionEvents: SubmissionEvent[] = [];
  underwriterName: string | null = null;

  constructor(sub?: Submission, insured?: Insured){
    this._departmentCode = sub?.departmentCode || null;
    this._producerCode = sub?.producerCode || null;
    this._producerContact = sub?.producerContactId || null;
    this._sicCode = sub?.sicCode || null;
    this._naicsCode = sub?.naicsCode || null;
    this._underwriter = sub?.underwriter || null;
    this.regionCode = sub?.regionCode || null;
    this.officeCode = sub?.officeCode || null;
    this.insuredCode = sub?.insuredCode || insured?.insuredCode || null;
    this.brokerId = sub?.brokerId || null;
    this.retailProducerCode = sub?.retailProducerCode || null;
    this.polEffDate = sub?.polEffDate || null;
    this.polExpDate = sub?.polExpDate || null;
    this.quoteDueDate = sub?.quoteDueDate || null;
    this.expiringPolicyId = sub?.expiringPolicyId || null;
    this.newRenewalFlag = sub?.newRenewalFlag || 0;
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
    this.renewablePolicy = sub?.renewablePolicy || 0;
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
    this.extExpiringPolicyNo = sub?.extExpiringPolicyNo || '';
    this.submissionEventCode = sub?.submissionEventCode || '';
    this.processor = sub?.processor || null;
    this.constructionWrapup = sub?.constructionWrapup || null;
    this.lobCode = sub?.lobCode || null;
    this.businessType = sub?.businessType || '';
  }

  get producerCode() : number | null {
    return this._producerCode;
  }
  set producerCode(code: number | null) {
    this._producerCode = code;
    this._isDirty = true;
  }
  get departmentCode() : number | null {
    return this._departmentCode;
  }
  set departmentCode(code: number | null) {
    this._departmentCode = code;
    this._isDirty = true;
  }
  get producerContactId() : number | null {
    return this._producerContact;
  }
  set producerContactId(code: number | null) {
    this._producerContact = code;
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
  markClean() {
    this._isDirty = false;
  }
  markDirty() {
    this._isDirty = true;
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
      polEffDate: this.polEffDate,
      polExpDate: this.polExpDate,
      quoteDueDate: this.quoteDueDate,
      expiringPolicyId: this.expiringPolicyId,
      newRenewalFlag: this.newRenewalFlag,
      statusCode: this.statusCode,
      reasonCode: this.reasonCode,
      comments: this.comments,
      applyToDate: this.applyToDate,
      groupId: this.groupId,
      eventCode: this.eventCode,
      eventDate: this.eventDate,
      programId: this.programId,
      contractorCode: this.contractorCode,
      renewablePolicy: this.renewablePolicy,
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
      extExpiringPolicyNo: this.extExpiringPolicyNo
    };
  }

}
