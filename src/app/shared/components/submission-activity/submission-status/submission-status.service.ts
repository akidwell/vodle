import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionStatus, SubmissionStatusResult } from 'src/app/features/submission/models/submission-status';
import { SubmissionStatusComponent } from './submission-status.component';

@Injectable({
  providedIn: 'root'
})
export class SubmissionStatusService {

  constructor(private modalService: NgbModal) { }

  public async openDeadDecline(submissionStatus: SubmissionStatus): Promise<SubmissionStatusResult> {
    const modalRef = this.modalService.open(SubmissionStatusComponent, { scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.submission = submissionStatus;
    return modalRef.result.then((result) => {
      return result;
    });
  }

  public async openReactivate(submissionStatus: SubmissionStatus): Promise<SubmissionStatusResult> {
    const modalRef = this.modalService.open(SubmissionStatusComponent, { scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.submission = submissionStatus;
    modalRef.componentInstance.isReactivate = true;
    return modalRef.result.then((result) => {
      return result;
    });
  }

}
