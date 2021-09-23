import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'rsps-reinsurance',
  templateUrl: './reinsurance.component.html',
  styleUrls: ['./reinsurance.component.css']
})
export class ReinsuranceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() status: EventEmitter<any> = new EventEmitter();
}
