import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, tap } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { HistoricRoute } from 'src/app/core/models/historic-route';
import { APIVersionService } from 'src/app/core/services/api-version-service/api-version.service';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { SubmissionClass } from '../../../features/submission/classes/submission-class';
import { SubmissionInfoPanelLeftComponent } from '../../../features/submission/components/submission-info-panel-left/submission-info-panel-left.component';
import { SubmissionInfoPanelRightComponent } from '../../../features/submission/components/submission-info-panel-right/submission-info-panel-right.component';

@Component({
  selector: 'rsps-submission-information',
  templateUrl: './submission-information.component.html',
  styleUrls: ['./submission-information.component.css'],
})
export class SubmissionInformationComponent implements OnInit {
  canEditSubmission = false;
  authSub: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  showInvalid = false;
  invalidMessage = '';
  showWarnings = false;
  warningMessage = '';
  showBusy = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  submissionCollapsed = false;
  sicCodes$: Observable<Code[]> | undefined;
  loadingSic = false;
  naicsCodes$: Observable<Code[]> | undefined;
  loadingNaics = false;
  formatDateForDisplay: FormatDateForDisplay;
  underwriters$: Observable<Code[]> | undefined;
  departments$: Observable<Code[]> | undefined;
  prevSub!: Subscription;
  previousUrl = '';
  previousLabel = 'Previous';
  invalidList = [];
  quoteStatus$: Observable<Code[]> | undefined;
  programs$: Observable<Code[]> | undefined;
  private _submission!: SubmissionClass;
  version = ''; // TEMP for quote create
  versionSub!: Subscription;

  @Input() set submission(value: SubmissionClass) {
    this._submission = value;
    this.reload() ;
  }
  get submission(): SubmissionClass {
    return this._submission;
  }
  @Input() public quoteDescription!: string;

  @ViewChild(NgForm, { static: false }) submissionInfoForm!: NgForm;
  @ViewChild(SubmissionInfoPanelRightComponent)
    submissionInfoPanelRight!: SubmissionInfoPanelRightComponent;
  @ViewChild(SubmissionInfoPanelLeftComponent)
    submissionInfoPanelLeft!: SubmissionInfoPanelLeftComponent;

  constructor(
    private router: Router,
    private dropdowns: DropDownsService,
    private userAuth: UserAuth,
    private navigationService: NavigationService,
    private formatDateService: FormatDateForDisplay,
    public pageDataService: PageDataService,
    private previousRouteService: PreviousRouteService,
    private apiService: APIVersionService
  ) {
    this.formatDateForDisplay = formatDateService;
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => (this.canEditSubmission = canEditSubmission)
    );
    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    });
  }

  ngOnInit(): void {
    this.sicCodes$ = this.dropdowns.getSicCodes().pipe(tap(() => (this.loadingSic = false)));
    this.quoteStatus$ = this.dropdowns.getQuoteStatus();
    this.programs$ = this.dropdowns.getPrograms();
    // Used for toggling Create Quote - TEMP
    // this.version = this.apiService.getApiVersion;
    this.versionSub = this.apiService.apiVersion$.subscribe(version => this.version = version);
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.addSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.versionSub?.unsubscribe();
  }

  private reload() {
    this.departments$ = this.dropdowns.getDepartments(this.submission.departmentCode);
    this.underwriters$ = this.dropdowns.getUnderwriters().pipe(
      tap((x) => {
        const foundCurrentUnderwriter = x.filter((p) => p.key == this.submission.underwriter);
        if (foundCurrentUnderwriter.length == 0) {
          const expiredUnderwriter = {
            code: this.submission.underwriterName || '',
            key: this.submission.underwriter || 0,
            description: this.submission.underwriterName || ''
          };
          x.push(expiredUnderwriter);
        }
      })
    );
    if (this.submission.sicCode != null) {
      this.naicsCodes$ = this.dropdowns
        .getNaicsCodes(this.submission.sicCode)
        .pipe(tap(() => (this.loadingNaics = false)));
    } else {
      this.loadingNaics = false;
    }
  }

  routeToInsured(insuredCode: number) {
    this.navigationService.clearReuse();
    const subRoute: HistoricRoute = this.createRoute(this.submission);
    this.pageDataService.lastSubmission = subRoute;
    this.router.navigate(['/insured/' + insuredCode.toString() + '/information']);
  }

  routeToNewQuote() {
    this.navigationService.clearReuse();
    this.router.navigate(['/quote/information'], {
      state: { submission: this.submission }
    });
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return (
      item.code?.toLowerCase().indexOf(term) > -1 ||
      item.key?.toString().toLowerCase().indexOf(term) > -1 ||
      item.description?.toLowerCase().indexOf(term) > -1
    );
  }
  prev() {
    this.router.navigate([this.previousUrl]);
  }
  changeSicCode() {
    if (this.submission.sicCode != null) {
      this.loadingNaics = true;
      this.submission.naicsCode = null;
      this.naicsCodes$ = this.dropdowns
        .getNaicsCodes(this.submission.sicCode)
        .pipe(tap(() => (this.loadingNaics = false)));
    } else {
      this.naicsCodes$ = new Observable<Code[]>();
    }
  }

  isDirty(): boolean {
    return this.submission.isDirty;
  }
  isValid(): boolean {
    return this.submission.isValid;
  }

  hideWarnings(): void {
    this.showWarnings = false;
  }
  private createRoute(val: SubmissionClass): HistoricRoute {
    return {
      url: '/submission/' + val.submissionNumber?.toString() + '/information',
      type: 'Submission',
      description: 'Submission# ' + val.submissionNumber,
    };
  }
}
