import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentClass } from '../../classes/department-class';
import { ProgramClass } from '../../classes/program-class';
import { QuoteService } from '../quote-service/quote.service';

@Injectable()
export class QuoteSavingService {
  programSub!: Subscription;
  departmentSub!: Subscription;
  program: ProgramClass | null = null;
  department: DepartmentClass | null = null;
  constructor(
    private router: Router,
    private quoteService: QuoteService,
    public pageDataService: PageDataService
  ) {
    console.log('init');
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (program: ProgramClass | null) => {
        console.log(program);
        this.program = program;
      }
    );
    this.departmentSub = this.pageDataService.quoteData$.subscribe(
      (department: DepartmentClass | null) => {
        console.log(department);
        this.department = department;
      }
    );
  }
  async saveDepartment() {
    const department = this.department;
    console.log('program: ', this.program, 'department: ', this.department);
    if(department) {
      console.log(department);
      const results$ = this.quoteService.updateAllQuotes(department);
      await lastValueFrom(results$).then(async sequence => {
        console.log(sequence);
        if (sequence !== null) {
          this.router.navigate(['/quote/' + sequence + '/information']);
        }
        //this.newQuote = false;
        return true;
      });
    }
  }
  async saveQuote() {
    const quote = this.program?.quoteData;
    if (quote) {
      console.log('quotes: ', quote, 'id: ');
      const results$ = this.quoteService.updateQuote(quote);
      await lastValueFrom(results$).then(async sequence => {
        console.log(sequence);
        quote.sequenceNumber = sequence;
        //this.newQuote = false;
        return true;
      });
    }
  }
}
