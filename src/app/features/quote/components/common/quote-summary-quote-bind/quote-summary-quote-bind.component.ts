import { Component, OnInit } from '@angular/core';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';

@Component({
  selector: 'rsps-quote-summary-quote-bind',
  templateUrl: './quote-summary-quote-bind.component.html',
  styleUrls: ['./quote-summary-quote-bind.component.css']
})
export class QuoteSummaryQuoteBindComponent implements OnInit {

  constructor(private pageDataService: PageDataService) { }

  ngOnInit(): void {
    //this.pageDataService.selectedProgram = null;
  }

}
