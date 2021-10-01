import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faPlus, faArrowUp, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { EndorsementCoverage } from '../coverages/coverages';

@Component({
  selector: 'rsps-endorsement-coverage',
  templateUrl: './endorsement-coverage.component.html',
  styleUrls: ['./endorsement-coverage.component.css']
})
export class EndorsementCoverageComponent implements OnInit {
  ecCollapsed = true;
  faPlus = faPlus;
  faArrowUp = faAngleUp;
  color = "blue"
  authSub: Subscription;
  coverageDescriptions$: Observable<Code[]> | undefined;
  exposureCodes$: Observable<Code[]> | undefined;
  actionCodes$: Observable<Code[]> | undefined;
  premTypeCodes$: Observable<Code[]> | undefined;
  deductibleTypes$: Observable<Code[]> | undefined;
  classCodes$: Observable<Code[]> | undefined;
  includeExcludes$: Observable<Code[]> | undefined;
  claimsMadeOrOccurrence$: Observable<Code[]> | undefined;

  canEditPolicy: boolean = false;
    constructor(private dropdowns: DropDownsService, private userAuth: UserAuth) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
     (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
   );
  }

  ngOnInit(): void {
    this.coverageDescriptions$ = this.dropdowns.getCoverageDescriptions(this.coverage.coverageCode, this.coverage.glClassCode,this.coverage.policySymbol);
    this.exposureCodes$ = this.dropdowns.getExposureCodes();
    this.actionCodes$ = this.dropdowns.getActionCodes();
    this.premTypeCodes$ = this.dropdowns.getPremTypeCodes();
    this.deductibleTypes$ = this.dropdowns.getDeductibleTypes();
    this.classCodes$ = this.dropdowns.getClassCodes(this.coverage.coverageCode);
    this.includeExcludes$ = this.dropdowns.getIncludeExcludes(this.coverage.programId, this.coverage.coverageId);
    this.claimsMadeOrOccurrence$ = this.dropdowns.getClaimsMadeCodes();
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description.toLowerCase() === term;
  }
  @Input()
  public coverage!: EndorsementCoverage;

  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgForm,  { static: false })endorsementCoveragesForm!: NgForm;
  formStatus!: string;
}
