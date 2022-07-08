import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { ProducerContactClass } from '../../classes/ProducerContactClass';
import { SubmissionClass } from '../../classes/SubmissionClass';
import { Producer } from '../../models/producer';

@Component({
  selector: 'rsps-submission-info-panel-right',
  templateUrl: './submission-info-panel-right.component.html',
  styleUrls: ['./submission-info-panel-right.component.css']
})
export class SubmissionInfoPanelRightComponent {
  authSub: Subscription;
  canEditSubmission = false;
  lockSubmissionFields = false;
  currentDate = new Date();
  selectedProducer!: Subscription;

  @Input() public submission!: SubmissionClass;


  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private dropdowns: DropDownsService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  updateProducer(model: Producer | null) {
    if (model == null) {
      this.submission.producerCode = null;
    } else {
      this.submission.producerCode = model.producerCode;
    }
    this.submission.producer = model;
    this.submission.producerContactId = null;
    this.submission.producerContact = null;
  }
  updateProducerContact(model: ProducerContactClass | null) {
    if (model == null) {
      this.submission.producerContactId = null;
    } else {
      this.submission.producerContactId = model.contactId;
    }
    this.submission.producerContact = model;
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


