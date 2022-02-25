import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { ErrorDialogService } from 'src/app/error-handling/error-dialog-service/error-dialog-service';
import { EndorsementNumberResponse } from 'src/app/policy/policy';
import { PolicyService } from 'src/app/policy/policy.service';
import { EndorsementStatusService } from 'src/app/policy/services/endorsement-status.service';
import { NavigationService } from 'src/app/policy/services/navigation.service';
import { NewEndorsementData, PolicySearchResults } from '../policy-search-results';
import { ActionService } from './action.service';


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
  policyInfo!: PolicySearchResults;
  isTransEffectiveValid: boolean = true;
  isTransExpirationValid: boolean = true;
  isNewEndorsementNumberValid: boolean = true;
  usedEndorsementNumbers!: EndorsementNumberResponse[];
  NewEndorsementResponse!: NewEndorsementData;
  errorMessage = '';
  showBusy: boolean = false;
  cancelTypes: string[] = [ 'Pro-Rata Cancel', 'Short Rate Cancel', 'Flat Cancel'];
  isRewrite!: boolean;

  @ViewChild(NgForm, { static: false }) endorsementActionForm!: NgForm;
  @ViewChild('modal') private modalContent!: TemplateRef<ActionComponent>


  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private endorsementStatusService: EndorsementStatusService, private router: Router, public modalService: NgbModal, private actionService: ActionService, private policyService: PolicyService, private navigationService: NavigationService, private errorDialogService: ErrorDialogService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEdit: boolean) => this.canEdit = canEdit
    );
  }

  async ngOnInit(): Promise<void> {

  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  @ViewChild('modal') endorsementModal!: TemplateRef<ActionComponent>;
  private modalRef!: NgbModalRef

  async endorsementPopup(endorsementAction: NewEndorsementData, policy: PolicySearchResults, status: string): Promise<void> {
    this.isRewrite = false;
    this.policyInfo = policy;
    const usedEndorsementNumbers$ =  this.actionService.getEndorsementNumbers(policy.policyId);
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
      this.endorsementActionInfo.preEndorsementStatus = status

      if(status == 'Cancelled'){
        this.transactionTypes = this.transactionTypes.filter(x => !x.description.includes('Cancel'));
        this.endorsementReasons = this.endorsementReasons.filter(x => !x.description.includes('Cancelled') && !x.description.includes('Flat Cancel & Rewrite'));

      }
      else if(status !== 'Cancelled'){
        this.transactionTypes = this.transactionTypes.filter(x => x.description !== 'Reinstatement');
        this.endorsementReasons = this.endorsementReasons.filter(x => x.description !== 'Reinstatement')
      }

      if (policy.masterPolicy !== '1') {
        this.endorsementActionInfo.transExpirationDate = this.policyInfo.policyExpirationDate;
      }
      this.modalRef = this.modalService.open(this.endorsementModal, { backdrop: 'static', centered: true })
      this.modalRef.result.then(resolve, resolve)
    })
  } 
  async backoutPopup(endorsementAction: NewEndorsementData, policy: PolicySearchResults, status: string): Promise<void> {
    this.policyInfo = policy;
    const usedEndorsementNumbers$ =  this.actionService.getEndorsementNumbers(policy.policyId);
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
      this.endorsementActionInfo.preEndorsementStatus = status

      if (this.policyInfo.amount > 0){
        this.endorsementActionInfo.premium = -this.policyInfo.amount
        this.endorsementActionInfo.transactionType = 12;

      }
      if (this.policyInfo.amount < 0){
        this.endorsementActionInfo.premium = Math.abs(this.policyInfo.amount)
        this.endorsementActionInfo.transactionType = 1
      }
      if(status == 'Cancelled'){
        this.transactionTypes = this.transactionTypes.filter(x => !x.description.includes('Cancel'));
        this.endorsementReasons = this.endorsementReasons.filter(x => !x.description.includes('Cancelled') && !x.description.includes('Flat Cancel & Rewrite'));

      }
      else if(status !== 'Cancelled'){
        this.transactionTypes = this.transactionTypes.filter(x => x.description !== 'Reinstatement');
        this.endorsementReasons = this.endorsementReasons.filter(x => x.description !== 'Reinstatement')
      }

      if (policy.masterPolicy !== '1') {
        this.endorsementActionInfo.transExpirationDate = this.policyInfo.policyExpirationDate;
      }
      this.modalRef = this.modalService.open(this.endorsementModal, { backdrop: 'static', centered: true })
      this.modalRef.result.then(resolve, resolve)
    })
  } 

  async cancelRewritePopup(endorsementAction: NewEndorsementData, policy: PolicySearchResults, status: string) {
    this.isRewrite = true;
    this.policyInfo = policy;
    const usedEndorsementNumbers$ =  this.actionService.getEndorsementNumbers(policy.policyId);
    this.usedEndorsementNumbers =  await lastValueFrom(usedEndorsementNumbers$);
    const endorsementReasons$ =  this.dropdowns.getEndorsementReasons();
    this.endorsementReasons =  await lastValueFrom(endorsementReasons$);
    const transactionTypes$ =  this.dropdowns.getTransactionTypes();
    this.transactionTypes =  await lastValueFrom(transactionTypes$);

    return new Promise<void>(resolve => {
      this.endorsementActionInfo = endorsementAction;
      this.endorsementActionInfo.preEndorsementStatus = status
      this.endorsementActionInfo.endorsementNumber = this.policyInfo.endorsementNumber
      this.endorsementActionInfo.isRewrite = true;
      this.endorsementActionInfo.transactionType = 4;
      this.endorsementActionInfo.transEffectiveDate = this.policyInfo.policyEffectiveDate;
      this.endorsementActionInfo.transExpirationDate = this.policyInfo.policyExpirationDate;
      this.endorsementActionInfo.endorsementReason = "PCR";
      ///////check this
      this.endorsementActionInfo.sourcePolicyId = this.policyInfo.policyId
      this.endorsementActionInfo.destinationPolicyId = this.policyInfo.policyId

      if(status == 'Cancelled'){
        this.transactionTypes = this.transactionTypes.filter(x => !x.description.includes('Cancel'));
        this.endorsementReasons = this.endorsementReasons.filter(x => !x.description.includes('Cancelled') && !x.description.includes('Flat Cancel & Rewrite'));

      }
      else if(status !== 'Cancelled'){
        this.transactionTypes = this.transactionTypes.filter(x => x.description !== 'Reinstatement');
        this.endorsementReasons = this.endorsementReasons.filter(x => x.description !== 'Reinstatement')
      }

      this.modalRef = this.modalService.open(this.endorsementModal, { backdrop: 'static', centered: true })
      this.modalRef.result.then(resolve, resolve)
    })  }

  checkTransEffectiveDate(): boolean {

    if (this.endorsementActionInfo.transEffectiveDate < this.policyInfo.policyEffectiveDate || this.endorsementActionInfo.transEffectiveDate  > this.policyInfo.policyExpirationDate) {
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
        if (this.endorsementActionInfo.transExpirationDate < this.policyInfo.policyExpirationDate) {
          this.endorsementActionForm.controls['transExpirationDate'].setErrors({ 'incorrect': true });
          this.isTransExpirationValid = false;
          return false;
        }
      }
    }
    // checking that all expirations date come after the transEffDate
    if (this.endorsementActionInfo.transEffectiveDate != undefined){
      if (this.endorsementActionInfo.transExpirationDate < this.endorsementActionInfo.transEffectiveDate) {
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
        this.errorDialogService.open("Endorsement Error", error.error.Message)
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
      this.errorDialogService.open("Endorsement Error", this.errorMessage)
      .then(() => this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' }));    
    }
  }

}
