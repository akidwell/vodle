import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rsps-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {
  public errorMessage = '';
  public title = 'Error!';

  constructor(public activeModal: NgbActiveModal) { }

  close() {
    this.activeModal.close(true);
  }

}
