import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from '../policy/services/navigation.service';
import { DirectPolicyCreateComponent } from './direct-policy/direct-policy-create/direct-policy-create.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['../app.component.css','./home.component.css']
})
export class HomeComponent implements OnInit {
  directPolicySubscription!: Subscription;
  
  @ViewChild('modal') private directPolicyComponent!: DirectPolicyCreateComponent

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.directPolicySubscription = this.navigationService.createDirectPolicy$.subscribe(() => {
      console.log("Direct");
      this.directPolicyComponent.open();
    });
  }

  ngOnDestroy(): void {
    this.directPolicySubscription.unsubscribe();
  }

}
