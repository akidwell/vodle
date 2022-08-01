import { Component, Input, OnInit } from '@angular/core';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PropertyBuilding } from '../../../models/property-building';
import { PropertyQuote } from '../../../models/property-quote';
import { Quote } from '../../../models/quote';

@Component({
  selector: 'rsps-quote-property-detail',
  templateUrl: './quote-property-detail.component.html',
  styleUrls: ['./quote-property-detail.component.css']
})
export class QuotePropertyDetailComponent implements OnInit {
  @Input() public canEdit = false;
  @Input() public quote!: Quote;
  @Input() public classType!: ClassTypeEnum;
  @Input() public buildings!: PropertyBuilding[];



  constructor() {

  }


  ngOnInit(): void {
  }

}
