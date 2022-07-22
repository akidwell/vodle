import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';

@Component({
  selector: 'rsps-property-building',
  templateUrl: './property-building.component.html',
  styleUrls: ['./property-building.component.css']
})
export class PropertyBuildingComponent implements OnInit {

  @Input() public building!: PropertyBuilding;
  @Input() public canEdit = false;
  @Output() deleteBuilding: EventEmitter<PropertyBuilding> = new EventEmitter();
  @Output() copyBuilding: EventEmitter<PropertyBuilding> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
