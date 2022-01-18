import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { EndorsementAction, PolicySearchResults } from '../policy-search-results';
import { ActionService } from './action.service';


@Component({
  selector: 'rsps-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

  endorsementReasons$: Observable<Code[]> | undefined;
  transactionTypes$: Observable<Code[]> | undefined;
  authSub: Subscription;
  canEdit: boolean = false;
  endorsementActionInfo!: EndorsementAction;
  policyInfo!: PolicySearchResults;
  isTransEffectiveValid: boolean = true;
  isTransExpirationValid: boolean = true;
  isEndorsementNumberValid: boolean = true;
  usedEndorsementNumbers!: Code[];


  @ViewChild(NgForm, { static: false }) endorsementActionForm!: NgForm;


  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, public modalService: NgbModal, private actionService: ActionService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEdit: boolean) => this.canEdit = canEdit
    );
  }

  ngOnInit(): void {
    this.endorsementReasons$ = this.dropdowns.getEndorsementReasons();
    this.transactionTypes$ = this.dropdowns.getTransactionTypes();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  @ViewChild('modal') endorsementModal!: TemplateRef<ActionComponent>;
  private modalRef!: NgbModalRef

  async endorsementPopup(endorsementAction: EndorsementAction, policy: PolicySearchResults): Promise<void> {
    this.policyInfo = policy;
    this.usedEndorsementNumbers = await this.actionService.getEndorsementNumbers(policy.policyId).toPromise();

    return new Promise<void>(resolve => {
      this.endorsementActionInfo = endorsementAction;
      this.endorsementActionInfo.premium = 0;

      if (policy.masterPolicy !== '1') {
        this.endorsementActionInfo.transExpirationDate = this.policyInfo.policyExpirationDate;
      }
      this.modalRef = this.modalService.open(this.endorsementModal, { backdrop: 'static', centered: true })
      this.modalRef.result.then(resolve, resolve)
    })
  }

  checkTransEffectiveDate(): boolean {
    if (this.endorsementActionInfo.transEffectiveDate < this.policyInfo.policyEffectiveDate || this.endorsementActionInfo.transEffectiveDate > this.policyInfo.policyExpirationDate) {
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
        let transEffectivePlus1 = new Date(this.endorsementActionInfo.transEffectiveDate)
        transEffectivePlus1.setFullYear(transEffectivePlus1.getFullYear() + 1)

        let polExpirationPlus1 = new Date(this.policyInfo.policyExpirationDate)
        polExpirationPlus1.setFullYear(polExpirationPlus1.getFullYear() +1)

        if (transEffectivePlus1 < polExpirationPlus1) {
          this.endorsementActionInfo.transExpirationDate = transEffectivePlus1;
        }  else {
          this.endorsementActionInfo.transExpirationDate = polExpirationPlus1;
        }
      }
    }
  }

  checkPolicyExtenstionExpirationDate(): boolean {
    if (this.endorsementActionInfo.transactionType !== undefined) {
      if (this.endorsementActionInfo.transactionType.toString() == '20') {
        if (this.endorsementActionInfo.transExpirationDate < this.policyInfo.policyExpirationDate) {
          this.endorsementActionForm.controls['transExpirationDate'].setErrors({ 'incorrect': true });
          this.isTransExpirationValid = false;
          return false;
        }
      }
      this.isTransExpirationValid = true;
      return true;
    }
    return true;
  }

  checkEndorsementNumber(): boolean {
    this.isEndorsementNumberValid = true;
    if (this.endorsementActionInfo.endorsementNumber != undefined) {
      let filteredList = this.usedEndorsementNumbers.filter(x => x.key == this.endorsementActionInfo.endorsementNumber);
      if (filteredList.length !== 0) {
        this.endorsementActionForm.controls['endorsementNumber'].setErrors({ 'incorrect': true });
        this.isEndorsementNumberValid = false;
        return false;
      } else {
        this.isEndorsementNumberValid = true;
        return true;
      }
    }
    return true;
  }
}