import { Component, Input, OnInit } from '@angular/core';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { Quote } from 'src/app/features/quote/models/quote';


@Component({
  selector: 'rsps-quote-property-detail-center',
  templateUrl: './quote-property-detail-center.component.html',
  styleUrls: ['./quote-property-detail-center.component.css']
})
export class QuotePropertyDetailCenterComponent implements OnInit {
  @Input() public quote!: Quote;
  @Input() public classType!: ClassTypeEnum;
  @Input() public canEdit = false;

  constructor() { }

  ngOnInit(): void {

  }


}
