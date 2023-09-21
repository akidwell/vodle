import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { PropertyPolicyDeductibleClass } from 'src/app/features/policy-v2/classes/property-policy-deductible-class';
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
  @Input() public readOnlyQuote!: boolean;

  @Output() addDeduct: EventEmitter<PropertyDeductible> = new EventEmitter();
  @Output() copyDeduct: EventEmitter<PropertyDeductible> = new EventEmitter();
  @Output() deleteDeduct: EventEmitter<PropertyDeductible> = new EventEmitter();

  constructor(private notification: NotificationService, private quoteService: QuoteService) {
   }

  ngOnInit(): void {
  }

  addDeductible() {
    this.addDeduct.emit();
  }

  copyDeductible(deductible: PropertyDeductible) {
    this.copyDeduct.emit(deductible);
    // const clone = deepClone(deductible.toJSON());
    
    // const newMortgagee = new PropertyQuoteDeductibleClass(clone);
    
    // this.deductibles?.push(deductible);
  }

  deleteDeductible(deductible: PropertyDeductible) {
    this.deleteDeduct.emit(deductible);
    // const index = this.deductibles?.indexOf(deductible, 0);
    // if (index > -1) {
    //   // this.deductibles[index].markForDeletion = true;
    //   this.deductibles?.splice(index, 1);
    //   if (!deductible.isNew) {
    //     this.notification.show('Deductible deleted.', { classname: 'bg-success text-light', delay: 5000 });
    //   }
    //   //TODO: if else for propertyParent- quote deletes from DB immediately, policy deletes on the save
    // }
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
