import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AccountInformation, Endorsement, PolicyInformation, QuoteData, RiskLocation } from 'src/app/policy/policy';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { Observable, Subscription, tap } from 'rxjs';
import { Code } from 'src/app/drop-downs/code';
import { UserAuth } from 'src/app/authorization/user-auth';
import { NotificationService } from 'src/app/notification/notification-service';
import { NgForm } from '@angular/forms';
import { EndorsementStatusService } from '../../services/endorsement-status.service';
import { DatePipe } from '@angular/common';
import { TransactionTypes } from '../../transaction-types';

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
  programs$: Observable<Code[]> | undefined;
  policySymbols$: Observable<Code[]> | undefined;
  claimsMadeOrOccurrence$: Code[] = [];
  authSub: Subscription;
  productRecallCovCodes: string[] = ['20 ', '21 ', '22 ', '92 ', '93 ', '94 ', '98 ']
  policySub!: Subscription;
  dereg!: boolean;
  assumed!: boolean;
  //canEditEndorsement is a check to see if the endorsement is able to be edited
  canEditEndorsement: boolean = false;
  //canEditPolicy is a check to see if the user is able to edit
  canEditPolicy: boolean = false;
  statusSub!: Subscription;
  coveragesSub!: Subscription;
  endorsementChanged: boolean = false;
  endorsementSub!: Subscription;
  canSetRetroDate: boolean = false;
  canSetClaimsMadeOccurrence: boolean = false;
  coverageCodesList: Code[] = [];

  isPolicyEffectiveDateInvalid: boolean = false;
  PolicyEffectiveDateError: string = "";
  isPolicyExpirationDateInvalid: boolean = false;
  PolicyExpirationDateError: string = "";

  @ViewChild(NgForm, { static: false }) policyInfoForm!: NgForm;
  @ViewChild(NgForm) form: NgForm | undefined;
  @Input() public endorsement!: Endorsement;
  @Input() public policyInfo!: PolicyInformation;
  @Input() public accountInfo!: AccountInformation;
  @Input() public lockEndorsementFields!: boolean;

  constructor(private dropdowns: DropDownsService, private userAuth: UserAuth, private notification: NotificationService,
    private endorsementStatusService: EndorsementStatusService, private datePipe: DatePipe) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
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

    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    this.coveragesSub = this.coverageCodes$.subscribe({
      next: codes => {
        this.coverageCodesList = codes;
        this.determineClaimsMadeOccurrence();
      }
    })
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
    this.endorsementSub?.unsubscribe();
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }

  isValid(): boolean {
    const effectiveDate = Number(this.datePipe.transform(this.policyInfo.policyEffectiveDate, 'yyyyMMdd'));
    const expirationDate = Number(this.datePipe.transform(this.policyInfo.policyExpirationDate, 'yyyyMMdd'));

    return effectiveDate < expirationDate && this.policyInfoForm.status == 'VALID';
  }

  ErrorMessages(): string[] {
    const effectiveDate = Number(this.datePipe.transform(this.policyInfo.policyEffectiveDate, 'yyyyMMdd'));
    const expirationDate = Number(this.datePipe.transform(this.policyInfo.policyExpirationDate, 'yyyyMMdd'));
    const errorMessages: string[] = [];

    if (effectiveDate >= expirationDate) {
      errorMessages.push("Expiration Date must be after the Effective Date");
    }
    return errorMessages;
  }
  allowEndorsementSave(): boolean {
    if (this.endorsementChanged) {
      this.endorsementChanged = false;
      return true;
    }
    return false;
  }
  allowSave(): boolean {
    if (this.canEditPolicy && this.policyInfoForm.dirty) {
      if (this.policyInfoForm.status != "VALID") {
        this.notification.show('Policy Information not saved.', { classname: 'bg-danger text-light', delay: 5000 });
        return false;
      }
      return true;
    }
    return false;
  }

  checkDereg(): boolean{
    return this.dereg = this.policyInfo.deregulationIndicator == 'F'? true : false;
  }
  checkAssumed(): boolean{
   return this.assumed = this.policyInfo.riskType == 'A'? true : false;
  }
  ChangePolicyNumber() {
    this.policyInfo.formattedPolicyNo = this.policyInfo.policyNo + (this.policyInfo.formattedPolicyNo.charAt(this.policyInfo.formattedPolicyNo.length-3) == "-" ? this.policyInfo.formattedPolicyNo.slice(-3) : "");
  }
  changeEffectiveDate() {
    if (this.endorsement.endorsementNumber == 0) {
      this.endorsementChanged = true;
      this.endorsementStatusService.reinsuranceValidated = false;
      this.endorsement.transactionEffectiveDate = this.policyInfo.policyEffectiveDate;
    }
  }
  changeExpirationDate() {
    if (this.endorsement.endorsementNumber == 0) {
      this.endorsementChanged = true;
      this.endorsementStatusService.reinsuranceValidated = false;
      this.endorsement.transactionExpirationDate = this.policyInfo.policyExpirationDate;
    }
  }
  changeProgramId() {
    if (this.endorsement.endorsementNumber == 0) {
      this.endorsementStatusService.reinsuranceValidated = false;
    }
  }

  clearNYFTZ() {
    this.policyInfo.nyftz = null;
  }
  clearAssumed() {
    this.policyInfo.assumedCarrier = null;
  }
  populateClaimsMadeOccurrence() {
    this.claimsMadeOrOccurrence$ = [];
    this.claimsMadeOrOccurrence$.push({ code: "C", key: 0, description: "Claims-Made" });
    this.claimsMadeOrOccurrence$.push({ code: "O", key: 1, description: "Occurrence" });
  }

  isExtensionDateActive(): boolean {
    if (this.canEdit && this.lockEndorsementFields && this.endorsement.transactionTypeCode === TransactionTypes.PolicyExtensionByEndt) {
      return true;
    } else {
      return false;
    }
  }
  isRetroDateActive(): boolean {
    if (this.canSetRetroDate && !this.isFieldReadOnly(true)) {
      return true;
    } else {
      return false;
    }
  }
  isClaimsMadeOccurrenceActive(): boolean{
    if (this.canSetClaimsMadeOccurrence && !this.isFieldReadOnly(true)) {
      return true;
    } else {
      return false;
    }
  }
  isCancelDateActive(): boolean {
    if (this.canEdit && this.lockEndorsementFields && this.isCancelEndorsement(this.endorsement.transactionTypeCode)) {
      return true;
    } else {
      return false;
    }
  }
  isFieldReadOnly(checkEndorsementLockStatus: boolean): boolean {
    if(!checkEndorsementLockStatus) {
      return !this.canEdit;
    } else {
      if (this.lockEndorsementFields) {
        return true;
      } else {
        return !this.canEdit;
      }
    }
  }
  isDirectQuoteFieldReadOnly(): boolean{
    if(this.canEdit && this.endorsementStatusService.directQuote) {
      return false;
    } else {
      return true;
    }
  }
  async determineClaimsMadeOccurrence(){
    var coverageCode = this.policyInfo.quoteData.coverageCode;
    var coverageDetermined = false;
    var coverageDescription = this.findCoverageCodeDescription(coverageCode);
    coverageDetermined = this.isCoverageCodeClaimsMade(coverageDescription) || this.isCoverageCodeOccurrence(coverageDescription);
    if (!coverageDetermined) {
      this.canSetClaimsMadeOccurrence = true;
      this.policyInfo.quoteData.claimsMadeOrOccurrence = 'O';
    } else {
      this.canSetClaimsMadeOccurrence = false;
    }
  }
  isCoverageCodeClaimsMade(coverageDescription: string): boolean {
    if (coverageDescription.includes(' CLM')){
      this.canSetRetroDate = true;
      this.policyInfo.quoteData.claimsMadeOrOccurrence = 'C';
      return true;
    } else {
      this.canSetRetroDate = false;
      this.policyInfo.quoteData.retroDate = null;
      return false;
    }
  }

  isCoverageCodeOccurrence(coverageCode: string): boolean {
    if (coverageCode.includes(' OCC' || coverageCode.includes('Occurrence Form'))){
      this.policyInfo.quoteData.claimsMadeOrOccurrence = 'O';
      this.policyInfo.quoteData.retroDate = null;
      return true;
    } else {
      return false;
    }
  }
  changeClaimsMadeOccurrence() {
    this.policyInfo.quoteData.retroDate = null;
    if (this.policyInfo.quoteData.claimsMadeOrOccurrence == 'C') {
      this.canSetRetroDate = true;
    } else {
      this.canSetRetroDate = false;
    }
  }
  findCoverageCodeDescription(coverageCode: string): string {
    return this.coverageCodesList.find(x => x.code == coverageCode)?.description || ''
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy;
  }
  isCancelEndorsement(transType: number):boolean {
    if (transType === TransactionTypes.FlatCancel || transType === TransactionTypes.CancellationOfPolicyExtension
      || transType === TransactionTypes.ProRataCancel || transType === TransactionTypes.ShortRateCancel) {
      return true;
    } else {
      return false;
    }
  }
}
