import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { Endorsement, PolicyInformation } from '../../models/policy';
import { EndorsementStoredValues } from '../../services/endorsement-stored-values/endorsement-stored-values.service';
import { TransactionTypes } from '../../../../core/constants/transaction-types';
import { UpdatePolicyChild } from '../../services/update-child/update-child.service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';

@Component({
  selector: 'rsps-endorsement-header',
  templateUrl: './endorsement-header.component.html',
  styleUrls: ['./endorsement-header.component.css']
})
export class EndorsementHeaderComponent implements OnInit {
  isReadOnly = true;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  transactionTypes!: Code[];
  terrorismCodes$: Observable<Code[]> | undefined;
  endSub: Subscription | undefined;
  isTransactionEffectiveDateValid: boolean = true;
  isTransactionExpirationDateValid: boolean = true;
  canEditEndorsement: boolean = false;
  statusSub!: Subscription;
  isAttachmentPointValid: boolean = false;
  isPolicyCancelled: boolean = false;
  isRewrite: boolean = false;
  isUnderlyingLimitValid = false;
  savePolicyInfo: boolean = false;

  @Input() public endorsement!: Endorsement;
  @Input() public policyInfo!: PolicyInformation;

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private datePipe: DatePipe, private endorsementStoredValuesService: EndorsementStoredValues,
    private endorsementStatusService: EndorsementStatusService, private updatePolicyChild: UpdatePolicyChild) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  @ViewChild('endorsementHeaderForm', { static: false }) endorsementHeaderForm!: NgForm;

  async ngOnInit(): Promise<void> {
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    this.isRewrite = this.endorsementStatusService.isRewrite;
    const transactionTypes$ = this.dropdowns.getTransactionTypes();
    this.transactionTypes = await lastValueFrom(transactionTypes$);
    this.terrorismCodes$ = this.dropdowns.getTerrorismCodes();
    this.checkAttachmentPointValid();
    this.endorsementStoredValuesService.SIR = this.endorsement.sir;
    // this.checkUnderlyingLimitValid();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.statusSub?.unsubscribe();
    this.endSub?.unsubscribe();
  }

  isExtensionDateSelected(): boolean {
    if (this.endorsement.transactionTypeCode == TransactionTypes.PolicyExtensionByEndt) {
      return true;
    } else {
      return false;
    }
  }
  isCancelSelected(): boolean {
    if (this.endorsement.transactionTypeCode == TransactionTypes.ProRataCancel || this.endorsement.transactionTypeCode == TransactionTypes.FlatCancel ||
      this.endorsement.transactionTypeCode == TransactionTypes.ShortRateCancel || this.endorsement.transactionTypeCode == TransactionTypes.CancellationOfPolicyExtension) {
      return true;
    } else {
      return false;
    }
  }
  isReinstatementSelected(): boolean {
    if (this.endorsement.transactionTypeCode == TransactionTypes.Reinstatement) {
      return true;
    } else {
      return false;
    }
  }
  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }

  checkAttachmentPointValid(): boolean {
    return this.isPrimaryPolicy || this.endorsement.attachmentPoint > 0;
  }

  checkAttachmentPointUnderlyingLimitValid(): boolean {
    return this.isPrimaryPolicy || this.endorsement.attachmentPoint >= this.endorsement.underlyingLimit;
  }

  checkUnderlyingLimitValid(): boolean {
    const excesses = ['ENY', 'XS'];
    return !excesses.includes(this.policyInfo.policySymbol.trim().toUpperCase()) || this.endorsement.underlyingLimit > 0;
  }
  transactionEffectiveDateIsEditable(): boolean {
    if (this.isCancelSelected() || this.isExtensionDateSelected() || this.isReinstatementSelected()) {
      return false;
    } else {
      return true;
    }
  }
  transactionExpirationDateIsEditable(): boolean {
    if (this.isCancelSelected() || this.isReinstatementSelected()) {
      return false;
    } else {
      return true;
    }
  }
  changeEffectiveDate() {
    if (this.endorsement.endorsementNumber == 0 && this.endorsement.transactionEffectiveDate) {
      this.isTransactionEffectiveDateValid = this.datePipe.transform(this.endorsement.transactionEffectiveDate, 'yyyyMMdd') == this.datePipe.transform(this.policyInfo.policyEffectiveDate, 'yyyyMMdd');
      if (this.isTransactionEffectiveDateValid) {
        this.endorsementHeaderForm.controls['endorsementEffectiveDate'].markAsPristine();
      }
      else {
        this.endorsementHeaderForm.controls['endorsementEffectiveDate'].setErrors({ 'incorrect': !this.isTransactionEffectiveDateValid });
      }
    }
  }

  changeExpirationDate() {
    if (!this.endorsement.transactionExpirationDate || (this.endorsement.transactionExpirationDate && moment(this.endorsement.transactionExpirationDate) <= moment(this.endorsement.transactionEffectiveDate))){
      this.endorsement.transactionExpirationDate = null;
      this.isTransactionExpirationDateValid = false;
      return;
    }
    this.isTransactionExpirationDateValid = true;
    this.policyInfo.policyExpirationDate = moment(this.policyInfo.policyExpirationDate).startOf('day').toDate();
    if(this.isExtensionDateSelected()) {
      this.policyInfo.policyExtendedExpDate = this.endorsement.transactionExpirationDate;
      this.savePolicyInfo = true;
    }
    if (this.endorsement.endorsementNumber == 0 && this.endorsement.transactionExpirationDate) {
      this.isTransactionExpirationDateValid = this.datePipe.transform(this.endorsement.transactionExpirationDate, 'yyyyMMdd') == this.datePipe.transform(this.policyInfo.policyExpirationDate, 'yyyyMMdd');
      //this.policyInfo.policyExtendedExpDate = this.endorsement.transactionExpirationDate;
      if (this.isTransactionExpirationDateValid) {
        this.endorsementHeaderForm.controls['endorsementExpirationDate'].markAsPristine();
      }
      else {
        this.endorsementHeaderForm.controls['endorsementExpirationDate'].setErrors({ 'incorrect': !this.isTransactionExpirationDateValid });
      }
    }
  }

  changeTerrorism() {
    this.updatePolicyChild.terrorismChanged();
  }
  // clearAllTransactionTypeSpecificData(event: any) {
  //   this.clearOrSetCancelDate(event);
  //   this.clearOrSetExtensionDate(event);
  // }
  // clearOrSetCancelDate(event: any) {
  //   if (event.key == TransactionTypes.ProRataCancel || event.key == TransactionTypes.FlatCancel ||
  //     event.key == TransactionTypes.ShortRateCancel || event.key == TransactionTypes.CancellationOfPolicyExtension) {
  //       this.policyInfo.policyCancelDate = this.policyInfo.policyExpirationDate;
  //       this.endorsement.transactionEffectiveDate = this.policyInfo.policyExpirationDate;
  //       this.endorsement.transactionExpirationDate = this.policyInfo.policyExpirationDate;
  //     } else if (!this.isPolicyCancelled) {
  //     this.policyInfo.policyCancelDate = null;
  //   }
  // }
  // clearOrSetExtensionDate(event: any) {
  //   if (event.key == TransactionTypes.PolicyExtensionByEndt) {
  //     this.policyInfo.policyExtendedExpDate = this.endorsement.transactionExpirationDate;
  //     this.endorsement.transactionEffectiveDate = this.policyInfo.policyExpirationDate;
  //   } else {
  //     this.policyInfo.policyExtendedExpDate = null;
  //   }
  // }
  canSave(): boolean {
    if (this.canEditPolicy && this.endorsementHeaderForm.dirty) {
      return this.endorsementHeaderForm.status == 'VALID';
    }
    return false;
  }
  changeSIR(value: number): void {
    this.endorsementStoredValuesService.SIR = value;
  }
  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy;
  }
  get canEditTransactionType(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && this.endorsement.endorsementNumber > 0 && !this.isRewrite;
  }
  get canEditTransactionDates(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && this.endorsement.endorsementNumber > 0;
  }
  get canEditAttachmentPoint(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && (this.isExcessPolicy);
  }
  get canEditUnderlyingLimits(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && (this.isExcessPolicy);
  }
  private get isPrimaryPolicy(): boolean {
    const primaries = ['PL', 'PNY', 'PRC'];
    return primaries.includes(this.policyInfo.policySymbol.trim().toUpperCase());
  }
  private get isExcessPolicy(): boolean {
    return !this.isPrimaryPolicy;
  }
}
