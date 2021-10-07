import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faPlus, faAngleUp, faGlasses } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { EndorsementCoverage } from '../coverages/coverages';
import { SubCodeDefaultsService } from '../coverages/sub-code-defaults/sub-code-defaults.service';
import { SubCodeDefaults } from '../coverages/sub-code-defaults/subCodeDefaults';

@Component({
  selector: 'rsps-endorsement-coverage',
  templateUrl: './endorsement-coverage.component.html',
  styleUrls: ['./endorsement-coverage.component.css']
})
export class EndorsementCoverageComponent implements OnInit {
  ecCollapsed = true;
  firstExpand = true;
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
  showDeductible: boolean = false;
  showIncludeExlude: boolean = false;
  canEditPolicy: boolean = false;
  includeExclude: Code[] = [];
  isRetroDateRequired: boolean = false;
  isLimitsPatternValid: boolean = true;
  canEditLimitPattern: boolean = false;

  constructor(private dropdowns: DropDownsService, private userAuth: UserAuth, private subCodeDefaultsService: SubCodeDefaultsService) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.coverageDescriptions$ = this.dropdowns.getCoverageDescriptions(this.coverage.coverageCode, this.coverage.glClassCode, this.coverage.policySymbol, this.coverage.programId, this.coverage.coverageId);
    // this.exposureCodes$ = this.dropdowns.getExposureCodes();
    // this.actionCodes$ = this.dropdowns.getActionCodes();
    // this.premTypes$ = this.dropdowns.getPremTypes();
    // this.deductibleTypes$ = this.dropdowns.getDeductibleTypes();
    // this.classCodes$ = this.dropdowns.getClassCodes(this.coverage.programId,this.coverage.coverageCode);
    this.claimsMadeOrOccurrence$ = this.dropdowns.getClaimsMadeCodes();

    if ((this.coverage.coverageId ?? 0) > 0) {
      //this.includeExcludes$ = this.dropdowns.getIncludeExcludes(this.coverage.programId, this.coverage.coverageId ?? 0);

      this.changeCoverageDescription("open");

      // this.retroDateRequired = this.coverage.claimsMadeOrOccurrence == 'C';

      //this.canEditLimitPattern = this.coverage.includeExclude != 'E';

      // this.defaultsSub = this.subCodeDefaultsService.getSubCodeDefaults(this.coverage.programId, this.coverage.coverageId ?? 0).subscribe({
      //   next: subCodeDefaults => {
      //     this.subCodeDefaults = subCodeDefaults;
      //     this.showDeductible = subCodeDefaults.deductible;
      //     this.showIncludeExlude = subCodeDefaults.coverageIncluded || subCodeDefaults.coverageExcluded;
      //     this.retroDateRequired = this.canEditPolicy && this.coverage.claimsMadeOrOccurrence == 'C';
      //     this.populateExcludeInclude();
      //   }
      // });
    }
  }

  ngOnDestroy(): void {
    this.defaultsSub.unsubscribe();
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
        this.showIncludeExlude = subCodeDefaults.coverageIncluded || subCodeDefaults.coverageExcluded;
        if (event != "open") {
          if (!this.showDeductible) {
            this.coverage.deductible = null;
            this.coverage.deductibleType = null
          }
          if (!this.showIncludeExlude) {
            this.coverage.includeExclude = null;
          }
        }
        this.populateExcludeInclude();
        this.isLimitsPatternValid = this.limitsPatternValid();
      }
    });
  }

  changeClassCode() {
    if (this.coverage.programId != 84 && this.coverage.programId != 85) {
      this.coverage.coverageId = null;
    }
    this.coverageDescriptions$ = this.dropdowns.getCoverageDescriptions(this.coverage.coverageCode, this.coverage.glClassCode, this.coverage.policySymbol, this.coverage.programId, this.coverage.coverageId);
  }

  changeClaimsMadeOccurrence() {
    this.coverage.retroDate = null;
    this.isRetroDateRequired = this.retroDateRequired();
  }

  changeIncludeExclude(event: any) {
    if (event?.code == 'E') {
      this.coverage.limitsPattern = '';
    }
    this.canEditLimitPattern = this.isNotExcluded();
  }

  changeLimitsPattern() {
    this.isLimitsPatternValid = this.limitsPatternValid();
  }

  private retroDateRequired(): boolean {
    return this.coverage.claimsMadeOrOccurrence == 'C';
  }

  limitsPatternValid(): boolean {
    if (this.subCodeDefaults != null && this.isNotExcluded()) {
      let isValid = this.subCodeDefaults.defaultLimitPatternDescription.split("/").length == this.coverage.limitsPattern.split("/").length;
      for (let x of this.coverage.limitsPattern.split("/")) {
        if (x == "") {
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

  limitsPatternMask(): string {
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
    return this.coverage.includeExclude != 'E';
  }

  collapseExpand(event: boolean) {
    if (this.firstExpand) {
      this.actionCodes$ = this.dropdowns.getActionCodes();
      this.premTypes$ = this.dropdowns.getPremTypes();
      this.deductibleTypes$ = this.dropdowns.getDeductibleTypes();
      this.classCodes$ = this.dropdowns.getClassCodes(this.coverage.programId, this.coverage.coverageCode);
      this.exposureCodes$ = this.dropdowns.getExposureCodes();
      this.firstExpand = false;
    }
    this.ecCollapsed = event;
  }

  @Input()
  public coverage!: EndorsementCoverage;

  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgForm, { static: false }) endorsementCoveragesForm!: NgForm;
  formStatus!: string;
}
