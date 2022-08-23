import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentClass } from '../../classes/department-class';
import { ProgramClass } from '../../classes/program-class';
import { PropertyDataService } from '../property-data.service';
import { QuoteService } from '../quote-service/quote.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteSavingService {
  programSub!: Subscription;
  departmentSub!: Subscription;
  program: ProgramClass | null = null;
  department: DepartmentClass | null = null;
  constructor(
    private router: Router,
    private quoteService: QuoteService,
    public pageDataService: PageDataService,
    private propertyDataService: PropertyDataService,
    private notification: NotificationService,
    private messageDialogService: MessageDialogService
  ) {
    console.log('init');
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (program: ProgramClass | null) => {
        this.program = program;
      }
    );
    this.departmentSub = this.pageDataService.quoteData$.subscribe(
      (department: DepartmentClass | null) => {
        this.department = department;
      }
    );
  }
  async saveDepartment() {
    const department = this.department;
    const isNew = this.department?.sequenceNumber === 0;
    if(department) {
      const results$ = this.quoteService.updateAllQuotes(department);
      await lastValueFrom(results$).then(async sequence => {
        console.log(sequence);
        if (isNew && sequence !== null) {
          this.router.navigate(['/quote/' + sequence + '/information']);
        }
        //this.newQuote = false;
        this.notification.show('Quote Saved.', {
          classname: 'bg-success text-light',
          delay: 5000,
        });
        department.afterSave();

        return true;
      });
    }
  }
  async saveQuote() {
    const quote = this.program?.quoteData;
    if (quote) {
      console.log('quotes: ', quote, 'id: ');
      const results$ = this.quoteService.updateQuote(quote);
      quote.quoteRates.forEach(x => x.classCode = Number(quote.classCode) );
      await lastValueFrom(results$)
        .then(async (quoteData) => {
          console.log('quoteData: ' + quoteData);
          this.program?.quoteData?.onSave(quoteData);
          quote.sequenceNumber = quoteData.sequenceNumber;
          this.propertyDataService.buildingList = quote.propertyQuote.buildingList;
          //this.newQuote = false;
          quote.afterSave();
          this.notification.show('Quote Saved.', {
            classname: 'bg-success text-light',
            delay: 5000,
          });
          return true;
        })
        .catch((error) => {
          this.messageDialogService.open('Quote Save Error!', error.error.Message);
        });
    }
  }
}
