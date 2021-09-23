import { Component, OnInit } from '@angular/core';
import { AccountInformation, PolicyInformation, QuoteData, RiskLocation } from 'src/app/policy/policy';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { Observable, Subscription } from 'rxjs';
import { Code } from 'src/app/drop-downs/code';
import { UserAuth } from 'src/app/authorization/user-auth';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/config/config.service';
import { tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/notification/notification-service';

@Component({
  selector: 'rsps-policy-information',
  templateUrl: './policy-information.component.html',
  styleUrls: ['./policy-information.component.css']
})
export class PolicyInformationComponent implements OnInit {
  isReadOnly: boolean = true;
  policyCollapsed = false;
  faPlus = faAngleUp;
  faMinus = faAngleDown;
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

  constructor(private route: ActivatedRoute, private dropdowns: DropDownsService, private userAuth: UserAuth, private http: HttpClient, private config: ConfigService,private notification: NotificationService) {
     // GAM - TEMP -Subscribe
     this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

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
    this.savePolicyInfo = this.savePolicyInfo;
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  savePolicyInfo(): any{
    let call = this.http.put<PolicyInformation>(this.config.apiBaseUrl + 'api/policies/PolicyInfo', this.policyInfo)
    .pipe(
      tap(r => {
        console.log(r);
        this.notification.show('Policy successfully saved.', { classname: 'bg-success text-light', delay: 5000});
      }),
      )
      call.subscribe();
      return call;
  }
}
