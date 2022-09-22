import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { Department } from '../../../models/department';
import { QuoteSavingService } from '../../../services/quote-saving-service/quote-saving-service.service';
import { faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'rsps-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['../../../../../app.component.css', './quote.component.css']
})
export class QuoteComponent implements OnInit {
  prevSub!: Subscription;
  previousUrl = '';
  previousLabel = 'Previous';
  department!: Department;
  isSaving = false;
  saveSub!: Subscription;
  faSave = faSave;

  constructor(public headerPaddingService: HeaderPaddingService,private route: ActivatedRoute, private previousRouteService: PreviousRouteService, private quoteSavingService: QuoteSavingService) {
  }

  ngOnInit(): void {
    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    });
    this.route?.data.subscribe(data => {
      this.department = data['quoteData'].department;
    });
    this.saveSub = this.quoteSavingService.isSaving$.subscribe(isSaving => this.isSaving = isSaving);
  }

  ngOnDestroy() {
    this.prevSub?.unsubscribe();
    this.saveSub?.unsubscribe();
  }
}
