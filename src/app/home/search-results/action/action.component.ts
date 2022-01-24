import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouteReuseStrategy } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CustomReuseStrategy } from 'src/app/app-reuse-strategy';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { PolicyService } from 'src/app/policy/policy.service';
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
  usedEndorsementNumbers!: Code[];
  NewEndorsementResponse!: NewEndorsementData;
  errorMessage = '';
  pipeMessage: string = "";
  showBusy: boolean = false;
  cancelTypes: string[] = [ 'Pro-Rata Cancel', 'Short Rate Cancel', 'Flat Cancel']


  @ViewChild(NgForm, { static: false }) endorsementActionForm!: NgForm;


  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, private router: Router, private routeReuseStrategy: RouteReuseStrategy, public modalService: NgbModal, private actionService: ActionService, private policyService: PolicyService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEdit: boolean) => this.canEdit = canEdit
    );
  }

  async ngOnInit(): Promise<void> {
    // this.endorsementReasons = await this.dropdowns.getEndorsementReasons().toPromise();
    // this.transactionTypes = await this.dropdowns.getTransactionTypes().toPromise();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  @ViewChild('modal') endorsementModal!: TemplateRef<ActionComponent>;
  private modalRef!: NgbModalRef

  async endorsementPopup(endorsementAction: NewEndorsementData, policy: PolicySearchResults): Promise<void> {
    this.policyInfo = policy;
    this.usedEndorsementNumbers = await this.actionService.getEndorsementNumbers(policy.policyId).toPromise();
    this.endorsementReasons = await this.dropdowns.getEndorsementReasons().toPromise();
    this.transactionTypes = await this.dropdowns.getTransactionTypes().toPromise();

    return new Promise<void>(resolve => {
      this.endorsementActionInfo = endorsementAction;
      this.endorsementActionInfo.premium = 0;
      this.endorsementActionInfo.endorsementNumber = this.policyInfo.endorsementNumber
      this.endorsementActionInfo.policyId = this.policyInfo.policyId

      if(this.cancelTypes.includes(policy.transactionType)){
        this.transactionTypes = this.transactionTypes.filter(x => !x.description.includes('Cancel'));
        this.endorsementReasons = this.endorsementReasons.filter(x => !x.description.includes('Cancelled') && !x.description.includes('Flat Cancel & Rewrite'));

      }
      else if(!this.cancelTypes.includes(policy.transactionType)){
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

  checkTransEffectiveDate(): boolean {
    var test = this.endorsementActionInfo.transEffectiveDate.toString().split('-');
    let transEffDate = new Date((parseInt(test[0])), parseInt(test[1]) - 1, parseInt(test[2]), 0, 0, 0, 0)

    var test2 = this.policyInfo.policyEffectiveDate.toString().split('-');
    let polEffDate = new Date((parseInt(test2[0])), parseInt(test2[1]) - 1, parseInt(test2[2]), 0, 0, 0, 0)

    var test3 = this.policyInfo.policyExpirationDate.toString().split('-');
    let polExpDate = new Date((parseInt(test3[0])), parseInt(test3[1]) - 1, parseInt(test3[2]), 0, 0, 0, 0)

    if (transEffDate < polEffDate || transEffDate > polExpDate) {
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
        var test = this.endorsementActionInfo.transEffectiveDate.toString().split('-');
        let transEffectivePlus1 = new Date((parseInt(test[0]) + 1), parseInt(test[1]) - 1, parseInt(test[2]), 0, 0, 0, 0)

        var test2 = this.endorsementActionInfo.transEffectiveDate.toString().split('-');
        let polExpirationPlus1 = new Date((parseInt(test2[0]) + 1), parseInt(test2[1]) - 1, parseInt(test2[2]), 0, 0, 0, 0)

        if (transEffectivePlus1 < polExpirationPlus1) {
          this.endorsementActionInfo.transExpirationDate = transEffectivePlus1;
        } else {
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
    this.isNewEndorsementNumberValid = true;
    if (this.endorsementActionInfo.newEndorsementNumber != undefined) {
      let filteredList = this.usedEndorsementNumbers.filter(x => x.key == this.endorsementActionInfo.newEndorsementNumber);
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
    await this.policyService.createNewEndorsement(this.endorsementActionInfo).toPromise().then(
      endResponse => {
        this.NewEndorsementResponse = endResponse;
        this.routeImport();
        this.modalRef.close()
      }).catch(x => {
        this.pipeMessage = x.error.Message;
        this.triggerModal();
      })
  }

  routeImport() {
    this.showBusy = false;
    if (this.NewEndorsementResponse !== null) {
      (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('information');
      (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('coverages');
      (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('schedules');
      (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('reinsurance');
      (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('summary');

      this.router.navigate(['/policy/' + this.NewEndorsementResponse.policyId.toString() + '/' + this.NewEndorsementResponse.newEndorsementNumber]);
    }
    else {
      this.pipeMessage = this.errorMessage;
      this.triggerModal();
    }
  }

  @ViewChild('modalPipe') modalPipe: any;

  // Modal is used to show import errors
  triggerModal() {
    this.modalService.open(this.modalPipe, { scrollable: true });
  }
}