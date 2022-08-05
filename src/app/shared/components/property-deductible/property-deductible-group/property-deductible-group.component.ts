import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PropertyQuoteDeductibleClass } from 'src/app/features/quote/classes/property-quote-deductible-class';
import { PropertyDeductible } from 'src/app/features/quote/models/property-deductible';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';

@Component({
  selector: 'rsps-property-deductible-group',
  templateUrl: './property-deductible-group.component.html',
  styleUrls: ['./property-deductible-group.component.css']
})
export class PropertyDeductibleGroupComponent implements OnInit {
  deleteSub!: Subscription;

  @Input() public programId!: number;
  @Input() public deductibles!: PropertyDeductible[];
  @Input() public canEdit = false;
  @Input() public classType!: ClassTypeEnum;

  constructor(private notification: NotificationService, private quoteService: QuoteService) { }

  ngOnInit(): void {
  }

  addDeductible() {
    if (this.classType == ClassTypeEnum.Quote) {
      const newDeductible = new PropertyQuoteDeductibleClass();
      newDeductible.sequence = this.getNextSequence();
      this.deductibles.push(newDeductible);
    }
    else if (this.classType == ClassTypeEnum.Policy) {
      //TODO
    }
  }

  deleteDeductible(deductible: PropertyDeductible) {
    const index = this.deductibles.indexOf(deductible, 0);
    if (index > -1) {
      this.deductibles.splice(index, 1);
      if (!deductible.isNew && deductible.propertyQuoteDeductibleId != null) {
        this.deleteSub = this.quoteService
          .deleteDeductible(deductible.propertyQuoteDeductibleId)
          .subscribe((result) => {
            if (result) {
              setTimeout(() => {
                this.notification.show('Deductible deleted.', { classname: 'bg-success text-light', delay: 5000 });
              });
            }
          });
      }
    }
  }

  getNextSequence(): number {
    if (this.deductibles.length == 0) {
      return 1;
    }
    else {
      return Math.max(...this.deductibles.map(o => o.sequence ?? 0)) + 1;
    }
  }

}
