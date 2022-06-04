import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { SubmissionClass } from '../../classes/SubmissionClass';
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
  @Input() public submission!: SubmissionClass;


  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private dropdowns: DropDownsService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }
  ngOnInit(): void {

    this.underwriters$ = this.dropdowns.getUnderwriters().pipe(tap(x => {
      const foundCurrentUnderwriter = x.filter(p => p.key == this.submission.underwriter);
      console.log(foundCurrentUnderwriter, this.submission.underwriter, this.submission.underwriterName);

      if (foundCurrentUnderwriter.length == 0) {
        const expiredUnderwriter = {key: this.submission.underwriter || 0, description: this.submission.underwriterName || '', code: this.submission.underwriterName || ''};
        x.push(expiredUnderwriter);
      }
    }));
    this.departments$ = this.dropdowns.getDepartments();
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


