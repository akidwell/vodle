import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { Code } from 'src/app/core/models/code';
import { State } from 'src/app/core/models/state';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ReinsuranceLookupService } from 'src/app/features/policy/services/reinsurance-lookup/reinsurance-lookup.service';
import { PolicyClass } from '../../../classes/policy-class';
import { EndorsementStatusService } from 'src/app/features/policy/services/endorsement-status/endorsement-status.service';
import { PolicyANIClass } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { PolicySavingService } from '../../../services/policy-saving-service/policy-saving.service';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { SubmissionService } from 'src/app/features/submission/services/submission-service/submission-service';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { HistoricRoute } from 'src/app/core/models/historic-route';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';

@Component({
  selector: 'rsps-policy-information-v2',
  templateUrl: './policy-information-v2.component.html',
  styleUrls: ['./policy-information-v2.component.css']
})
export class PolicyInformationV2Component {
  //use this after sent to issuance to mark all fields as read only
  isReadOnly = false;
  policyCollapsed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  pacCodes$: Observable<Code[]> | undefined;
  riskGrades$: Observable<Code[]> | undefined;
  states$: Observable<State[]> | undefined;
  carrierCodes$: Observable<Code[]> | undefined;
  coverageCodes$: Observable<Code[]> | undefined;
  auditCodes$: Observable<Code[]> | undefined;
  paymentFrequencies$: Observable<Code[]> | undefined;
  deregulationIndicators$: Observable<Code[]> | undefined;
  riskTypes$: Observable<Code[]> | undefined;
  nyFreeTradeZones$: Observable<Code[]> | undefined;
  assumedCarriers$: Observable<Code[]> | undefined;
  programs$: Observable<Code[]> | undefined;
  policySymbols$: Observable<Code[]> | undefined;
  claimsMadeOrOccurrence$: Code[] = [];
  authSub!: Subscription;
  productRecallCovCodes: string[] = ['20 ', '21 ', '22 ', '92 ', '93 ', '94 ', '98 '];
  policySub!: Subscription;
  dereg!: boolean;
  assumed!: boolean;
  canEdit = false;
  statusSub!: Subscription;
  coveragesSub!: Subscription;
  endorsementChanged = false;
  endorsementSub!: Subscription;
  coverageCodesList: Code[] = [];
  policyInfo!: PolicyClass;
  canSetRetroDate = false;
  canSetClaimsMadeOccurrence = false;
  newInsuredANI!: PolicyANIClass;
  aniData!: PolicyANIClass[];
  showBusy = false;
  saveSub!: Subscription;
  programSub!: Subscription;
  underwriterName: string | null = '';
  prevSub!: Subscription;
  previousUrl = '';
  previousLabel = 'Previous';
  policyInfoErrors: ErrorMessage[] = [];


  accountCollapsed= false;
  showErrors = false;

  constructor(private route: ActivatedRoute,
    private dropdowns: DropDownsService,
    private userAuth: UserAuth,
    private notification: NotificationService,
    private reinsuranceLookupService: ReinsuranceLookupService,
    private endorsementStatusService: EndorsementStatusService,
    private pageDataService: PageDataService,
    private policyService: PolicyService,
    private submissionService: SubmissionService,
    private previousRouteService: PreviousRouteService,
    private policySavingService: PolicySavingService,
    private router: Router,
    private navigationService: NavigationService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEdit: boolean) => this.canEdit = canEdit
    );
    this.newInsuredANI = new PolicyANIClass();
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.policyInfo.producer = data['policyInfoData'].policyInfo.producer;
      this.policyInfo.insured = data['policyInfoData'].policyInfo.insured;
      this.aniData = data['policyInfoData'].policyInfo.additionalNamedInsuredData;
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
    this.programs$ = this.dropdowns.getPrograms();
    this.policySymbols$ = this.dropdowns.getPolicySymbols();
    this.populateClaimsMadeOccurrence();
    this.submissionService.getSubmission(this.policyInfo.submissionNumber).subscribe(submission => {
      this.underwriterName = submission.underwriterName;
    })

    console.log(this.policyInfo.policyEventCode);

    this.coveragesSub = this.coverageCodes$.subscribe({
      next: codes => {
        this.coverageCodesList = codes;
        this.policyInfo.coverageCodesList = this.coverageCodesList;
        this.policyInfo.determineClaimsMadeOccurrence();
      }
    }
    );

    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    });
    console.log(this.policyInfo.canSetCancelDate);
    this.saveSub = this.policySavingService.isSaving$.subscribe(
      (isSaving) => (this.showBusy = isSaving)
    );
  }
  changeProgramId() {
    if (this.policyInfo.endorsementData.endorsementNumber == 0) {
      // Force Reinsurance drop downs to refresh
      this.reinsuranceLookupService.clearReinsuranceCodes();
      this.reinsuranceLookupService.refreshReinsuranceCodes();
    }
  }
  populateClaimsMadeOccurrence() {
    this.claimsMadeOrOccurrence$ = [];
    this.claimsMadeOrOccurrence$.push({ code: 'C', key: 0, description: 'Claims-Made' });
    this.claimsMadeOrOccurrence$.push({ code: 'O', key: 1, description: 'Occurrence' });
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }
  changeEffectiveDate() {
    if (this.policyInfo.endorsementData.endorsementNumber == 0) {
      // Force Reinsurance drop downs to refresh
      this.reinsuranceLookupService.clearReinsuranceCodes();
      this.reinsuranceLookupService.refreshReinsuranceCodes();
    }
  }
  changeState(state: State) {
    this.policyInfo.riskLocation.countryCode = state.countryCode;
  }

  getAlerts(): string | null{
    let alert = 'The following fields are invalid: ';
    this.policyInfo.getTabErrors('PolicyInfo').map(x => {
      alert += '<br><li>' + x.message ;
    });
    return alert;
  }

  routeToInsured(insuredCode: number | null) {
    if(insuredCode !== null) {
      this.navigationService.clearReuse();
      const subRoute: HistoricRoute = this.createRoute(this.policyInfo);
      this.pageDataService.lastPolicy = subRoute;
      this.router.navigate(['/insured/' + insuredCode.toString() + '/information']);
    }
  }
  private createRoute(val: PolicyClass): HistoricRoute {
    return {
      url: '/policy-v2/' + val.policyId?.toString() + '/' + val.endorsementData.endorsementNumber?.toString() + '/information',
      type: 'policy-v2',
      description: 'policy-v2 ' + val.policyId,
    };
  }
}
