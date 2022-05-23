import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Submission } from 'src/app/features/submission/models/submission';
import { SubmissionMarkComponent } from './submission-mark/submission-mark.component';

@Injectable({
  providedIn: 'root'
})
export class SubmissionMarkService {

  constructor(private modalService: NgbModal) { }

  public async open(submission: Submission): Promise<boolean> {
    const modalRef = this.modalService.open(SubmissionMarkComponent, { scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.submission = submission;
    return modalRef.result.then((result) => {
      return result;
    });
  }
}
