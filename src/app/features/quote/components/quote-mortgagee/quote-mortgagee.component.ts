import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../classes/program-class';

@Component({
  selector: 'rsps-quote-mortgagee',
  templateUrl: './quote-mortgagee.component.html',
  styleUrls: ['./quote-mortgagee.component.css']
})
export class QuoteMortgageeComponent {
  program!: ProgramClass | null;
  quoteId = 0;
  programSub!: Subscription;

  constructor(private pageDataService: PageDataService) {
  }

  ngOnInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        this.program = selectedProgram;
      }
    );
  }
}
