import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { PropertyQuoteDeductibleClass } from '../../../classes/property-quote-deductible-class';
import { QuoteClass } from '../../../classes/quote-class';
import { QuoteRateClass } from '../../../classes/quote-rate-class';
import { PropertyDeductible, PropertyQuoteDeductible } from '../../../models/property-deductible';
import { QuoteService } from '../../../services/quote-service/quote.service';
import { NotificationService } from 'src/app/core/components/notification/notification-service';

@Component({
  selector: 'rsps-quote-property-premium',
  templateUrl: './quote-property-premium.component.html',
  styleUrls: ['./quote-property-premium.component.css']
})
export class QuotePropertyPremiumComponent implements OnInit {
  accountCollapsed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  authSub: Subscription;
  canEdit = false;

  classType = ClassTypeEnum.Quote;

  @Input() public program!: ProgramClass;
  @Input() public quote!: PropertyQuoteClass;
  @Input() public rate!: QuoteRateClass;
  @Input() public totalPrem!: number | null;


  constructor(private userAuth: UserAuth, private quoteService: QuoteService, private notificationService: NotificationService) {
    this.authSub = this.userAuth.canEditQuote$.subscribe(
      (canEditQuote: boolean) => this.canEdit = canEditQuote
    );
  }

  ngOnInit(): void {
  }

  addDeductible() {
    this.accountCollapsed = false;
    const newDeductible = new PropertyQuoteDeductibleClass();
    newDeductible.sequence = this.getNextSequence();
    this.quote.propertyQuoteDeductibleList.push(newDeductible);
  }

  copyDeductible(deductible: PropertyDeductible) {
    // Need to copy deductible type?
    const copy = new PropertyQuoteDeductibleClass(deductible as PropertyQuoteDeductible);
    copy.sequence = this.getNextSequence();
    copy.guid = crypto.randomUUID();
    copy.isNew = true;
    this.quote.propertyQuoteDeductibleList.push(copy);
  }

  deleteDeductible(deductible: PropertyDeductible) {
    const index = this.quote.propertyQuoteDeductibleList.findIndex(x => x.sequence == deductible.sequence);
    if (index > -1) {
      this.quote.propertyQuoteDeductibleList[index].markForDeletion = true;
      const deductibleId = this.quote.propertyQuoteDeductibleList[index].propertyQuoteDeductibleId;
      if (!deductible.isNew && deductibleId != null) {
        this.quoteService
          .deleteDeductible(deductibleId)
          .subscribe(result => {
            if (result) {
              setTimeout(() => {
                this.notificationService.show('Deductible deleted.',{ classname: 'bg-success text-light', delay: 5000 });
              });
            }
          });
      }
      this.quote.propertyQuoteDeductibleList.splice(index, 1);
      this.quote.markDirty();
     }
  }

  getNextSequence(): number {
    if (this.quote.propertyQuoteDeductibleList.length == 0) {
      return 1;
    }
    else {
      return Math.max(...this.quote.propertyQuoteDeductibleList.map(o => o.sequence ?? 0)) + 1;
    }
  }

}
