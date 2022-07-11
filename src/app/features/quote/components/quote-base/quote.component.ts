import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { SubmissionClass } from 'src/app/features/submission/classes/SubmissionClass';
import { QuoteClass } from '../../classes/quote-class';

@Component({
  selector: 'rsps-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['../../../../app.component.css', './quote.component.css']
})
export class QuoteComponent implements OnInit {
  prevSub!: Subscription;
  previousUrl = '';
  previousLabel = 'Previous';
  quote: QuoteClass[] = [];

  constructor(public headerPaddingService: HeaderPaddingService,private route: ActivatedRoute, private previousRouteService: PreviousRouteService, private router: Router) {
  }

  ngOnInit(): void {
    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    });
    this.route?.data.subscribe(data => {
      this.quote = data['quoteData'].quote;
    });
  }
}