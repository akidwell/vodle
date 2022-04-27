import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { EndorsementNumberResponse } from 'src/app/features/policy/models/policy';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { NewEndorsementData, PolicySearchResponses } from '../../models/search-results';
import { EndorsementNumbersService } from '../../services/endorsement-numbers/endorsement-numbers.service';

@Component({
  selector: 'rsps-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {
  endorsementReasons!: Code[];
  transactionTypes!: Code[];
  authSub: Subscription;
  canEdit: boolean = false;
  endorsementActionInfo!: NewEndorsementData;
  policyInfo!: PolicySearchResponses;
  isTransEffectiveValid: boolean = true;
  isTransExpirationValid: boolean = true;
  isNewEndorsementNumberValid: boolean = true;
  usedEndorsementNumbers!: EndorsementNumberResponse[];
  NewEndorsementResponse!: NewEndorsementData;
  errorMessage = '';
  showBusy: boolean = false;
  cancelTypes: string[] = [ 'Pro-Rata Cancel', 'Short Rate Cancel', 'Flat Cancel'];
  isRewrite!: boolean;
  isBackout!: boolean;

  @ViewChild(NgForm, { static: false }) endorsementActionForm!: NgForm;
  @ViewChild('actionModal') private modalContent!: TemplateRef<ActionComponent>
  private modalRef!: NgbModalRef

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService,  private router: Router, public modalService: NgbModal, private endorsementNumbersService: EndorsementNumbersService, private policyService: PolicyService, private navigationService: NavigationService, private messageDialogService: MessageDialogService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEdit: boolean) => this.canEdit = canEdit
    );
  }

  async ngOnInit(): Promise<void> {

  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  async endorsementPopup(endorsementAction: NewEndorsementData, policy: PolicySearchResponses, status: string): Promise<void> {
    this.isRewrite = false;
    this.isBackout = false;

    this.policyInfo = policy;
    const usedEndorsementNumbers$ =  this.endorsementNumbersService.getEndorsementNumbers(policy.policyId);
    this.usedEndorsementNumbers =  await lastValueFrom(usedEndorsementNumbers$);
    const endorsementReasons$ =  this.dropdowns.getEndorsementReasons();
    this.endorsementReasons =  await lastValueFrom(endorsementReasons$);
    const transactionTypes$ =  this.dropdowns.getTransactionTypes();
    this.transactionTypes =  await lastValueFrom(transactionTypes$);

    return new Promise<void>(resolve => {
      this.endorsementActionInfo = endorsementAction;
      this.endorsementActionInfo.premium = 0;
      this.endorsementActionInfo.endorsementNumber = this.policyInfo.endorsementNumber
      this.endorsementActionInfo.sourcePolicyId = this.policyInfo.policyId
      this.endorsementActionInfo.destinationPolicyId = this.policyInfo.policyId

      if(this.policyInfo.policyCancelDate != null){
        this.transactionTypes = this.transactionTypes.filter(x => !x.description.includes('Cancel')  &&  x.description !== 'New Business' && x.description !== 'Renewal Business');
        this.endorsementReasons = this.endorsementReasons.filter(x => !x.description.includes('Cancelled') && !x.description.includes('Flat Cancel & Rewrite'));

      }
      else if(this.policyInfo.policyCancelDate == null){
        this.transactionTypes = this.transactionTypes.filter(x => x.description !== 'Reinstatement' &&  x.description !== 'New Business' && x.description !== 'Renewal Business' );
        this.endorsementReasons = this.endorsementReasons.filter(x => x.description !== 'Reinstatement')
      }

      if (policy.masterPolicy !== '1') {
        if (policy.policyExtendedDate != null) {
          this.endorsementActionInfo.transExpirationDate = policy.policyExtendedDate
        } else {
          this.endorsementActionInfo.transExpirationDate = policy.policyExpirationDate;
        }
      }
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static', centered: true })
      this.modalRef.result.then(resolve, resolve)
    })
  } 
  async backoutPopup(endorsementAction: NewEndorsementData, policy: PolicySearchResponses, status: string): Promise<void> {
    this.policyInfo = policy;
    this.isRewrite = false;
    this.isBackout = true;
    const usedEndorsementNumbers$ =  this.endorsementNumbersService.getEndorsementNumbers(policy.policyId);
    this.usedEndorsementNumbers =  await lastValueFrom(usedEndorsementNumbers$);
    const endorsementReasons$ =  this.dropdowns.getEndorsementReasons();
    this.endorsementReasons =  await lastValueFrom(endorsementReasons$);
    const transactionTypes$ =  this.dropdowns.getTransactionTypes();
    this.transactionTypes =  await lastValueFrom(transactionTypes$);

    return new Promise<void>(resolve => {
      this.endorsementActionInfo = endorsementAction;
      this.endorsementActionInfo.endorsementNumber = this.policyInfo.endorsementNumber
      this.endorsementActionInfo.sourcePolicyId = this.policyInfo.policyId
      this.endorsementActionInfo.destinationPolicyId = this.policyInfo.policyId
      this.endorsementActionInfo.backout = true;

      if (this.policyInfo.amount > 0){
        this.endorsementActionInfo.premium = -this.policyInfo.amount
        this.endorsementActionInfo.transactionType = 12;
      }
      if (this.policyInfo.amount < 0){
        this.endorsementActionInfo.premium = Math.abs(this.policyInfo.amount)
        this.endorsementActionInfo.transactionType = 1
      }
      if(this.policyInfo.policyCancelDate != null){
        this.transactionTypes = this.transactionTypes.filter(x => !x.description.includes('Cancel')  &&  x.description !== 'New Business' && x.description !== 'Renewal Business');
        this.endorsementReasons = this.endorsementReasons.filter(x => !x.description.includes('Cancelled') && !x.description.includes('Flat Cancel & Rewrite'));
      }
      else if(this.policyInfo.policyCancelDate == null){
        this.transactionTypes = this.transactionTypes.filter(x => x.description !== 'Reinstatement' &&  x.description !== 'New Business' && x.description !== 'Renewal Business' );
        this.endorsementReasons = this.endorsementReasons.filter(x => x.description !== 'Reinstatement')
      }

      if (policy.masterPolicy !== '1') {
        if (policy.policyExtendedDate != null) {
          this.endorsementActionInfo.transExpirationDate = policy.policyExtendedDate
        } else {
          this.endorsementActionInfo.transExpirationDate = this.policyInfo.policyExpirationDate;
        }
      }
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static', centered: true })
      this.modalRef.result.then(resolve, resolve)
    })
  } 

  async cancelRewritePopup(endorsementAction: NewEndorsementData, policy: PolicySearchResponses, status: string) {
    this.isRewrite = true;
    this.isBackout = false;

    this.policyInfo = policy;
    const usedEndorsementNumbers$ =  this.endorsementNumbersService.getEndorsementNumbers(policy.policyId);
    this.usedEndorsementNumbers =  await lastValueFrom(usedEndorsementNumbers$);
    const endorsementReasons$ =  this.dropdowns.getEndorsementReasons();
    this.endorsementReasons =  await lastValueFrom(endorsementReasons$);
    const transactionTypes$ =  this.dropdowns.getTransactionTypes();
    this.transactionTypes =  await lastValueFrom(transactionTypes$);

    return new Promise<void>(resolve => {
      this.endorsementActionInfo = endorsementAction;
      this.endorsementActionInfo.endorsementNumber = this.policyInfo.endorsementNumber
      this.endorsementActionInfo.isRewrite = true;
      this.endorsementActionInfo.transactionType = 4;
      this.endorsementActionInfo.transEffectiveDate = this.policyInfo.policyEffectiveDate;
      if (policy.policyExtendedDate != null) {
        this.endorsementActionInfo.transExpirationDate = policy.policyExtendedDate
      } else {
        this.endorsementActionInfo.transExpirationDate = this.policyInfo.policyExpirationDate;
      }
      this.endorsementActionInfo.endorsementReason = "PCR";
      ///////check this
      this.endorsementActionInfo.sourcePolicyId = this.policyInfo.policyId
      this.endorsementActionInfo.destinationPolicyId = this.policyInfo.policyId

      if(this.policyInfo.policyCancelDate != null){
        this.transactionTypes = this.transactionTypes.filter(x => !x.description.includes('Cancel')  &&  x.description !== 'New Business' && x.description !== 'Renewal Business');
        this.endorsementReasons = this.endorsementReasons.filter(x => !x.description.includes('Cancelled') && !x.description.includes('Flat Cancel & Rewrite'));

      }
      else if(this.policyInfo.policyCancelDate == null){
      this.transactionTypes = this.transactionTypes.filter(x => x.description !== 'Reinstatement' &&  x.description !== 'New Business' && x.description !== 'Renewal Business' );
        this.endorsementReasons = this.endorsementReasons.filter(x => x.description !== 'Reinstatement')
      }

      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static', centered: true })
      this.modalRef.result.then(resolve, resolve)
    })  }

  checkTransEffectiveDate(): boolean {
    if (this.endorsementActionInfo.transactionType !== undefined) {
      if (this.endorsementActionInfo.transactionType.toString() == '20') {
        if (!moment(this.endorsementActionInfo.transEffectiveDate).isSame(moment(this.policyInfo.policyExpirationDate).toDate())) {
          this.endorsementActionForm.controls['transEffectiveDate'].setErrors({ 'incorrect': true });
          this.isTransEffectiveValid = false;
          return false;
        }
      }
    }
    if ((moment(this.endorsementActionInfo.transEffectiveDate).toDate() < moment(this.policyInfo.policyEffectiveDate).toDate())
      || (moment(this.endorsementActionInfo.transEffectiveDate).toDate() > moment(this.policyInfo.policyExtendedDate ? this.policyInfo.policyExtendedDate : this.policyInfo.policyExpirationDate).toDate())) {
      this.endorsementActionForm.controls['transEffectiveDate'].setErrors({ 'incorrect': true });
      this.isTransEffectiveValid = false;
      return false;
    }
    this.isTransEffectiveValid = true;
    this.checkMasterPolicy();
    return true;
  }

  checkMasterPolicy(): void {
    if (this.policyInfo.masterPolicy == '1') {
      if (this.endorsementActionInfo.transEffectiveDate !== undefined) {

        let transEffectivePlus1 = new Date(this.endorsementActionInfo.transEffectiveDate);
        transEffectivePlus1.setFullYear(transEffectivePlus1.getFullYear() + 1);

        let polExpirationPlus1 = new Date(this.policyInfo.policyEffectiveDate);
        polExpirationPlus1.setFullYear(polExpirationPlus1.getFullYear() + 1);

        if (transEffectivePlus1 < polExpirationPlus1) {
          this.endorsementActionInfo.transExpirationDate = transEffectivePlus1;
        } else {
          this.endorsementActionInfo.transExpirationDate = polExpirationPlus1;
        }
      }
    }
  }

  checkExpirationDate(): boolean {
    //checking for policy extenstions and that the transExpDate is after the policyExpDate
    if (this.endorsementActionInfo.transactionType !== undefined) {
      if (this.endorsementActionInfo.transactionType.toString() == '20') {
        if (moment(this.endorsementActionInfo.transExpirationDate).toDate() <= moment(this.policyInfo.policyExpirationDate).toDate()) {
          this.endorsementActionForm.controls['transExpirationDate'].setErrors({ 'incorrect': true });
          this.isTransExpirationValid = false;
          return false;
        }
      }
    }
    // checking that all expirations date come after the transEffDate and that trans expiration date is not greater than the policy expiration date
    if (this.endorsementActionInfo.transEffectiveDate != undefined && this.endorsementActionInfo.transactionType.toString() != '20') {
      if ((moment(this.endorsementActionInfo.transExpirationDate).toDate() < moment(this.endorsementActionInfo.transEffectiveDate).toDate())
        || (moment(this.endorsementActionInfo.transExpirationDate).toDate() > moment(this.policyInfo.policyExtendedDate ? this.policyInfo.policyExtendedDate : this.policyInfo.policyExpirationDate).toDate())) {
        this.endorsementActionForm.controls['transExpirationDate'].setErrors({ 'incorrect': true });
        this.isTransExpirationValid = false;
        return false;
      }
    }
    this.isTransExpirationValid = true;
    return true;
  }

  checkEndorsementNumber(): boolean {
    this.isNewEndorsementNumberValid = true;
    if (this.endorsementActionInfo.newEndorsementNumber != undefined) {
      let filteredList = this.usedEndorsementNumbers.filter(x => x.endorsementNumber == this.endorsementActionInfo.newEndorsementNumber);
      if (filteredList.length !== 0) {
        this.endorsementActionForm.controls['newEndorsementNumber'].setErrors({ 'incorrect': true });
        this.isNewEndorsementNumberValid = false;
        return false;
      } else {
        this.isNewEndorsementNumberValid = true;
        return true;
      }
    }
    return true;
  }

  clearAndClose(): void {
    this.isTransEffectiveValid = true
    this.isTransExpirationValid = true;
    this.isNewEndorsementNumberValid = true;
    this.modalRef.close();
  }

  async submit(): Promise<void> {
    this.showBusy = true;
    this.modalRef.close();

    const response$ = this.policyService.createNewEndorsement(this.endorsementActionInfo);
    await lastValueFrom(response$)
      .then((endResponse) => {
        this.modalRef.close()
        this.NewEndorsementResponse = endResponse;
        this.routeEndorsement();
      })
      .catch((error) => {
        this.modalRef.close()
        this.showBusy = false;
        this.messageDialogService.open("Endorsement Error", error.error.Message)
          .then(() => this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' }));
      });
  }

  routeEndorsement() {
    this.showBusy = false;
    if (this.NewEndorsementResponse !== null) {
      this.navigationService.resetPolicy();
      this.router.navigate(['/policy/' + this.NewEndorsementResponse.destinationPolicyId.toString() + '/' + this.NewEndorsementResponse.newEndorsementNumber]);
    }
    else {
      this.showBusy = false;
      this.messageDialogService.open("Endorsement Error", this.errorMessage)
      .then(() => this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' }));    
    }
  }

}
