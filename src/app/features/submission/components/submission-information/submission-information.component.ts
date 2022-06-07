import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Observable, Subscription, tap } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PreviousRouteService } from 'src/app/features/insured/services/previous-route/previous-route.service';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { SubmissionClass } from '../../classes/SubmissionClass';
import { SubmissionService } from '../../services/submission-service/submission-service';
import { SubmissionInfoPanelLeftComponent } from '../submission-info-panel-left/submission-info-panel-left.component';
import { SubmissionInfoPanelRightComponent } from '../submission-info-panel-right/submission-info-panel-right.component';


@Component({
  selector: 'rsps-submission-information',
  templateUrl: './submission-information.component.html',
  styleUrls: ['./submission-information.component.css']
})
export class SubmissionInformationComponent implements OnInit {
  submission!: SubmissionClass;
  canEditSubmission = false;
  authSub: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  showInvalid = false;
  invalidMessage = '';
  showBusy = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  submissionCollapsed = false;
  sicCodes$: Observable<Code[]> | undefined;
  loadingSic = false;
  naicsCodes$: Observable<Code[]> | undefined;
  loadingNaics = false;
  seCollapsed = false;
  formatDateForDisplay: FormatDateForDisplay;
  prevSub!: Subscription;
  previousUrl = '';
  previousLabel = 'Previous';
  invalidList = [];

  @ViewChild(NgForm, { static: false }) submissionInfoForm!: NgForm;
  @ViewChild(SubmissionInfoPanelRightComponent) submissionInfoPanelRight!: SubmissionInfoPanelRightComponent;
  @ViewChild(SubmissionInfoPanelLeftComponent) submissionInfoPanelLeft!: SubmissionInfoPanelLeftComponent;



  constructor(private route: ActivatedRoute, private router: Router, private dropdowns: DropDownsService,
    private submissionService: SubmissionService, private userAuth: UserAuth, private navigationService: NavigationService,
    private messageDialogService: MessageDialogService, private notification: NotificationService,private formatDateService: FormatDateForDisplay,
    private previousRouteService: PreviousRouteService) {
    this.formatDateForDisplay = formatDateService;
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      const position = previousUrl.lastIndexOf('/') + 1;
      this.previousLabel = 'Previous - ' + previousUrl.substring(position,position + 1).toUpperCase() + previousUrl.substring(position + 1, previousUrl.length);
    });
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.submission = data['submissionData'].submission;
    });
    this.sicCodes$ = this.dropdowns.getSicCodes()
      .pipe(tap(() => this.loadingSic = false));

    if (this.submission.sicCode != null) {
      this.naicsCodes$ = this.dropdowns.getNaicsCodes(this.submission.sicCode)
        .pipe(tap(() => this.loadingNaics = false));
    }
    else {
      this.loadingNaics = false;
    }

  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.addSub?.unsubscribe();
    this.updateSub?.unsubscribe();
  }
  routeToInsured(insuredCode: number) {
    //this.navigationService.resetPolicy();
    this.router.navigate(['/insured/' + insuredCode.toString() + '/information']);
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }
  prev() {
    console.log(this.previousUrl);
    this.router.navigate([this.previousUrl]);
  }
  changeSicCode() {
    if (this.submission.sicCode != null) {
      this.loadingNaics = true;
      this.submission.naicsCode = null;
      this.naicsCodes$ = this.dropdowns.getNaicsCodes(this.submission.sicCode)
        .pipe(tap(() => this.loadingNaics = false));
    }
    else {
      this.naicsCodes$ = new Observable<Code[]>();
    }
  }

  private adddressValid() {
    return true;
  }

  isDirty(): boolean {
    return this.submission.isDirty;
  }
  isValid(): boolean {
    return this.submission.isValid;
  }
  async save(): Promise<void> {
    this.showBusy = true;
    if (this.submission.isValid){
      this.hideInvalid();
    } else {
      this.showInvalidControls();
      return;
    }
    if (this.submission.submissionNumber === 0) {
      const results$ = this.submissionService.postSubmission(this.submission);
      await lastValueFrom(results$).then(async submission => {
        this.submission.submissionNumber = submission.submissionNumber;
        this.submission.markClean();
        this.notification.show('Submission successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        if (this.submission.submissionNumber !== null) {
          this.router.navigate(['/submission/' + this.submission.submissionNumber?.toString() + '/information']);
        }
        return true;
      },
      (error) => {
        this.notification.show('Submission Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open('Submission Save Error', errorMessage);
        return false;
      });
    } else {
      const results$ = this.submissionService.updateSubmission(this.submission);
      await lastValueFrom(results$).then(async () => {
        this.submission.markClean();
        this.notification.show('Submission successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        return true;
      },
      (error) => {
        this.notification.show('Submission Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open('Submission Save Error', errorMessage);
        return false;
      });
    }
    this.showBusy = false;
  }

  showInvalidControls(): void {
    this.invalidMessage = '';
    // Compile all invalide controls in a list
    if (this.submission.invalidList.length > 0) {
      this.showInvalid = true;
      for (const error of this.submission.invalidList) {
        this.invalidMessage += '<br><li>' + error;
      }
    }

    if (this.showInvalid) {
      this.invalidMessage = 'Following fields are invalid' + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }


}
