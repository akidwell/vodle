import { Quote } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Moment } from 'moment';
import { QuoteLineItemClass } from 'src/app/features/quote/classes/quote-line-item-class';

@Component({
  selector: 'rsps-quote-line-items-group',
  templateUrl: './quote-line-items-group.component.html',
  styleUrls: ['./quote-line-items-group.component.css']
})
export class QuoteLineItemsGroupComponent implements OnInit {
  @Input() public quoteLineItemData!: QuoteLineItemClass[];
  @Input() public riskState!: string| null;
  @Input() public effectiveDate!: Date | Moment | null;
  constructor() { }

  ngOnInit(): void {
  }

}
