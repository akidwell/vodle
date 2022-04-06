import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(private modalService: NgbModal) { }

  public async open(title: string, message: string): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    return modalRef.result.then((result) => {
      return result;
    });
  }
}
