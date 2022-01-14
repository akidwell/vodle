import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { NotificationService } from 'src/app/notification/notification-service';
import { Endorsement, PolicyInformation } from '../../policy';
import { PolicyService } from '../../policy.service';
import { EndorsementStatusService } from '../../services/endorsement-status.service';

@Component({
  selector: 'rsps-endorsement-header',
  templateUrl: './endorsement-header.component.html',
  styleUrls: ['./endorsement-header.component.css']
})
export class EndorsementHeaderComponent implements OnInit {
  endorsement!: Endorsement;
  policyInfo!: PolicyInformation;
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

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private dropdowns: DropDownsService, private policyService: PolicyService, private datePipe: DatePipe, private notification: NotificationService, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  @ViewChild('endorsementHeaderForm', { static: false }) endorsementHeaderForm!: NgForm;

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsement = data['endorsementData'].endorsement;
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;  
      }
    });
    this.transactionTypes$ = this.dropdowns.getTransactionTypes();
    this.terrorismCodes$ = this.dropdowns.getTerrorismCodes();
    this.isAttachmentPointValid = this.checkAttachmentPointValid();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
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

  save(): boolean {
    if (this.canEditPolicy && this.endorsementHeaderForm.dirty) {
      if (this.endorsementHeaderForm.status != "VALID") {
        this.notification.show('Endorsesement Header not saved.', { classname: 'bg-danger text-light', delay: 5000 });
        return false;
      }

      this.endSub = this.policyService.updateEndorsement(this.endorsement).subscribe(result => {
        this.endorsementHeaderForm.form.markAsPristine();
        this.endorsementHeaderForm.form.markAsUntouched();
        this.notification.show('Endorsesement Header successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        return result;
      });
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

  get isPrimaryPolicy(): boolean{
    return  (this.policyInfo.policySymbol == 'PL ') || (this.policyInfo.policySymbol =='PRC')
}
}
