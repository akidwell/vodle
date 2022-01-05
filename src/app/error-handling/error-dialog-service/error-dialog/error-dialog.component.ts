import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rsps-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {
  public errorMessage: string = "";
  public title: string = "Error!";
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  close() { 
    this.activeModal.close();
  }

}
