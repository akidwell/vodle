import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {

  constructor(private modalService: NgbModal) { }

  public async open(title: string, message: string): Promise<boolean> {
    const modalRef = this.modalService.open(ErrorDialogComponent, { scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.errorMessage = message;
    return modalRef.result.then((result) => {
      return result;
    });
  }
}
