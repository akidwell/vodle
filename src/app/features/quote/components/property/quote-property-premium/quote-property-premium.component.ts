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
  canEditSubmission = false;

  classType = ClassTypeEnum.Quote;

  @Input() public program!: ProgramClass;
  @Input() public quote!: PropertyQuoteClass;
  @Input() public rate!: QuoteRateClass;
  @Input() public totalPrem!: number | null;


  constructor(private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  ngOnInit(): void {
  }

  addDeductible() {
    if (this.classType == ClassTypeEnum.Quote) {
      const newDeductible = new PropertyQuoteDeductibleClass();
      newDeductible.sequence = this.getNextSequence();
      this.quote.propertyQuoteDeductibleList.push(newDeductible);
    }
    else if (this.classType == ClassTypeEnum.Policy) {
      //TODO
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
