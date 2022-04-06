import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { DirectPolicyComponent } from '../direct-policy/direct-policy.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['../../../../app.component.css','./home.component.css']
})
export class HomeComponent implements OnInit {
  directPolicySubscription!: Subscription;
  
  @ViewChild('modal') private directPolicyComponent!: DirectPolicyComponent

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.directPolicySubscription = this.navigationService.createDirectPolicy$.subscribe(() => {
      this.directPolicyComponent.open();
    });
  }

  ngOnDestroy(): void {
    this.directPolicySubscription.unsubscribe();
  }

}
