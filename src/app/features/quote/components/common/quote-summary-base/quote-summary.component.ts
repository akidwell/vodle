import { Component, OnInit } from '@angular/core';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';

@Component({
  selector: 'rsps-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent implements OnInit {

  constructor(private pageDataService: PageDataService) { }

  ngOnInit(): void {
    this.pageDataService.selectedProgram = null;
  }

}
