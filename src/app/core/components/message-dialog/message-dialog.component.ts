import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rsps-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {
  public errorMessage: string = "";
  public title: string = "Error!";
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  close() { 
    this.activeModal.close(true);
  }

}
