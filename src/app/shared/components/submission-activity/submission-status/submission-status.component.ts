import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SubmissionEventEnum } from 'src/app/core/enums/submission-event.enum';
import { SubmissionReasonEnum } from 'src/app/core/enums/submission-reason-enum';
import { SubmissionStatusEnum } from 'src/app/core/enums/submission-status-enum';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { SubmissionStatus } from 'src/app/features/submission/models/submission-status';
import { SubmissionService } from 'src/app/features/submission/services/submission-service/submission-service';

@Component({
  selector: 'rsps-submission-status',
  templateUrl: './submission-status.component.html',
  styleUrls: ['./submission-status.component.css']
})
export class SubmissionStatusComponent implements OnInit {
  authSub: Subscription;
  dirtySub!: Subscription | undefined;
  canEditSubmission = false;
  events$: Observable<Code[]> | undefined;
  deadReasons$: Observable<Code[]> | undefined;
  declineReasons$: Observable<Code[]> | undefined;
  reactivateReasons$: Observable<Code[]> | undefined;
  isValid = false;
  title = 'Mark Submission Dead/Decline';
  showBusy = false;

  @Input() submission!: SubmissionStatus;
  @Input() isReactivate = false;
  @ViewChild('submissionMark', { static: false }) submissionMark!: NgForm;

  constructor(public activeModal: NgbActiveModal, private userAuth: UserAuth, private dropdowns: DropDownsService, private submissionService: SubmissionService, private messageDialogService: MessageDialogService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  async ngOnInit(): Promise<void> {
    this.events$ = this.dropdowns.getSubmissionEvents();
    this.deadReasons$ = this.dropdowns.getMarkDeadReasons(this.submission.isNew);
    this.declineReasons$ = this.dropdowns.getMarkDeclineReasons();
    this.reactivateReasons$ = this.dropdowns.getReactivateReasons();

    if (this.isReactivate) {
      this.title = 'Reactivate Submission';
      this.submission.statusCode = SubmissionStatusEnum.Live;
      this.submission.eventCode = SubmissionEventEnum.Reactivated;
      this.submission.reasonCode = SubmissionReasonEnum.Reactivated;
    }
    else {
      this.submission.statusCode = SubmissionStatusEnum.Dead;
      this.submission.eventCode = null;
      this.submission.reasonCode = null;
    }
  }

  ngAfterViewInit(): void {
    this.dirtySub = this.submissionMark.statusChanges?.subscribe(() => {
      setTimeout(() => {
        this.isValid = (this.submissionMark.dirty ?? false) && (this.submissionMark.valid ?? false);
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.dirtySub?.unsubscribe();
  }

  get showActions(): boolean {
    return this.submission.statusCode == SubmissionStatusEnum.Dead;
  }

  get showDeadReasons(): boolean {
    return this.submission.statusCode == SubmissionStatusEnum.Dead && this.submission.eventCode == SubmissionEventEnum.MarkedDead || this.submission.eventCode == null;
  }

  get canEditDeadReasons(): boolean {
    return this.canEditSubmission && this.submission.eventCode == SubmissionEventEnum.MarkedDead;
  }

  get showDeclineReasons(): boolean {
    return this.submission.statusCode == SubmissionStatusEnum.Dead && this.submission.eventCode == SubmissionEventEnum.Declined;
  }

  get canEditDeclineReasons(): boolean {
    return this.canEditSubmission && this.submission.eventCode == SubmissionEventEnum.Declined;
  }

  get showReactivateReasons(): boolean {
    return this.submission.statusCode == SubmissionStatusEnum.Live && this.submission.eventCode == SubmissionEventEnum.Reactivated;
  }

  get canEditReactivateReasons(): boolean {
    return this.canEditSubmission && this.submission.eventCode == SubmissionEventEnum.Reactivated;
  }

  changeAction() {
    this.submission.reasonCode = null;
  }

  get canSave(): boolean {
    return this.canEditSubmission && this.isValid;
  }

  async save() {
    this.showBusy = true;
    const results$ = this.submissionService.updateSubmissionStatus(this.submission);
    await lastValueFrom(results$).then(result => {
      this.showBusy = false;
      this.activeModal.close(result.statusCode);
    },
    error => {
      this.showBusy = false;
      this.activeModal.close();
      const errorMessage = error.error?.Message ?? error.message;
      this.messageDialogService.open(this.title + ' Failed', 'Error Message: ' + errorMessage);
    });
  }

  cancel() {
    this.activeModal.close(false);
  }
}
