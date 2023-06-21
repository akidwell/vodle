import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PropertyQuoteBuildingClass } from '../../../classes/property-quote-building-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { PropertyBuildingClass } from '../../../classes/property-building-class';

@Component({
  selector: 'rsps-quote-property-detail',
  templateUrl: './quote-property-detail.component.html',
  styleUrls: ['./quote-property-detail.component.css']
})
export class QuotePropertyDetailComponent implements OnInit {
  @Input() public canEdit = false;
  @Input() public quote!: PropertyQuoteClass;
  @Input() public classType!: ClassTypeEnum;
  @Input() public buildings!: PropertyBuildingClass[];
  @Input() public subjectAmount!: Map<any,any>;
  @Input() public limitTotal!: number;
  @Input() public largestTiv!: number;
  @Input() public lawLimits!: number;
  @Input() public largestExposure!: number;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  collapsed = false;

  ngOnInit(): void {
    this.collapsed = false;
    console.log('QUOTE' + this.quote);
    console.log('SUBJECT Amount:' + this.limitTotal);
  }

}
