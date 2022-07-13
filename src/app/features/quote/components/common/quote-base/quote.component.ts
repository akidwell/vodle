import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { Department } from '../../../models/department';

@Component({
  selector: 'rsps-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['../../../../../app.component.css', './quote.component.css']
})
export class QuoteComponent implements OnInit {
  prevSub!: Subscription;
  previousUrl = '';
  previousLabel = 'Previous';
  quote: Department[] = [];

  constructor(public headerPaddingService: HeaderPaddingService,private route: ActivatedRoute, private previousRouteService: PreviousRouteService, private router: Router) {
  }

  ngOnInit(): void {
    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    });
    this.route?.data.subscribe(data => {
      this.quote = data['quoteData'].department;
    });
  }
}
