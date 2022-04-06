import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rsps-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  public message: string = "";
  public title: string = "Error!";
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  close(val: any) {
    if (val == "Yes") {
      this.activeModal.close(true);
    }
    this.activeModal.close(false);
  }

}
