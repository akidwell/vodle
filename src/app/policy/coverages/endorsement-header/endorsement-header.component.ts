import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { Endorsement, PolicyInformation } from '../../policy';
import { EndorsementStatusService } from '../../services/endorsement-status.service';
import { UpdatePolicyChild } from '../../services/update-child.service';

@Component({
  selector: 'rsps-endorsement-header',
  templateUrl: './endorsement-header.component.html',
  styleUrls: ['./endorsement-header.component.css']
})
export class EndorsementHeaderComponent implements OnInit {
  isReadOnly: boolean = true;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  transactionTypes$: Observable<Code[]> | undefined;
  terrorismCodes$: Observable<Code[]> | undefined;
  endSub: Subscription | undefined;
  isTransactionEffectiveDateValid: boolean = true;
  isTransactionExpirationDateValid: boolean = true;
  canEditEndorsement: boolean = false;
  statusSub!: Subscription;
  isAttachmentPointValid: boolean = false;

  @Input() public endorsement!: Endorsement;
  @Input() public policyInfo!: PolicyInformation;
  
  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private datePipe: DatePipe, private endorsementStatusService: EndorsementStatusService, private updatePolicyChild: UpdatePolicyChild) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  @ViewChild('endorsementHeaderForm', { static: false }) endorsementHeaderForm!: NgForm;

  ngOnInit(): void {
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    this.transactionTypes$ = this.dropdowns.getTransactionTypes();
    this.terrorismCodes$ = this.dropdowns.getTerrorismCodes();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
    this.endSub?.unsubscribe();
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }

  checkAttachmentPointValid(): boolean {
    if ((this.policyInfo.policySymbol == 'PL ') || (this.policyInfo.policySymbol == 'PRC')) {
      this.isAttachmentPointValid = true;
      return this.isAttachmentPointValid;
    } else {
      if (this.endorsement.attachmentPoint >= this.endorsement.underlyingLimit) {
        this.isAttachmentPointValid = true;
      } else {
        this.isAttachmentPointValid = false;
        this.endorsementHeaderForm.controls['attachmentPoint'].setErrors({ 'incorrect': this.isAttachmentPointValid });
      }
      return this.isAttachmentPointValid;
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
    if (this.endorsement.endorsementNumber == 0 && this.endorsement.transactionExpirationDate) {
      this.isTransactionExpirationDateValid = this.datePipe.transform(this.endorsement.transactionExpirationDate, 'yyyyMMdd') == this.datePipe.transform(this.policyInfo.policyExpirationDate, 'yyyyMMdd');
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
    return this.canEditEndorsement && this.canEditPolicy && this.endorsement.endorsementNumber > 0
  }
  get canEditTransactionDates(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && this.endorsement.endorsementNumber > 0
  }
  get canEditAttachmentPoint(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && (this.endorsementStatusService.directQuote || !this.isPrimaryPolicy);
  }
  get canEditUnderlyingLimits(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && (this.endorsementStatusService.directQuote || !this.isPrimaryPolicy);
  }
  private get isPrimaryPolicy(): boolean {
    return (this.policyInfo.policySymbol == 'PL ') || (this.policyInfo.policySymbol == 'PRC')
  }
}
