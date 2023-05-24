import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { AdditionalNamedInsured, PolicyANIClass, coverageANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { PolicySavingService } from '../../../services/policy-saving-service/policy-saving.service';

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


  accountCollapsed= false;

  constructor(private route: ActivatedRoute,private dropdowns: DropDownsService, private userAuth: UserAuth, private notification: NotificationService, private reinsuranceLookupService: ReinsuranceLookupService,
    private endorsementStatusService: EndorsementStatusService,private pageDataService: PageDataService, private policyService: PolicyService, private policySavingService: PolicySavingService) {
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

    this.coveragesSub = this.coverageCodes$.subscribe({
      next: codes => {
        this.coverageCodesList = codes;
        this.policyInfo.coverageCodesList = this.coverageCodesList;
        this.policyInfo.determineClaimsMadeOccurrence();
      }
    }
    );
    console.log(this.policyInfo.canSetCancelDate);
    this.saveSub = this.policySavingService.isSaving$.subscribe(
      (isSaving) => (this.showBusy = isSaving)
    );
  }
  changeProgramId() {
    if (this.policyInfo.endorsement.endorsementNumber == 0) {
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
    if (this.policyInfo.endorsement.endorsementNumber == 0) {
      // Force Reinsurance drop downs to refresh
      this.reinsuranceLookupService.clearReinsuranceCodes();
      this.reinsuranceLookupService.refreshReinsuranceCodes();
    }
  }

  isDirectQuoteFieldReadOnly(): boolean{
    if(this.canEdit && this.endorsementStatusService.directQuote) {
      return false;
    } else {
      return true;
    }
  }

  isFieldReadOnly(checkEndorsementLockStatus?: boolean): boolean {
    if(!checkEndorsementLockStatus) {
      return !this.canEdit;
    } else {
      return !this.canEdit;
    }
  }
  changeState(state: State) {
    this.policyInfo.riskLocation.countryCode = state.countryCode;
  }

  getAlerts(): string | null{
    let alert = 'Following fields are invalid: ';
    this.policyInfo.errorMessages.map(x => {
      alert += '<br><li>' + x.message ;
    });
    return alert;
  }

}
