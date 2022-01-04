import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {

  constructor(private modalService: NgbModal) { }

  public async open(title: string, message: string) {
    const modalRef = this.modalService.open(ErrorDialogComponent, { scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.errorMessage = message;
  }
}
