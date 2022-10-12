import { Component, OnInit } from '@angular/core';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';

@Component({
  selector: 'rsps-quote-summary-submission-info',
  templateUrl: './quote-summary-submission-info.component.html',
  styleUrls: ['./quote-summary-submission-info.component.css']
})
export class QuoteSummarySubmissionInfoComponent implements OnInit {

  constructor(private pageDataService: PageDataService) { }

  ngOnInit(): void {
    //this.pageDataService.selectedProgram = null;
  }

}
