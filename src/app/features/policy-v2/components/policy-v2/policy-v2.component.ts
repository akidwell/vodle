import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { PolicyClass } from '../../classes/policy-class';

@Component({
  selector: 'rsps-policy-v2',
  templateUrl: './policy-v2.component.html',
  styleUrls: ['./policy-v2.component.css']
})
export class PolicyV2Component implements OnInit {
  prevSub!: Subscription;
  previousUrl = '';
  previousLabel = 'Previous';
  policy!: PolicyClass;
  isSaving = false;
  saveSub!: Subscription;
  faSave = faSave;

  programSub!: Subscription;

  constructor(public headerPaddingService: HeaderPaddingService,private route: ActivatedRoute, private previousRouteService: PreviousRouteService) {
  }

  ngOnInit(): void {
    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    });
    this.route?.data.subscribe(data => {
      this.policy = data['policy'];
    });
    console.log(this.route?.data);
    console.log(this.policy);
    // this.saveSub = this.quoteSavingService.isSaving$.subscribe(isSaving => this.isSaving = isSaving);
  }

  ngOnDestroy() {
    this.prevSub?.unsubscribe();
    this.saveSub?.unsubscribe();
  }
}
