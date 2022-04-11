import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faPlus, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { EndorsementCoverage } from '../coverages-base/coverages';
import { SubCodeDefaultsService } from '../../services/sub-code-defaults/sub-code-defaults.service';
import { SubCodeDefaults } from '../../models/subCodeDefaults';
import { PolicyInformation } from '../../models/policy';
import { PolicyService } from '../../services/policy/policy.service';
import { DatePipe } from '@angular/common';
import { EndorsementStoredValues } from 'src/app/features/policy/services/endorsement-stored-values/endorsement-stored-values.service';
import { UpdatePolicyChild } from '../../services/update-child/update-child.service';
import { LimitsPatternHelperService } from '../../services/limits-pattern-helper/limits-pattern-helper.service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';

@Component({
  templateUrl: './endorsement-coverage.component.html',
  styleUrls: ['./endorsement-coverage.component.css']
})
export class EndorsementCoverageComponent implements OnInit {
  ecCollapsed = true;
  faPlus = faPlus;
  faArrowUp = faAngleUp;
  authSub: Subscription;
  coverageDescriptions$: Observable<Code[]> | undefined;
  exposureCodes$: Observable<Code[]> | undefined;
  actionCodes$: Observable<Code[]> | undefined;
  premTypes$: Observable<Code[]> | undefined;
  deductibleTypes$: Observable<Code[]> | undefined;
  eachEmployeeDeductibleTypes$: Observable<Code[]> | undefined;
  classCodes$: Observable<Code[]> | undefined;
  claimsMadeOrOccurrence$: Observable<Code[]> | undefined;
  subCodeDefaults!: SubCodeDefaults;
  defaultsSub!: Subscription;
  deleteSub!: Subscription;
  showDeductible: boolean = false;
  showIncludeExlude: boolean = false;
  canEditPolicy: boolean = false;
  includeExclude: Code[] = [];
  isRetroDateRequired: boolean = false;
  isDeductibleRequired: boolean = false;
  isLimitsPatternValid: boolean = true;
  isRetroDateValid: boolean = true;
  canEditLimitPattern: boolean = false;
  canEditPremium: boolean = false;
  anchorId!: string;
  originalAction!: string;
  saveEventSubscription!: Subscription;
  collapsePanelSubscription!: Subscription;
  terrorismSubscription!: Subscription;
  showClaimsMade: boolean = false;
  canEditEndorsement: boolean = false;
  statusSub!: Subscription;
  limitMask: string= "";
  showEachEmployeeDeductible: boolean = false;

  @Input() public policyInfo!: PolicyInformation;
  @Input() public coverage!: EndorsementCoverage;
  @Output() status: EventEmitter<any> = new EventEmitter();
  @Output() copyExistingCoverage: EventEmitter<EndorsementCoverage> = new EventEmitter();
  @Output() deleteThisCoverage: EventEmitter<EndorsementCoverage> = new EventEmitter();
  @ViewChild(NgForm, { static: false }) endorsementCoveragesForm!: NgForm;

  constructor(private dropdowns: DropDownsService, private updatePolicyChild: UpdatePolicyChild,
    private userAuth: UserAuth, private subCodeDefaultsService: SubCodeDefaultsService, private endorsementStoredValuesService: EndorsementStoredValues,
    private policyService: PolicyService, private limitsPatternHelper: LimitsPatternHelperService, private endorsementStatusService: EndorsementStatusService,
    private datePipe: DatePipe) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    if (this.coverage.coverageCode != null && this.coverage.glClassCode != null && this.coverage.policySymbol != null && this.coverage.programId != null) {
      this.coverageDescriptions$ = this.dropdowns.getCoverageDescriptions(this.coverage.coverageCode, this.coverage.policySymbol, this.coverage.programId, this.coverage.glClassCode, this.coverage.coverageId);
    }

    this.actionCodes$ = this.dropdowns.getActionCodes();
    this.premTypes$ = this.dropdowns.getPremTypes();
    this.deductibleTypes$ = this.dropdowns.getDeductibleTypes();
    this.eachEmployeeDeductibleTypes$ = this.dropdowns.getEachEmployeeDeductible();
    this.classCodes$ = this.dropdowns.getClassCodes(this.coverage.programId, this.coverage.coverageCode);
    this.exposureCodes$ = this.dropdowns.getExposureCodes();
    this.claimsMadeOrOccurrence$ = this.dropdowns.getClaimsMadeCodes();

    this.anchorId = 'focusHere' + this.coverage.locationId + '-' + this.coverage.sequence;
    if ((this.coverage.coverageId ?? 0) > 0) {
      this.changeCoverageDescription("open");
    }
    this.originalAction = this.coverage.action;
    this.isRetroDateRequired = this.checkRetroDateRequired();

    if (this.coverage.isNew) {
      this.focus();
    }

    this.saveEventSubscription = this.updatePolicyChild.endorsementCoveragesObservable$.subscribe(() => {
      this.coverage.isNew = false;
      this.originalAction = this.coverage.action;
      this.endorsementCoveragesForm.form.markAsPristine();
    });
    this.collapsePanelSubscription = this.updatePolicyChild.collapseLocationsObservable$.subscribe(() => {
      this.ecCollapsed = true;
    });
    this.terrorismSubscription = this.updatePolicyChild.terrorismChange$.subscribe(() => {
      if (this.coverage.premiumType == "T") {
        this.endorsementCoveragesForm.form.markAsDirty();
      }
    });
  }

  ngOnDestroy(): void {
    this.defaultsSub?.unsubscribe();
    this.authSub.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.saveEventSubscription?.unsubscribe();
    this.collapsePanelSubscription?.unsubscribe();
    this.statusSub?.unsubscribe();
    this.terrorismSubscription?.unsubscribe();
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }

  copyCoverage(): void {
    this.copyExistingCoverage.emit(this.coverage);
  }

  focus(): void {
    this.ecCollapsed = false;
    setTimeout(() => {
      document.getElementById(this.anchorId)!.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 350);
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }

  populateExcludeInclude() {
    this.includeExclude = [];
    if (this.subCodeDefaults.coverageExcluded) {
      let code: Code = ({ code: "E", key: 0, description: "Excluded" });
      this.includeExclude = this.includeExclude.concat(code);
    }
    if (this.subCodeDefaults.coverageIncluded) {
      let code: Code = ({ code: "I", key: 0, description: "Included" });
      this.includeExclude = this.includeExclude.concat(code);
    }
  }

  changeCoverageDescription(event: any = "") {
    this.defaultsSub = this.subCodeDefaultsService.getSubCodeDefaults(this.coverage.programId, this.coverage.coverageId ?? 0,this.policyInfo.policySymbol, this.coverage.claimsMadeOrOccurrence == "C").subscribe({
      next: (subCodeDefaults: SubCodeDefaults) => {
        this.subCodeDefaults = subCodeDefaults;
        this.showDeductible = subCodeDefaults.deductible;
        this.showClaimsMade = subCodeDefaults.occurrenceOrClaimsMade;
        this.showIncludeExlude = subCodeDefaults.coverageIncluded || subCodeDefaults.coverageExcluded;
        if (event != "open") {
          if (!this.showDeductible) {
            this.coverage.deductible = null;
            this.coverage.deductibleType = null
          }
          if (!this.showIncludeExlude) {
            this.coverage.includeExclude = null;
          }
            if (!this.showClaimsMade) {
            this.coverage.claimsMadeOrOccurrence = null;
          }
        }
        this.populateExcludeInclude();
        this.isLimitsPatternValid = this.checkLimitsPatternValid();
        this.canEditLimitPattern = this.isNotExcluded();
        this.canEditPremium = this.coverage.includeExclude != 'E';
        if (!this.isNotExcluded()) {
          this.coverage.limitsPattern = '';
        }
        if (this.coverage.includeExclude == 'E') {
          this.coverage.premium = null;
        }
        this.coverage.limitsPatternGroupCode = subCodeDefaults.defaultLimitPatternGroupCode;
        this.isDeductibleRequired = this.checkDeductibleRequired();
        this.showEachEmployeeDeductible = this.showEachEmployeeDeductibles();
      }
    });
  }

  changeClassCode() {
    if (this.coverage.programId != 84 && this.coverage.programId != 85) {
      this.coverage.coverageId = null;
    }
    if (this.coverage.coverageCode != null && this.coverage.glClassCode != null && this.coverage.policySymbol != null && this.coverage.programId != null) {
      this.coverageDescriptions$ = this.dropdowns.getCoverageDescriptions(this.coverage.coverageCode, this.coverage.policySymbol, this.coverage.programId, this.coverage.glClassCode, this.coverage.coverageId);
    }
  }

  changeClaimsMadeOccurrence() {
    this.coverage.retroDate = null;
    this.isRetroDateRequired = this.checkRetroDateRequired();
    this.isRetroDateValid = this.checkRetroDateValid();
    this.showEachEmployeeDeductible = this.showEachEmployeeDeductibles();
    this.changeCoverageDescription();
  }

  changeIncludeExclude(event: any) {
    if (event?.code == 'E') {
      this.coverage.limitsPattern = '';
      this.coverage.premium = null;
    }
    this.canEditLimitPattern = this.isNotExcluded();
    this.canEditPremium = this.coverage.includeExclude != 'E';
  }

  changeLimitsPattern() {
    this.coverage.limitsPattern = this.limitsPatternHelper.parseLimitsPattern(this.coverage.limitsPattern, this.subCodeDefaults.defaultLimitPatternDescription.split("/").length)
    this.isLimitsPatternValid = this.checkLimitsPatternValid();
  }

  changeRetroDate() {
    this.isRetroDateValid = this.checkRetroDateValid();
  }

  private checkRetroDateRequired(): boolean {
    return this.coverage.claimsMadeOrOccurrence == 'C';
  }

  checkDeductibleRequired(): boolean {
    if (this.canEdit && this.showDeductible && (this.subCodeDefaults && this.subCodeDefaults.subCode == 336) && (this.endorsementStoredValuesService.SIR == null || this.endorsementStoredValuesService.SIR == 0)) {
      return true;
    } else {
      return false;
    }
  }
  checkDeductibleTypeRequired(): boolean {
    if (this.canEdit && this.showDeductible && (this.subCodeDefaults && this.subCodeDefaults.subCode == 336) && (this.endorsementStoredValuesService.SIR == null || this.endorsementStoredValuesService.SIR == 0)) {
      return true;
    } else if (this.coverage.deductible && this.coverage.deductible > 0) {
      return true
    } else {
      return false;
    }
  }

  private showEachEmployeeDeductibles(): boolean {
    // If Employee Benefits and Claims made then need to show the each employee drop down
    return this.coverage.claimsMadeOrOccurrence == 'C' && this.coverage.coverageId == 2223;
  }

  checkRetroDateValid(): boolean {
    if (this.coverage.retroDate != null && this.isRetroDateRequired) {
      const retroDate = Number(this.datePipe.transform(this.coverage.retroDate, 'yyyyMMdd'));
      const expirationDate = Number(this.datePipe.transform(this.policyInfo.policyExpirationDate, 'yyyyMMdd'));

      let isValid = (retroDate <= expirationDate);
      if (!isValid) {
        this.endorsementCoveragesForm.controls['retroDate'].setErrors({ 'incorrect': !isValid });
      }
      return isValid;
    }
    return true;
  }

  checkLimitsPatternValid(): boolean {
    if (this.subCodeDefaults != null && this.isNotExcluded()) {
      let isValid = this.subCodeDefaults.defaultLimitPatternDescription.split("/").length == this.coverage.limitsPattern.split("/").length;
      for (let x of this.coverage.limitsPattern.split("/")) {
        if ((x == "") || (x == '0')) {
          isValid = false;
        }
      }
      return isValid;
    }
    return true;
  }

  setLimitsPatternMask(): string {
    let mask: string = "";
    if (this.subCodeDefaults != null) {
      for (let x of this.subCodeDefaults.defaultLimitPatternDescription.split("/")) {
        mask = mask + "0*/";
      }
      mask = mask.slice(0, -1);
    }
   this.limitMask = mask.replace(/0/g, "");
    return mask;
  }

  private isNotExcluded(): boolean {
    return this.coverage.includeExclude != 'E' && this.subCodeDefaults.defaultLimitPatternBasis != '0';
  }

  collapseExpand(event: boolean) {
    this.ecCollapsed = event;
  }

  async deleteCoverage() {
    if (this.coverage.isNew) {
      this.deleteThisCoverage.emit(this.coverage);
    } else {
      const results$ = this.policyService.deleteEndorsementCoverage(this.coverage);
      return await lastValueFrom(results$).then(() => {
        this.deleteThisCoverage.emit(this.coverage);
      });
    }
  }
}

