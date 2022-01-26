import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faPlus, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { EndorsementCoverage } from '../../coverages';
import { SubCodeDefaultsService } from '../../sub-code-defaults/sub-code-defaults.service';
import { SubCodeDefaults } from '../../sub-code-defaults/subCodeDefaults';
import { PolicyInformation } from '../../../policy';
import { PolicyService } from '../../../policy.service';
import { UpdatePolicyChild } from '../../../services/update-child.service';
import { LimitsPatternHelperService } from 'src/app/policy/services/limits-pattern-helper.service';
import { EndorsementStatusService } from 'src/app/policy/services/endorsement-status.service';

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
  classCodes$: Observable<Code[]> | undefined;
  claimsMadeOrOccurrence$: Observable<Code[]> | undefined;
  subCodeDefaults!: SubCodeDefaults;
  defaultsSub!: Subscription;
  deleteSub!: Subscription;
  policyInfo!: PolicyInformation;
  showDeductible: boolean = false;
  showIncludeExlude: boolean = false;
  canEditPolicy: boolean = false;
  includeExclude: Code[] = [];
  isRetroDateRequired: boolean = false;
  isDeductibleRequired: boolean = false;
  isLimitsPatternValid: boolean = true;
  isRetroDateValid: boolean = true;
  canEditLimitPattern: boolean = false;
  anchorId!: string;
  originalAction!: string;
  saveEventSubscription!: Subscription;
  collapsePanelSubscription!: Subscription;
  showClaimsMade: boolean = false;
  canEditEndorsement: boolean = false;
  statusSub!: Subscription;

  constructor(private route: ActivatedRoute, private dropdowns: DropDownsService, private updatePolicyChild: UpdatePolicyChild,
    private userAuth: UserAuth, private subCodeDefaultsService: SubCodeDefaultsService, private policyService: PolicyService,
    private limitsPatternHelper: LimitsPatternHelperService, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    if (this.coverage.coverageCode != null && this.coverage.glClassCode != null && this.coverage.policySymbol != null && this.coverage.programId != null) {
      this.coverageDescriptions$ = this.dropdowns.getCoverageDescriptions(this.coverage.coverageCode, this.coverage.policySymbol, this.coverage.programId, this.coverage.glClassCode);
    }

    this.actionCodes$ = this.dropdowns.getActionCodes();
    this.premTypes$ = this.dropdowns.getPremTypes();
    this.deductibleTypes$ = this.dropdowns.getDeductibleTypes();
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
  }

  ngOnDestroy(): void {
    this.defaultsSub?.unsubscribe();
    this.authSub.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.saveEventSubscription?.unsubscribe();
    this.collapsePanelSubscription?.unsubscribe();
    this.statusSub?.unsubscribe();
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

  changeCoverageDescription(event: any) {
    this.defaultsSub = this.subCodeDefaultsService.getSubCodeDefaults(this.coverage.programId, this.coverage.coverageId ?? 0).subscribe({
      next: subCodeDefaults => {
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
        if (!this.canEditLimitPattern) {
          this.coverage.limitsPattern = '';
        }
        this.coverage.limitsPatternGroupCode = subCodeDefaults.defaultLimitPatternGroupCode;
        this.isDeductibleRequired = this.checkDeductibleRequired();
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
  }

  changeIncludeExclude(event: any) {
    if (event?.code == 'E') {
      this.coverage.limitsPattern = '';
    }
    this.canEditLimitPattern = this.isNotExcluded();
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

  private checkDeductibleRequired(): boolean {
    return this.subCodeDefaults.subCode == 336
  }

  checkRetroDateValid(): boolean {
    if (this.coverage.retroDate != null && this.isRetroDateRequired) {
      let isValid = (this.coverage?.retroDate <= this.policyInfo.policyExpirationDate);
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
      if (!isValid) {
        this.endorsementCoveragesForm.controls['limits'].setErrors({ 'incorrect': !isValid });
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
        return await this.policyService.deleteEndorsementCoverage(this.coverage).toPromise().then(() => {
        this.deleteThisCoverage.emit(this.coverage);
      });
    }
  }

  @Input() public coverage!: EndorsementCoverage;
  @Output() status: EventEmitter<any> = new EventEmitter();
  @Output() copyExistingCoverage: EventEmitter<EndorsementCoverage> = new EventEmitter();
  @Output() deleteThisCoverage: EventEmitter<EndorsementCoverage> = new EventEmitter();
  @ViewChild(NgForm, { static: false }) endorsementCoveragesForm!: NgForm;
}

