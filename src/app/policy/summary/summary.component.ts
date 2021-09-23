import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'rsps-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Output() status: EventEmitter<any> = new EventEmitter();

}
