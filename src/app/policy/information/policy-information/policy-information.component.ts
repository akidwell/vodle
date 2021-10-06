import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountInformation, PolicyInformation, QuoteData, RiskLocation } from 'src/app/policy/policy';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { Observable, Subscription } from 'rxjs';
import { Code } from 'src/app/drop-downs/code';
import { UserAuth } from 'src/app/authorization/user-auth';
import { tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/notification/notification-service';
import { NgForm } from '@angular/forms';
import { PolicyService } from '../../policy.service';

@Component({
  selector: 'rsps-policy-information',
  templateUrl: './policy-information.component.html',
  styleUrls: ['./policy-information.component.css']
})
export class PolicyInformationComponent implements OnInit {
  isReadOnly: boolean = true;
  policyCollapsed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  accountInfo!: AccountInformation;
  policyInfo!: PolicyInformation;
  quoteData!: QuoteData;
  riskLocation!: RiskLocation;
  pacCodes$: Observable<Code[]> | undefined;
  riskGrades$: Observable<Code[]> | undefined;
  states$: Observable<Code[]> | undefined;
  carrierCodes$: Observable<Code[]> | undefined;
  coverageCodes$: Observable<Code[]> | undefined;
  auditCodes$: Observable<Code[]> | undefined;
  paymentFrequencies$: Observable<Code[]> | undefined;
  deregulationIndicators$: Observable<Code[]> | undefined;
  riskTypes$: Observable<Code[]> | undefined;
  nyFreeTradeZones$: Observable<Code[]> | undefined;
  assumedCarriers$: Observable<Code[]> | undefined;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  productRecallCovCodes: string[] = ['20 ', '21 ', '22 ', '92 ', '93 ', '94 ', '98 ']
  policySub!: Subscription;
  dereg!: boolean;
  assumed!: boolean;

  @ViewChild(NgForm, { static: false }) policyInfoForm!: NgForm;

  constructor(private route: ActivatedRoute, private dropdowns: DropDownsService, private userAuth: UserAuth, private policyService: PolicyService, private notification: NotificationService) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  // @ViewChild(NgForm) form: NgForm | undefined;
  
  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.accountInfo = data['accountData'].accountInfo;
      this.policyInfo = data['policyInfoData'].policyInfo;
    });


    this.pacCodes$ = this.dropdowns.getPACCodes();
    this.riskGrades$ = this.dropdowns.getRiskGrades(this.policyInfo.programId);
    this.states$ = this.dropdowns.getStates();
    this.carrierCodes$ = this.dropdowns.getCarrierCodes();
    this.coverageCodes$ = this.dropdowns.getCoverageCodes();
    this.auditCodes$ = this.dropdowns.getAuditCodes();
    this.paymentFrequencies$ = this.dropdowns.getPaymentFrequencies();
    this.deregulationIndicators$ = this.dropdowns.getDeregulationIndicators();
    this.riskTypes$ = this.dropdowns.getRiskTypes();
    this.nyFreeTradeZones$ = this.dropdowns.getNYFreeTradeZones();
    this.assumedCarriers$ = this.dropdowns.getAssumedCarriers();
    // Check with Amber 
    //this.savePolicyInfo = this.savePolicyInfo;
  }

  ngAfterViewInit() : void {
    this.policyInfoForm?.statusChanges?.subscribe(() => {
      console.log("Is form dirty yet: " + this.policyInfoForm.dirty);
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  savePolicyInfo(): any {
    if (this.policyInfoForm.status != "VALID") {
      this.notification.show('Policy not saved.', { classname: 'bg-danger text-light', delay: 5000 });
      return;
    }

    this.policySub = this.policyService.updatePolicyInfo(this.policyInfo).subscribe(result => {
        this.notification.show('Policy successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
    });
  }
  checkDereg(): boolean{
    return this.dereg = this.policyInfo.deregulationIndicator == 'F'? true : false;
  }
  checkAssumed(): boolean{
   return this.assumed = this.policyInfo.riskType == 'A'? true : false;
  }
}