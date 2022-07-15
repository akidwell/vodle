import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ProgramClass } from '../../../classes/program-class';
import { QuoteClass } from '../../../classes/quote-class';

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
  quote!: QuoteClass;
  canEditSubmission = false;

  @Input() public program!: ProgramClass;

  constructor(private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  ngOnInit(): void {
    if (this.program.quoteData != null) {
      this.quote = this.program.quoteData;
    }
  }
}
