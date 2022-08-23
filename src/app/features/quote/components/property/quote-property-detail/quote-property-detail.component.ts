import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PropertyBuilding } from '../../../models/property-building';
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
  @Input() public subjectAmount!: Map<any,any>;
  @Input() public limitTotal!: number;
  @Input() public largestTiv!: number;
  @Input() public lawLimits!: number;
  @Input() public largestExposure!: number;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  collapsed = false;

  constructor() {

  }


  ngOnInit(): void {
    this.collapsed = false;

  }

}
