import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { Endorsement, PolicyInformation } from '../../policy';
import { EndorsementStatusService } from '../../services/endorsement-status.service';
import { UpdatePolicyChild } from '../../services/update-child.service';
import { TransactionTypes } from '../../transaction-types';

@Component({
  selector: 'rsps-endorsement-header',
  templateUrl: './endorsement-header.component.html',
  styleUrls: ['./endorsement-header.component.css']
})
export class EndorsementHeaderComponent implements OnInit {
  isReadOnly: boolean = true;
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
  isUnderlyingLimitValid: boolean = false;
  savePolicyInfo: boolean = false;

  @Input() public endorsement!: Endorsement;
  @Input() public policyInfo!: PolicyInformation;

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private datePipe: DatePipe, private endorsementStatusService: EndorsementStatusService, private updatePolicyChild: UpdatePolicyChild) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  @ViewChild('endorsementHeaderForm', { static: false }) endorsementHeaderForm!: NgForm;

  async ngOnInit():  Promise<void> {
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    this.isRewrite = this.endorsementStatusService.isRewrite;
    const transactionTypes$ = this.dropdowns.getTransactionTypes();
    this.transactionTypes = await lastValueFrom(transactionTypes$);
    let preEndorsementStatus =  this.endorsementStatusService.preEndorsementStatus;
    if (preEndorsementStatus !== "Cancelled"){
      this.transactionTypes = this.transactionTypes.filter(x => x.description !== 'Reinstatement');
    } else {
      this.isPolicyCancelled = true;
      this.transactionTypes = this.transactionTypes.filter(x => !x.description.includes('Cancel'));
    }
    this.terrorismCodes$ = this.dropdowns.getTerrorismCodes();
    this.checkAttachmentPointValid();
   // this.checkUnderlyingLimitValid();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
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
    return this.policyInfo.policySymbol.trim().toUpperCase() != 'XS' || this.endorsement.underlyingLimit > 0;
  }
  transactionEffectiveDateIsEditable(): boolean {
    if (this.isCancelSelected() || this.isExtensionDateSelected()) {
      return false;
    } else {
      return true;
    }
  }
  transactionExpirationDateIsEditable(): boolean {
    if (this.isCancelSelected()) {
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
      return this.endorsementHeaderForm.status == "VALID";
    }
    return false;
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }
  get canEditTransactionType(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && this.endorsement.endorsementNumber > 0 && !this.isRewrite
  }
  get canEditTransactionDates(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && this.endorsement.endorsementNumber > 0
  }
  get canEditAttachmentPoint(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && (this.isExcessPolicy);
  }
  get canEditUnderlyingLimits(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && (this.isExcessPolicy);
  }
  private get isPrimaryPolicy(): boolean {
    return (this.policyInfo.policySymbol.trim().toUpperCase() == 'PL') || (this.policyInfo.policySymbol.trim().toUpperCase() == 'PRC')
  }
  private get isExcessPolicy(): boolean {
    return !this.isPrimaryPolicy;
  }
}
