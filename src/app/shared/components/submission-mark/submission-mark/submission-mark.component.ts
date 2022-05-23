import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SubmissionEventEnum } from 'src/app/core/enums/submission-event.enum';
import { SubmissionStatusEnum } from 'src/app/core/enums/submission-status-enum';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { Submission } from 'src/app/features/submission/models/submission';
import { SubmissionService } from 'src/app/features/submission/services/submission-service/submission-service';

@Component({
  selector: 'rsps-submission-mark',
  templateUrl: './submission-mark.component.html',
  styleUrls: ['./submission-mark.component.css']
})
export class SubmissionMarkComponent implements OnInit {
  authSub: Subscription;
  dirtySub!: Subscription | undefined;
  canEditSubmission = false;
  events$: Observable<Code[]> | undefined;
  deadReasons$: Observable<Code[]> | undefined;
  declineReasons$: Observable<Code[]> | undefined;
  isValid = false;

  @Input() submission!: Submission;
  @ViewChild('submissionMark', { static: false }) submissionMark!: NgForm;

  constructor(public activeModal: NgbActiveModal, private userAuth: UserAuth, private dropdowns: DropDownsService, private submissionService: SubmissionService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  async ngOnInit(): Promise<void> {
    this.events$ = this.dropdowns.getSubmissionEvents();
    this.deadReasons$ = this.dropdowns.getMarkDeadReasons((this.submission.NewRenewalFlag ?? 1) == 1);
    this.declineReasons$ = this.dropdowns.getMarkDeclineReasons();
    this.submission.StatusCode = SubmissionStatusEnum.Dead;
  }

  ngAfterViewInit(): void {
    this.dirtySub = this.submissionMark.statusChanges?.subscribe(() => {
      this.isValid = (this.submissionMark.dirty ?? false) && (this.submissionMark.valid ?? false);
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.dirtySub?.unsubscribe();
  }

  get showDeadReasons(): boolean {
    return this.submission.EventCode == SubmissionEventEnum.MarkedDead || this.submission.EventCode == null;
  }

  get canEditDeadReasons(): boolean {
    return this.canEditSubmission && this.submission.EventCode == SubmissionEventEnum.MarkedDead;
  }

  get showDeclineReasons(): boolean {
    return this.submission.EventCode == SubmissionEventEnum.Declined;
  }

  get canEditDeclineReasons(): boolean {
    return this.canEditSubmission && this.submission.EventCode == SubmissionEventEnum.Declined;
  }

  changeAction() {
    this.submission.ReasonCode = null;
  }

  get canSave(): boolean {
    return this.canEditSubmission && this.isValid;
  }

  async save() {
    // const results$ = this.submissionService.(this.submissionNumber);
    // this.submission = await lastValueFrom(results$);

    this.activeModal.close(true);
  }

  cancel() {
    this.activeModal.close(false);
  }
}
