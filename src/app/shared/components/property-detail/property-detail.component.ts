import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';

@Component({
  selector: 'rsps-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  @Input() public canEdit = false;
  @Input() public propertyParent!: PropertyQuoteClass | PolicyClass;
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
  }
}
