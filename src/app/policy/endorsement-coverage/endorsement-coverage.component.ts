import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faPlus, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
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
  faPlus = faPlus;
  faArrowUp = faAngleUp;
  // color = "blue"
  authSub: Subscription;
  coverageDescriptions$: Observable<Code[]> | undefined;
  exposureCodes$: Observable<Code[]> | undefined;
  actionCodes$: Observable<Code[]> | undefined;
  premTypes$: Observable<Code[]> | undefined;
  deductibleTypes$: Observable<Code[]> | undefined;
  classCodes$: Observable<Code[]> | undefined;
  includeExcludes$: Observable<Code[]> | undefined;
  claimsMadeOrOccurrence$: Observable<Code[]> | undefined;
  subCodeDefaults: SubCodeDefaults | undefined;
  defaultsSub!: Subscription;
  showDeductible: boolean = false;
  showIncludeExlude: boolean = false;
  retroDateRequired: boolean = false;
  canEditPolicy: boolean = false;

  constructor(private dropdowns: DropDownsService, private userAuth: UserAuth, private subCodeDefaultsService: SubCodeDefaultsService) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.coverageDescriptions$ = this.dropdowns.getCoverageDescriptions(this.coverage.coverageCode, this.coverage.glClassCode,this.coverage.policySymbol,this.coverage.programId,this.coverage.coverageId);
    this.exposureCodes$ = this.dropdowns.getExposureCodes();
    this.actionCodes$ = this.dropdowns.getActionCodes();
    this.premTypes$ = this.dropdowns.getPremTypes();
    this.deductibleTypes$ = this.dropdowns.getDeductibleTypes();
    this.classCodes$ = this.dropdowns.getClassCodes(this.coverage.programId,this.coverage.coverageCode);
    this.claimsMadeOrOccurrence$ = this.dropdowns.getClaimsMadeCodes();

    if ((this.coverage.coverageId ?? 0) > 0) {
      this.includeExcludes$ = this.dropdowns.getIncludeExcludes(this.coverage.programId, this.coverage.coverageId ?? 0);
      this.defaultsSub = this.subCodeDefaultsService.getSubCodeDefaults(this.coverage.programId, this.coverage.coverageId ?? 0).subscribe({
        next: subCodeDefaults => {
          this.subCodeDefaults = subCodeDefaults;
          this.showDeductible = subCodeDefaults.deductible;
          this.showIncludeExlude = subCodeDefaults.coverageIncluded || subCodeDefaults.coverageExcluded;
        }
      });
    }

  }

  ngOnDestroy(): void {
    this.defaultsSub.unsubscribe();
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }

  changeCoverageDescription(event : any) {
    this.includeExcludes$ = this.dropdowns.getIncludeExcludes(this.coverage.programId, this.coverage.coverageId ?? 0);

    this.defaultsSub = this.subCodeDefaultsService.getSubCodeDefaults(this.coverage.programId, this.coverage.coverageId ?? 0).subscribe({
      next: subCodeDefaults => {
        this.subCodeDefaults = subCodeDefaults;
        this.showDeductible = subCodeDefaults.deductible;
        this.showIncludeExlude = subCodeDefaults.coverageIncluded || subCodeDefaults.coverageExcluded;

        if (!this.showDeductible)
        {
          this.coverage.deductible = undefined;
          this.coverage.deductibleType = undefined
        }
        if (!this.showIncludeExlude)
        {
          this.coverage.includeExclude = undefined;
        }
      }
    });
  }

  changeClassCode(event: any) {
    if (this.coverage.programId != 84 && this.coverage.programId != 85) {
      this.coverage.coverageId = null;
    }
    this.coverageDescriptions$ = this.dropdowns.getCoverageDescriptions(this.coverage.coverageCode, this.coverage.glClassCode, this.coverage.policySymbol, this.coverage.programId, this.coverage.coverageId);
  }

  changeClaimsMadeOccurrence() {
    this.retroDateRequired = this.canEditPolicy && this.coverage.claimsMadeOrOccurrence == 'C';
    this.coverage.retroDate = null;
  }

  @Input()
  public coverage!: EndorsementCoverage;

  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgForm,  { static: false })endorsementCoveragesForm!: NgForm;
  formStatus!: string;
}
