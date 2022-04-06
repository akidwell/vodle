import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageDialogComponent } from '../../components/message-dialog/message-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class MessageDialogService {

  constructor(private modalService: NgbModal) { }

  public async open(title: string, message: string): Promise<boolean> {
    const modalRef = this.modalService.open(MessageDialogComponent, { scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.errorMessage = message;
    return modalRef.result.then((result) => {
      return result;
    });
  }
}
