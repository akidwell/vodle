import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
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
  quote!: PropertyQuoteClass;

  classType = ClassTypeEnum.Quote;

  @Input() public program!: ProgramClass;
  @Input() public quoteBase!: QuoteClass;
  @Input() public rate!: QuoteRateClass;

  constructor(private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  ngOnInit(): void {
    this.quote = this.quoteBase as PropertyQuoteClass;
  }
}
