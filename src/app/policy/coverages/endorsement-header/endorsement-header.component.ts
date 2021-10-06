import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { Endorsement, PolicyInformation } from '../../policy';
import { PolicyService } from '../../policy.service';

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
  transactionEffectiveDateValid: boolean = true;
  transactionExpirationDateValid: boolean = true;
  sirReadonly: boolean = false;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private dropdowns: DropDownsService, private policyService: PolicyService,private datePipe: DatePipe) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  @ViewChild('endorsementHeaderForm') endorsementCoveragesForm!: NgForm;
  
  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsement = data['endorsementData'].endorsement;
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.sirReadonly = this.policyInfo.programId != 92 && this.policyInfo.programId != 94;
      console.log(this.endorsement);
    });

    this.transactionTypes$ = this.dropdowns.getTransactionTypes();
    this.terrorismCodes$ = this.dropdowns.getTerrorismCodes();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }

  saveEndorsement(): any{
    this.endSub = this.policyService.updateEndorsement(this.endorsement).subscribe();
  }

  changeEffectiveDate() {
    if (this.endorsement.endorsementNumber == 0 && this.endorsement.transactionEffectiveDate) {
      this.transactionEffectiveDateValid = this.datePipe.transform(this.endorsement.transactionEffectiveDate, 'yyyyMMdd') == this.datePipe.transform(this.policyInfo.policyEffectiveDate, 'yyyyMMdd');
      if (this.transactionEffectiveDateValid) {
        this.endorsementCoveragesForm.controls['endorsementEffectiveDate'].markAsPristine();
      }
      else {
        this.endorsementCoveragesForm.controls['endorsementEffectiveDate'].setErrors({ 'incorrect': !this.transactionEffectiveDateValid });
      }
    }
  }

  changeExpirationDate() {
    if (this.endorsement.endorsementNumber == 0 && this.endorsement.transactionExpirationDate) {
      this.transactionExpirationDateValid = this.datePipe.transform(this.endorsement.transactionExpirationDate, 'yyyyMMdd') == this.datePipe.transform(this.policyInfo.policyExpirationDate, 'yyyyMMdd');
      if (this.transactionExpirationDateValid) {
        this.endorsementCoveragesForm.controls['endorsementExpirationDate'].markAsPristine();
      }
      else {
        this.endorsementCoveragesForm.controls['endorsementExpirationDate'].setErrors({ 'incorrect': !this.transactionExpirationDateValid });
      }
    }
  }

}
