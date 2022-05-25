import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription, tap } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { Producer } from '../../models/producer';
import { Submission } from '../../models/submission';

@Component({
  selector: 'rsps-submission-info-panel-right',
  templateUrl: './submission-info-panel-right.component.html',
  styleUrls: ['./submission-info-panel-right.component.css']
})
export class SubmissionInfoPanelRightComponent implements OnInit {
  authSub: Subscription;
  canEditSubmission = false;
  lockSubmissionFields = false;
  currentDate = new Date();
  selectedProducer!: Subscription;
  underwriters$: Observable<Code[]> | undefined;
  departments$: Observable<Code[]> | undefined;
  @Input() public submission!: Submission;


  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private dropdowns: DropDownsService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }
  ngOnInit(): void {

    this.underwriters$ = this.dropdowns.getUnderwriters();
    this.departments$ = this.dropdowns.getDepartments();
    console.log('happens');
  }
  changeDepartment() {
    this.submission.producer = null;
    this.submission.producerContact = null;
    this.submission.producerCode = null;
    this.submission.producerContactId = null;
  }
  updateProducer(model: any) {
    if (model == null) {
      console.log('clear records');
      this.submission.producerCode = null;
    } else {
      this.submission.producerCode = model.producerCode;
    }
    this.submission.producer = model;
    this.submission.producerContactId = null;
    this.submission.producerContact = null;
    console.log(model);
  }
  updateProducerContact(model: any) {
    if (model == null) {
      console.log('clear records');
      this.submission.producerContactId = null;
    } else {
      this.submission.producerContactId = model.producerContactId;
    }
    this.submission.producerContact = model;
    console.log(model);
  }
  isFieldReadOnly(checkSubmissionLockStatus: boolean): boolean {
    if(!checkSubmissionLockStatus) {
      return !this.canEditSubmission;
    } else {
      if (this.lockSubmissionFields) {
        return true;
      } else {
        return !this.canEditSubmission;
      }
    }
  }
}


