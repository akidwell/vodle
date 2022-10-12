import { Component, OnInit } from '@angular/core';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';

@Component({
  selector: 'rsps-quote-summary-premium-detail',
  templateUrl: './quote-summary-premium-detail.component.html',
  styleUrls: ['./quote-summary-premium-detail.component.css']
})
export class QuoteSummaryPremiumDetailComponent implements OnInit {

  constructor(private pageDataService: PageDataService) { }

  ngOnInit(): void {
    //this.pageDataService.selectedProgram = null;
  }

}
