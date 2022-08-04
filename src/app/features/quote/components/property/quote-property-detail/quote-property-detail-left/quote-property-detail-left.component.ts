import { Component, Input, OnInit } from '@angular/core';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';
import { PropertyBuildingCoverage } from 'src/app/features/quote/models/property-building-coverage';
import { Quote } from 'src/app/features/quote/models/quote';

@Component({
  selector: 'rsps-quote-property-detail-left',
  templateUrl: './quote-property-detail-left.component.html',
  styleUrls: ['./quote-property-detail-left.component.css']
})
export class QuotePropertyDetailLeftComponent implements OnInit {
  @Input() public quote!: Quote;
  @Input() public classType!: ClassTypeEnum;
  @Input() public canEdit = false;
  @Input() public buildings!: PropertyBuilding[];
  @Input() public subjectAmount!: Map<any, any>;
  @Input() public limitTotal!: number;
  @Input() public largestTiv!: number;

  number!: number;

  propBuildings: PropertyBuildingCoverage[] = [];

  constructor() { }

  ngOnInit(): void {
  }




}
