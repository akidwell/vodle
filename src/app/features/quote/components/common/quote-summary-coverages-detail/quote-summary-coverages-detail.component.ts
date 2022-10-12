import { Component, OnInit } from '@angular/core';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';

@Component({
  selector: 'rsps-quote-summary-coverages-detail',
  templateUrl: './quote-summary-coverages-detail.component.html',
  styleUrls: ['./quote-summary-coverages-detail.component.css']
})
export class QuoteSummaryCoveragesDetailComponent implements OnInit {

  constructor(private pageDataService: PageDataService) { }

  ngOnInit(): void {
    //this.pageDataService.selectedProgram = null;
  }

}
