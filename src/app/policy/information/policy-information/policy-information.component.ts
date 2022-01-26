import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AccountInformation, Endorsement, PolicyInformation, QuoteData, RiskLocation } from 'src/app/policy/policy';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { Observable, Subscription } from 'rxjs';
import { Code } from 'src/app/drop-downs/code';
import { UserAuth } from 'src/app/authorization/user-auth';
import { NotificationService } from 'src/app/notification/notification-service';
import { NgForm } from '@angular/forms';
import { EndorsementStatusService } from '../../services/endorsement-status.service';
import { DatePipe } from '@angular/common';

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
  canEditPolicy: boolean = false;
  claimsMadeOrOccurrence$: Code[] = [];
  authSub: Subscription;
  productRecallCovCodes: string[] = ['20 ', '21 ', '22 ', '92 ', '93 ', '94 ', '98 ']
  policySub!: Subscription;
  dereg!: boolean;
  assumed!: boolean;
  canEditEndorsement: boolean = false;
  statusSub!: Subscription;
  endorsementChanged: boolean = false;
  endorsementSub!: Subscription;

  isPolicyEffectiveDateInvalid: boolean = false;
  PolicyEffectiveDateError: string = "";
  isPolicyExpirationDateInvalid: boolean = false;
  PolicyExpirationDateError: string = "";

  @ViewChild(NgForm, { static: false }) policyInfoForm!: NgForm;
  @ViewChild(NgForm) form: NgForm | undefined;
  @Input() public endorsement!: Endorsement;
  @Input() public policyInfo!: PolicyInformation;
  @Input() public accountInfo!: AccountInformation;

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
    this.populateClaimsMadeOccurrence();

    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
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

      this.policyInfoForm.form.markAsPristine();
      this.policyInfoForm.form.markAsUntouched();
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
      this.endorsementChanged = true;
      this.endorsementStatusService.reinsuranceValidated = false;
    }
  }

  populateClaimsMadeOccurrence() {
    this.claimsMadeOrOccurrence$ = [];
    this.claimsMadeOrOccurrence$.push({ code: "C", key: 0, description: "Claims-Made" });
    this.claimsMadeOrOccurrence$.push({ code: "O", key: 1, description: "Occurrence" });
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }
  get canEditProgramId(): boolean {
    return this.canEdit && this.endorsementStatusService.directQuote;
  }
  get canEditPolicySymbol(): boolean {
    return this.canEdit && this.endorsementStatusService.directQuote;
  }
  get canEditPolicyNumber(): boolean {
    return this.canEdit && this.endorsementStatusService.directQuote;
  }
}
