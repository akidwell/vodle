import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../classes/program-class';

@Component({
  selector: 'rsps-quote-program-base',
  templateUrl: './quote-program-base.component.html',
  styleUrls: ['./quote-program-base.component.css']
})
export class QuoteProgramBaseComponent {
  program!: ProgramClass | null;
  quoteId = 0;
  programSub!: Subscription;
  constructor(private pageDataService: PageDataService, private route: ActivatedRoute) {
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(routeParams => {
      this.pageDataService.getProgramWithQuote(routeParams.quoteId);
    });
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        setTimeout(() => {
          this.program = selectedProgram;
        });
      }
    );
  }
}
