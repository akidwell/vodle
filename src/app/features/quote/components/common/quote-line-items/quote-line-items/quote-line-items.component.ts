import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, of, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { LineItemDescription } from 'src/app/features/policy/services/line-item-descriptions-service/line-item-description';
import { LineItemDescriptionsService } from 'src/app/features/policy/services/line-item-descriptions-service/line-item-descriptions.service';
import { QuoteLineItemClass } from 'src/app/features/quote/classes/quote-line-item-class';
import { QuoteLineItem } from 'src/app/features/quote/models/quote-line-item';

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
  @Output() copyLineItem: EventEmitter<QuoteLineItemClass> = new EventEmitter();
  @Output() deleteLineItem: EventEmitter<QuoteLineItemClass> = new EventEmitter();

  authSub: Subscription;
  canEdit = false;

  lineitemDescriptions$: Observable<LineItemDescription[]> | undefined;
  lineitemDescriptions!: LineItemDescription[];
  itemDescriptionSub!: Subscription;

  constructor(private lineItemDescriptionsService: LineItemDescriptionsService, private userAuth: UserAuth, private confirmationDialogService: ConfirmationDialogService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEdit = canEditSubmission
    );
  }

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


  openDeleteConfirmation() {
    this.confirmationDialogService.open('Delete Confirmation','Are you sure you want to delete this deductible?').then((result: boolean) => {
      if (result) {
        this.delete();
      }
    });
  }

  copy(): void {
    this.copyLineItem.emit(this.lineItem);
  }

  async delete() {
    this.deleteLineItem.emit(this.lineItem);
  }



}
