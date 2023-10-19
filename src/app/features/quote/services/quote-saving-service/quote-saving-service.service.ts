import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, lastValueFrom, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentClass } from '../../classes/department-class';
import { ProgramClass } from '../../classes/program-class';
import { PropertyQuoteClass } from '../../classes/property-quote-class';
import { Quote } from '../../models/quote';
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

  isSaving$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isSaving= false;

  get isSaving(): boolean { return this._isSaving; }
  set isSaving(value: boolean) {
    this._isSaving = value;
    this.isSaving$.next(this._isSaving);
  }

  constructor(
    private router: Router,
    private quoteService: QuoteService,
    public pageDataService: PageDataService,
    private propertyDataService: PropertyDataService,
    private notification: NotificationService,
    private messageDialogService: MessageDialogService
  ) {
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
      this.isSaving = true;
      const results$ = this.quoteService.updateAllQuotes(department);
      await lastValueFrom(results$).then(async savedDepartment => {
        // Try to match the saved quotes by Id to the existing program quotes to refresh any saved data
        savedDepartment.programMappings.map(c => {
          if (c.quoteData?.propertyQuote != null) {
            const savedQuote = new PropertyQuoteClass(c.quoteData);
            const match = department.programMappings.filter(pm => pm.quoteData?.quoteId == c.quoteData?.quoteId);
            match.map(m => m.quoteData?.onSave(savedQuote));
          }
        });
        if (isNew && savedDepartment.sequenceNumber !== null) {
          this.router.navigate(['/quote/' + savedDepartment.sequenceNumber + '/information']);
        }
        this.notification.show('Quote Saved.', {
          classname: 'bg-success text-light',
          delay: 5000,
        });
        department.afterSave();
        this.isSaving = false;
        return true;
      });
    }
  }
  async saveQuote() {
    const quote = this.program?.quoteData;
    if (quote) {
      this.isSaving = true;
      const results$ = this.quoteService.updateQuote(quote);
      await lastValueFrom(results$)
        .then(async (quoteData: Quote) => {
          const savedQuote = new PropertyQuoteClass(quoteData);
          this.program?.quoteData?.onSave(savedQuote);
          quote.sequenceNumber = savedQuote.sequenceNumber;
          if (quote instanceof PropertyQuoteClass) {
            this.propertyDataService.buildingList = quote.buildingList;
          }
          quote.afterSave();
          this.notification.show('Quote Saved.', {
            classname: 'bg-success text-light',
            delay: 5000,
          });
          this.isSaving = false;
          return true;
        })
        .catch((error) => {
          this.isSaving = false;
          this.messageDialogService.open('Quote Save Error!', error.error.Message);
        });
    }
  }
}
