import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rsps-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {

  public message = '';
  public title = 'Error!';

  constructor(public activeModal: NgbActiveModal) { }

  close(val: string) {
    if (val == 'Yes') {
      this.activeModal.close(true);
    }
    this.activeModal.close(false);
  }

}
