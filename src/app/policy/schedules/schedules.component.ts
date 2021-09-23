import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CoveragesComponent } from '../coverages/coverages.component';

@Component({
  selector: 'rsps-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Output() status: EventEmitter<any> = new EventEmitter();

}
