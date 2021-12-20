import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rsps-navigation-confirmation',
  templateUrl: './navigation-confirmation.component.html',
  styleUrls: ['./navigation-confirmation.component.css']
})
export class NavigationConfirmationComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  close(event: string) { 
    this.activeModal.close(event);
  }
}