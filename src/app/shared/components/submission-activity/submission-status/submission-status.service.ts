import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionStatus } from 'src/app/features/submission/models/submission-status';
import { SubmissionStatusComponent } from './submission-status.component';

@Injectable({
  providedIn: 'root'
})
export class SubmissionStatusService {

  constructor(private modalService: NgbModal) { }

  public async openDeadDecline(submission: SubmissionStatus): Promise<string> {
    const modalRef = this.modalService.open(SubmissionStatusComponent, { scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.submission = submission;
    return modalRef.result.then((result) => {
      return result;
    });
  }

  public async openReactivate(submission: SubmissionStatus): Promise<string> {
    const modalRef = this.modalService.open(SubmissionStatusComponent, { scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.submission = submission;
    modalRef.componentInstance.isReactivate = true;
    return modalRef.result.then((result) => {
      return result;
    });
  }

}
