import { Component, OnInit, ViewChild } from '@angular/core';
import { DirectPolicyCreateComponent } from './direct-policy-create/direct-policy-create.component';

@Component({
  selector: 'rsps-direct-policy',
  templateUrl: './direct-policy.component.html',
  styleUrls: ['./direct-policy.component.css']
})
export class DirectPolicyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //this.createQuote();
  }

  //@ViewChild('modal') private directPolicyComponent!: DirectPolicyCreateComponent

  createQuote() {
   // var result = this.directPolicyComponent.open();
  }
}
