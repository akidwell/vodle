import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, of, Subscription } from 'rxjs';
import { LineItemDescription } from 'src/app/features/policy/services/line-item-descriptions-service/line-item-description';
import { LineItemDescriptionsService } from 'src/app/features/policy/services/line-item-descriptions-service/line-item-descriptions.service';
import { QuoteLineItemClass } from 'src/app/features/quote/classes/quote-line-item-class';

@Component({
  selector: 'rsps-quote-line-items',
  templateUrl: './quote-line-items.component.html',
  styleUrls: ['./quote-line-items.component.css']
})
export class QuoteLineItemsComponent implements OnInit {
  @Input() public quoteLineItemData!: QuoteLineItemClass[];
  @Input() public riskState!: string| null;
  @Input() public effectiveDate!: Date | Moment | null;
  @Input() lineItem!: QuoteLineItemClass;



  lineitemDescriptions$: Observable<LineItemDescription[]> | undefined;
  lineitemDescriptions!: LineItemDescription[];
  itemDescriptionSub!: Subscription;

  constructor(private lineItemDescriptionsService: LineItemDescriptionsService) { }

  ngOnInit(): void {
    const myDate:Date = moment(this.effectiveDate).toDate();
    this.itemDescriptionSub = this.lineItemDescriptionsService.getLineItemDescriptions(this.riskState? this.riskState: '', myDate).subscribe({
      next: reisuranceCodes => {
        this.lineitemDescriptions = reisuranceCodes;
        this.lineitemDescriptions$ = of(reisuranceCodes);
      }
    });
  }

  changeLineItem(lineItemCode: LineItemDescription){
    this.lineItem.lineItemCode = lineItemCode.key;
    console.log(lineItemCode);
    console.log(this.lineItem.lineItemCode);
  }

}
