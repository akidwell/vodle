import { Component, Input, OnInit } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { QuoteClass } from '../../../classes/quote-class';
import { QuoteService } from '../../../services/quote-service/quote.service';

@Component({
  selector: 'rsps-quote-property-location-coverage',
  templateUrl: './quote-property-location-coverage.component.html',
  styleUrls: ['./quote-property-location-coverage.component.css']
})
export class QuotePropertyLocationCoverageComponent implements OnInit {
  authSub: Subscription;
  canEditSubmission = false;
  quote!: QuoteClass | null;
  programSub!: Subscription;

  // @Input() public program!: ProgramClass;

  constructor(private userAuth: UserAuth, private quoteService: QuoteService, private pageDataService: PageDataService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  ngOnInit(): void {
    // if (this.program?.quoteData != null) {
    //   this.quote = this.program.quoteData;
    // }
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          this.quote = selectedProgram.quoteData;
        }
      }
    );
  }

  async import(e: any){
    console.log('Change input file'+ e);
    if (this.quote != null) {
      const results$ = this.quoteService.import(this.quote.submission.quoteActivity[0].sequenceNumber, e.target.files[0]);
      await lastValueFrom(results$).then((quote) => {
        if (this.pageDataService.selectedProgram != null) {
          this.pageDataService.selectedProgram.quoteData = new QuoteClass(quote);
          console.log('refresh');
          this.pageDataService.refreshProgram();
        // this.quote = new QuoteClass(quote)
        }
      });
    }
  }
}
