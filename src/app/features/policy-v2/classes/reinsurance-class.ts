import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { ChildBaseClass, ErrorMessageSettings } from './base/child-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { ReinsuranceLayerData } from '../../policy/models/policy';
import { newInvoiceDetail } from '../../policy/models/invoice';
import { PolicyLayerClass } from './policy-layer-class';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';

export class ReinsuranceClass extends ChildBaseClass implements Deletable, ReinsuranceLayerData {

  policyId!: number;
  endorsementNumber!: number;
  policyLayerNo!: number;
  treatyType: string | null = null;
  subTreatyNo: number | null = null;
  reinsurerCode: number | null = null;
  proflag: number | null = null;
  enteredDate: Date | null = null;
  invoiceNo: number | null = null;
  payableNo: number | null = null;
  facBalance: number | null = null;
  cededPremium: number | undefined = 0;
  cededCommission: number | null = null;
  sumIuscededPrmByTreatyInv: number | null = null;
  sumProcededPrmByTreatyInv: number | null = null;
  expirationDate: Date | null = null;
  cededCommissionRat: number | null = null;
  effectiveDate: Date | null = null;
  maxLayerLimit?: number | null | undefined = undefined;
  policyLayer?: PolicyLayerClass;

  markDirty(): void {
    super.markDirty();
    this.policyLayer?.markDirty();
  }

  _reinsLayerNo!: number;
  get reinsLayerNo(): number {
    return this._reinsLayerNo;
  }
  set reinsLayerNo(value: number) {
    this._reinsLayerNo = value;
    this.markDirty();
  }

  _attachmentPoint: number = 0;
  get attachmentPoint(): number {
    return this._attachmentPoint;
  }
  set attachmentPoint(value: number) {
    this._attachmentPoint = value;
    this.markDirty();
  }

  _reinsLimit: number | null = null;
  get reinsLimit(): number | null {
    return this._reinsLimit;
  }
  set reinsLimit(value: number | null) {
    this._reinsLimit = value;
    this.markDirty();
  }

  _reinsCededPremium: number | null = null;
  get reinsCededPremium(): number | null {
    return this._reinsCededPremium;
  }
  set reinsCededPremium(value: number | null) {
    this._reinsCededPremium = value;
    this.markDirty();
  }

  _reinsCededCommRate: number = 0;
  get reinsCededCommRate(): number {
    return this._reinsCededCommRate;
  }
  set reinsCededCommRate(value: number) {
    this._reinsCededCommRate = value;
    this.markDirty();
  }

  _treatyNo?: number | null | undefined = undefined;
  get treatyNo(): number | null | undefined {
    return this._treatyNo;
  }
  set treatyNo(value: number | null | undefined) {
    this._treatyNo = value;
    this.markDirty();
  }

  _isFacultative: boolean | null = false;
  get isFacultative(): boolean | null {
    return this._isFacultative;
  }
  set isFacultative(value: boolean | null) {
    this._isFacultative = value;
    this.markDirty();
  }

  _intermediaryNo: number | null = null;
  get intermediaryNo(): number | null {
    return this._intermediaryNo;
  }
  set intermediaryNo(value: number | null) {
    this._intermediaryNo = value;
    this.markDirty();
  }

  _reinsCertificateNo?: string | null | undefined = null;
  get reinsCertificateNo(): string | null | undefined {
    return this._reinsCertificateNo;
  }
  set reinsCertificateNo(value: string | null | undefined) {
    this._reinsCertificateNo = value;
    this.markDirty();
  }

  constructor(policyLayer: PolicyLayerClass, data?: ReinsuranceLayerData) {
    super();
    if (data) {
      this.existingInit(data);
    } else {
      this.newInit();
    }
    this.policyLayer = policyLayer;
  }

  newInit() {
    this.policyId = -1;
    this.endorsementNumber = -1;
    this.policyLayerNo = -1;
    this.reinsLayerNo = -1;
  }

  existingInit(data: ReinsuranceLayerData) {
    this.policyId = data.policyId;
    this.endorsementNumber = data.endorsementNumber;
    this.policyLayerNo = data.policyLayerNo;
    this.reinsLayerNo = data.reinsLayerNo;
    this.reinsLimit = data.reinsLimit;
    this.reinsCededPremium = data.reinsCededPremium;
    this.reinsCededCommRate = data.reinsCededCommRate;
    this.treatyType = data.treatyType;
    this.treatyNo = data.treatyNo;
    this.subTreatyNo = data.subTreatyNo;
    this.reinsurerCode = data.reinsurerCode;
    this.reinsCertificateNo = data.reinsCertificateNo;
    this.proflag = data.proflag;
    this.enteredDate = data.enteredDate;
    this.invoiceNo = data.invoiceNo;
    this.payableNo = data.payableNo;
    this.intermediaryNo = data.intermediaryNo;
    this.facBalance = data.facBalance;
    this.cededPremium = data.cededPremium;
    this.cededCommission = data.cededCommission;
    this.sumIuscededPrmByTreatyInv = data.sumIuscededPrmByTreatyInv;
    this.sumProcededPrmByTreatyInv = data.sumProcededPrmByTreatyInv;
    this.expirationDate = data.expirationDate;
    this.cededCommissionRat = data.cededCommissionRat;
    this.effectiveDate = data.effectiveDate;
    this.isFacultative = data.isFacultative;
    this.maxLayerLimit = data.maxLayerLimit;
    this.attachmentPoint = data.attachmentPoint;
    this.isNew = data.isNew;
  }

  static create(policyLayer: PolicyLayerClass, policyId: number, endorsementNumber: number, policyLayerNo: number, reinsLayerNo: number): ReinsuranceClass {
    const reins = new ReinsuranceClass(policyLayer);
    reins.policyId = policyId;
    reins.endorsementNumber = endorsementNumber;
    reins.policyLayerNo = policyLayerNo;
    reins.reinsLayerNo = reinsLayerNo;
    reins.markDirty();
    return reins;
  }

  private _markForDeletion = false;
  get markForDeletion() : boolean {
    return this._markForDeletion;
  }
  set markForDeletion(value: boolean) {
    this._markForDeletion = value;
    this.markDirty();
  }

  onDelete(): void {
    throw new Error('Method not implemented.');
  }

  validateObject(): ErrorMessage[] {
    const settings: ErrorMessageSettings = {preventSave: false, tabAffinity: ValidationTypeEnum.Reinsurance, failValidation: false};
    this.errorMessagesList = [];
    if (this.canEdit) {
      if (this.reinsLimit == null) {
        this.createErrorMessage(`Reinsurance Layer ${this.reinsLayerNo}: Limit cannot be empty.`, settings );
      }
      if (this.reinsCededPremium == null) {
        this.createErrorMessage(`Reinsurance Layer ${this.reinsLayerNo}: Premium cannot be empty.`, settings);
      }
      if (this.reinsCededCommRate == null) {
        this.createErrorMessage(`Reinsurance Layer ${this.reinsLayerNo}: Commission rate cannot be empty.`, settings);
      }
      if (this.treatyNo == null) {
        this.createErrorMessage(`Reinsurance Layer ${this.reinsLayerNo}: Code cannot be empty.`, settings);
      }
    }
    console.log('line207', this.errorMessagesList);
    return this.errorMessagesList;
  }

  onGuidNewMatch(T: ChildBaseClass): void {
    this.isNew = false;
  }

  onGuidUpdateMatch(T: ChildBaseClass): void {
    this.isNew = false;
  }

  toJSON(): ReinsuranceLayerData {
    return {
      policyId: this.policyId,
      endorsementNumber: this.endorsementNumber,
      policyLayerNo: this.policyLayerNo,
      reinsLayerNo: this.reinsLayerNo,
      reinsLimit: this.reinsLimit,
      reinsCededPremium: this.reinsCededPremium,
      reinsCededCommRate: this.reinsCededCommRate,
      treatyType: this.treatyType,
      treatyNo: this.treatyNo,
      subTreatyNo: this.subTreatyNo,
      reinsurerCode: this.reinsurerCode,
      reinsCertificateNo: this.reinsCertificateNo,
      proflag: this.proflag,
      enteredDate: this.enteredDate,
      invoiceNo: this.invoiceNo,
      payableNo: this.payableNo,
      intermediaryNo: this.intermediaryNo,
      facBalance: this.facBalance,
      cededPremium: this.cededPremium,
      cededCommission: this.cededCommission,
      sumIuscededPrmByTreatyInv: this.sumIuscededPrmByTreatyInv,
      sumProcededPrmByTreatyInv: this.sumProcededPrmByTreatyInv,
      expirationDate: this.expirationDate,
      cededCommissionRat: this.cededCommissionRat,
      effectiveDate: this.effectiveDate,
      isFacultative: this.isFacultative,
      maxLayerLimit: this.maxLayerLimit,
      attachmentPoint: this.attachmentPoint,
      isNew: this.isNew,
      markForDeletion: this.markForDeletion
    };
  }
}
