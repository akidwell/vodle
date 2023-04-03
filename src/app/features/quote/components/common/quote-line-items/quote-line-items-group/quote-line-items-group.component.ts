import { Component, Input, OnInit } from '@angular/core';
import { faAngleDoubleDown, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { QuoteLineItemClass } from 'src/app/features/quote/classes/quote-line-item-class';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';

@Component({
  selector: 'rsps-quote-line-items-group',
  templateUrl: './quote-line-items-group.component.html',
  styleUrls: ['./quote-line-items-group.component.css']
})
export class QuoteLineItemsGroupComponent implements OnInit {
  @Input() public quoteLineItemData!: QuoteLineItemClass[];
  @Input() public riskState!: string| null;
  @Input() public effectiveDate!: Date | Moment | null;
  @Input() public classType!: ClassTypeEnum;
  deleteSub!: Subscription;
  authSub: Subscription;
  canEdit = false;
  collapsed = false;
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;

  constructor(private notification: NotificationService, private quoteService: QuoteService, private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditQuote$.subscribe(
      (canEditQuote: boolean) => this.canEdit = canEditQuote
    );
  }

  ngOnInit(): void {
  }

  addLineItem() {
    const newLineItem = new QuoteLineItemClass();
    newLineItem.sequence = this.getNextSequence();
    this.quoteLineItemData.push(newLineItem);
    this.collapsed = false;
  }

  copyLineItem(lineItem: QuoteLineItemClass) {
    const newLineItem: QuoteLineItemClass = Object.create(lineItem);
    newLineItem.isNew = true;
    newLineItem.sequence = this.getNextSequence();
    newLineItem.markDirty();
    this.quoteLineItemData.push(newLineItem);
  }

  deleteLineItem(lineItem: QuoteLineItemClass) {
    const index = this.quoteLineItemData.indexOf(lineItem, 0);
    if (index > -1) {
      this.quoteLineItemData.splice(index, 1);
      if (!lineItem.isNew && lineItem.quoteId != null && lineItem.sequence != null) {
        this.deleteSub = this.quoteService.deleteLineItem(lineItem.quoteId, lineItem.sequence)
          .subscribe((result) => {
            if (result) {
              setTimeout(() => {
                this.notification.show('Line Item deleted.', { classname: 'bg-success text-light', delay: 5000 });
              });
            }
          });
      }
    }
  }

  getNextSequence(): number {
    if (this.quoteLineItemData.length == 0) {
      return 1;
    }
    else {
      return Math.max(...this.quoteLineItemData.map(o => o.sequence ?? 0)) + 1;
    }
  }
}
